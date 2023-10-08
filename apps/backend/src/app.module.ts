import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    SocketModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      renderPath: '*',
      serveRoot: '/user',
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
