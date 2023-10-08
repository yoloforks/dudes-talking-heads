import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket;

  constructor(
    private readonly socketService: SocketService,
    private readonly httpService: HttpService,
  ) {
    // setInterval(async () => {
    //   const request = this.httpService.get(
    //     // 'https://api.twitch.tv/helix/users?login=twitchdev',
    //     'https://api.twitch.tv/helix/chat/chatters',
    //     {
    //       params: {
    //         broadcaster_id: '945644432',
    //         moderator_id: '945644432',
    //       },
    //       headers: {
    //         Authorization: 'Bearer ' + process.env.TWITCH_CLIENT_SECRET,
    //         'Client-Id': process.env.TWITCH_CLIENT_ID,
    //       },
    //     },
    //   );
    //   firstValueFrom(request)
    //     .then((data) => {
    //       console.log(data);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // }, 5000);
  }

  handleDisconnect(socket: Socket) {
    this.socketService.handleDisconnect(socket);
  }

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);

    socket.on('initialize', (data) =>
      this.socketService.handleInitialize(socket, data),
    );
  }
}
