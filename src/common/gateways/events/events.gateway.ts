import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from '../interface/socket.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  path: '/ws',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  afterInit() {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) client.disconnect(true);

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('app.jwtSecret', {
          infer: true,
        }),
      });
      client.user = decoded;
    } catch (error) {
      client.disconnect(true);
    }
    console.log('connected with args : ', args);
  }

  handleDisconnect(client: Socket): any {
    console.log(client);
    console.log('disconnected');
  }
}
