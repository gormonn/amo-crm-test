import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AmoClientService } from './services/amo-client/amo-client.service';
import { join } from 'path';
import { getBaseUrl } from './lib';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/react/dist'),
      exclude: ['/api/(.*)'],
    }),
    HttpModule.register({
      baseURL: getBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'amoCRM-oAuth-client/1.0',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AmoClientService],
})
export class AppModule {}
