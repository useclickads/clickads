import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type PresenceUser = { id: string; name: string; email: string; color: string; cursor?: { x: number; y: number }; selectedBlockId?: string | null };

type Operation = {
  type: 'insert' | 'delete' | 'move' | 'update';
  blockId: string;
  index?: number;
  toIndex?: number;
  props?: Record<string, unknown>;
  block?: unknown;
  version: number;
  userId: string;
  timestamp: number;
};

const PRESENCE_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be185d', '#4f46e5'];

@WebSocketGateway({ namespace: '/realtime', cors: { origin: '*' } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private rooms = new Map<string, Map<string, PresenceUser>>();
  private documentVersions = new Map<string, number>();
  private operationLogs = new Map<string, Operation[]>();

  handleConnection(client: Socket) {
    client.data.userId = client.handshake.query.userId;
    client.data.userName = client.handshake.query.userName;
    client.data.userEmail = client.handshake.query.userEmail;
  }

  handleDisconnect(client: Socket) {
    const roomId = client.data.roomId;
    if (roomId && this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId)!;
      room.delete(client.id);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      } else {
        this.server.to(roomId).emit('presence:users', Array.from(room.values()));
      }
    }
  }

  @SubscribeMessage('presence:join')
  handlePresenceJoin(client: Socket, payload: { projectId: string; pageId: string; user: { id: string; name: string; email: string } }) {
    const roomId = `page:${payload.projectId}:${payload.pageId}`;
    client.data.roomId = roomId;
    client.join(roomId);

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }

    const room = this.rooms.get(roomId)!;
    const colorIndex = room.size % PRESENCE_COLORS.length;
    const user: PresenceUser = {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      color: PRESENCE_COLORS[colorIndex],
    };
    room.set(client.id, user);

    this.server.to(roomId).emit('presence:users', Array.from(room.values()));
  }

  @SubscribeMessage('presence:leave')
  handlePresenceLeave(client: Socket) {
    const roomId = client.data.roomId;
    if (roomId && this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId)!;
      room.delete(client.id);
      client.leave(roomId);
      this.server.to(roomId).emit('presence:users', Array.from(room.values()));
    }
  }

  @SubscribeMessage('cursor:move')
  handleCursorMove(client: Socket, payload: { x: number; y: number }) {
    const roomId = client.data.roomId;
    if (roomId && this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId)!;
      const user = room.get(client.id);
      if (user) {
        user.cursor = payload;
        client.to(roomId).emit('cursor:moved', { userId: user.id, cursor: payload, color: user.color, name: user.name });
      }
    }
  }

  @SubscribeMessage('block:select')
  handleBlockSelect(client: Socket, payload: { blockId: string | null }) {
    const roomId = client.data.roomId;
    if (roomId && this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId)!;
      const user = room.get(client.id);
      if (user) {
        user.selectedBlockId = payload.blockId;
        client.to(roomId).emit('block:selected', { userId: user.id, blockId: payload.blockId, color: user.color, name: user.name });
      }
    }
  }

  @SubscribeMessage('block:update')
  handleBlockUpdate(client: Socket, payload: { blockId: string; props: Record<string, unknown> }) {
    const roomId = client.data.roomId;
    if (roomId) {
      client.to(roomId).emit('block:updated', { userId: client.data.userId, ...payload });
    }
  }

  @SubscribeMessage('comment:create')
  handleCommentCreate(client: Socket, payload: { projectId: string; pageId: string; text: string; blockId?: string }) {
    const roomId = client.data.roomId || `page:${payload.projectId}:${payload.pageId}`;
    this.server.to(roomId).emit('comment:created', {
      user: { id: client.data.userId, name: client.data.userName },
      text: payload.text,
      blockId: payload.blockId,
      createdAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('op:submit')
  handleOperationSubmit(client: Socket, payload: Operation) {
    const roomId = client.data.roomId;
    if (!roomId) return;

    const currentVersion = this.documentVersions.get(roomId) || 0;
    const log = this.operationLogs.get(roomId) || [];

    const transformed = this.transformOperation(payload, log, payload.version);

    const serverOp: Operation = {
      ...transformed,
      version: currentVersion + 1,
      timestamp: Date.now(),
    };

    log.push(serverOp);
    if (log.length > 200) log.splice(0, log.length - 200);
    this.operationLogs.set(roomId, log);
    this.documentVersions.set(roomId, serverOp.version);

    client.emit('op:ack', { version: serverOp.version });
    client.to(roomId).emit('op:remote', serverOp);
  }

  @SubscribeMessage('op:sync')
  handleOperationSync(client: Socket, payload: { sinceVersion: number }) {
    const roomId = client.data.roomId;
    if (!roomId) return;

    const log = this.operationLogs.get(roomId) || [];
    const ops = log.filter((op) => op.version > payload.sinceVersion);
    const currentVersion = this.documentVersions.get(roomId) || 0;

    client.emit('op:sync:response', { ops, version: currentVersion });
  }

  private transformOperation(op: Operation, log: Operation[], clientVersion: number): Operation {
    let transformed = { ...op };

    for (const serverOp of log) {
      if (serverOp.version <= clientVersion) continue;
      if (serverOp.userId === op.userId) continue;

      transformed = this.transformAgainst(transformed, serverOp);
    }

    return transformed;
  }

  private transformAgainst(op: Operation, against: Operation): Operation {
    if (op.type === 'insert' && against.type === 'insert') {
      if (op.index !== undefined && against.index !== undefined) {
        if (against.index <= op.index) {
          return { ...op, index: op.index + 1 };
        }
      }
    }

    if (op.type === 'insert' && against.type === 'delete') {
      if (op.index !== undefined && against.index !== undefined) {
        if (against.index < op.index) {
          return { ...op, index: op.index - 1 };
        }
      }
    }

    if (op.type === 'delete' && against.type === 'insert') {
      if (op.index !== undefined && against.index !== undefined) {
        if (against.index <= op.index) {
          return { ...op, index: op.index + 1 };
        }
      }
    }

    if (op.type === 'delete' && against.type === 'delete') {
      if (op.index !== undefined && against.index !== undefined) {
        if (against.index < op.index) {
          return { ...op, index: op.index - 1 };
        }
        if (against.blockId === op.blockId) {
          return { ...op, type: 'update', props: {} };
        }
      }
    }

    if (op.type === 'update' && against.type === 'update' && op.blockId === against.blockId) {
      const mergedProps = { ...op.props };
      if (against.props) {
        for (const key of Object.keys(against.props)) {
          if (key in (op.props || {})) {
            if (against.timestamp > op.timestamp) {
              mergedProps[key] = against.props[key];
            }
          }
        }
      }
      return { ...op, props: mergedProps };
    }

    return op;
  }
}
