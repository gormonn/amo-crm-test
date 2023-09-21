import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AmoClientService } from './services/amo-client/amo-client.service';
import * as process from 'process';

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

  //  todo: remove
  @Get('set-auth-code')
  setAuthCode(@Query('code') code) {
    process.env.APP_CLIENT_AUTH_CODE = code;
  }
  //  todo: remove
  @Get('env')
  setEnv() {
    return Object.keys(process.env)
      .filter((key) => key.indexOf('APP_') === 0)
      .reduce((obj, key) => {
        obj[key] = process.env[key];
        return obj;
      }, {});
  }

  @Get('leads')
  getLeads() {
    //    return 'leads';
    return this.amoClientService.getLeads();
  }
}
