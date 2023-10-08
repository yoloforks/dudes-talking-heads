import { Socket, io } from 'socket.io-client';

export type Message = {
  name: string;
  userId: string;
  message: string;
};

type ServerToClientsEvents = {
  message: (data: Message) => void;
};

export interface ClientToServerEvents {
  initialize: (data: { roomId: string }) => void;
}

export class Connection {
  private socket?: Socket<ServerToClientsEvents, ClientToServerEvents>;

  public init() {
    console.log('init');

    const socket = io(
      import.meta.env.VITE_SOCKET_HOST || 'http://localhost:3003'
    );

    socket.on('connect', () => {
      console.log('connected');

      const path = window.location.pathname.split('/');

      socket.emit('initialize', {
        roomId: path[path.length - 1],
      });
    });

    this.socket = socket;
  }

  public onMessage(callback: (data: Message) => void) {
    this.socket?.on('message', callback);
  }
}
