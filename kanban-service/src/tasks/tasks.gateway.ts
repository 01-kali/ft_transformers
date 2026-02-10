import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  broadcastTaskCreated(task: any) {
    this.server.emit('task:created', task);
  }

  broadcastTaskUpdated(task: any) {
    this.server.emit('task:updated', task);
  }

  broadcastTaskDeleted(id: number) {
    this.server.emit('task:deleted', { id });
  }
}
