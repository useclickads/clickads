import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type PresenceUser = { id: string; name: string; email: string; color: string; cursor?: { x: number; y: number }; selectedBlockId?: string | null };

const PRESENCE_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be185d', '#4f46e5'];

@WebSocketGateway({ namespace: '/realtime', cors: { origin: '*' } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private rooms = new Map<string, Map<string, PresenceUser>>();

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
}
