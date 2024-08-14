import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/ws',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor() {}
  afterInit(server: any) {
    console.log(server.path);
  }
  async handleConnection(client: Socket, ...args: any[]) {
    console.log('connected with args : ', args);
    if (false) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): any {
    console.log(client);
    console.log('disconnected');
  }
}
