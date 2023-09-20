import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AmoClientService } from './services/amo-client/amo-client.service';
import { join } from 'path';
import { BASE_API } from './lib';
//import { ApiController } from './controlles/api/api.controller';
//import { LeadsController } from './api/leads/leads.controller';
//import { AmoClientService } from './services/amo-client/amo-client.service';
//import { LeadsController } from './controllers/api/leads/leads.controller';
//import { AmoCrmClientService } from './amo-crm-client/amo-crm-client.service';
//import { LeadsController } from './api/leads/leads.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/react/dist'),
      exclude: ['/api/(.*)'],
    }),
    HttpModule.register({
      baseURL: BASE_API,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'amoCRM-oAuth-client/1.0',
      },
    }),
    //    HttpModule.register(AXIOS_CONFIG),
  ],
  //  controllers: [AppController, ApiController, LeadsController],
  //  providers: [AppService, AmoCrmClientService, AmoClientService],
  controllers: [AppController],
  providers: [AppService, AmoClientService],
})
export class AppModule {}
