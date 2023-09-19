import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
//import { ApiController } from './controlles/api/api.controller';
//import { LeadsController } from './api/leads/leads.controller';
//import { AmoClientService } from './services/amo-client/amo-client.service';
//import { LeadsController } from './controllers/api/leads/leads.controller';
//import { AmoCrmClientService } from './amo-crm-client/amo-crm-client.service';
//import { LeadsController } from './api/leads/leads.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/react/dist'),
      exclude: ['/api/(.*)'],
    }),
  ],
  //  controllers: [AppController, ApiController, LeadsController],
  //  providers: [AppService, AmoCrmClientService, AmoClientService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
