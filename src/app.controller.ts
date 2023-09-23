import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AmoClientService } from './services/amo-client/amo-client.service';
import { LeadQueryParamDto } from './validators';

@Controller()
export class AppController {
  constructor(private readonly amoClientService: AmoClientService) {}

  @Get('leads')
  getFilteredLeads(
    @Query('query', new ValidationPipe()) query?: LeadQueryParamDto,
  ) {
    return this.amoClientService.getLeads({ query });
  }
}
