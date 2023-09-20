import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AmoClientService } from './services/amo-client/amo-client.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly amoClientService: AmoClientService,
  ) {}

  //  todo: remove
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //  todo: remove
  @Get('auth')
  getTest() {
    return this.amoClientService.auth();
  }

  @Get('leads')
  getLeads(): string {
    return 'leads';
  }
}
