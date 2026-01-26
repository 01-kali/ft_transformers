// import {WebSocketGateway, 
//   OnGatewayConnection, 
//   OnGatewayDisconnect, 
//   WebSocketServer, 
//   SubscribeMessage, 
//   MessageBody, 
//   ConnectedSocket} from '@nestjs/websockets'
// import { Server, Socket } from 'socket.io';
//
// @WebSocketGateway({ cors: { origin: '*' } })
// export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;
//   public handleConnection(client: Socket) {
//     console.log('Client connected:', client.id);
//   }
//   public handleDisconnect(client: Socket) {
//     console.log('Client disconnected:', client.id);
//   }
//
//   @SubscribeMessage('taskUpdated')
//   handleTaskUpdate(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
//     client.broadcast.emit('taskUpdated', payload);
//   }
// }
import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
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
}
