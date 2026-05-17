import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/realtime' })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    // add presence tracking (TODO: persist in Redis)
    client.join('anonymous');
  }

  handleDisconnect(client: Socket) {
    // cleanup presence
  }

  @SubscribeMessage('presence:join')
  handlePresenceJoin(client: Socket, payload: any) {
    client.join(`project:${payload.projectId}`);
    this.server.to(`project:${payload.projectId}`).emit('presence:update', { user: payload.user });
  }

  @SubscribeMessage('comment:create')
  handleCommentCreate(client: Socket, payload: any) {
    this.server.to(`project:${payload.projectId}`).emit('comment:created', payload);
  }
}
