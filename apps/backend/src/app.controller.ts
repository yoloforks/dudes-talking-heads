import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SocketService } from './socket/socket.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly socketService: SocketService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
