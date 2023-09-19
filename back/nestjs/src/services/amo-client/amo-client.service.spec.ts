import { Test, TestingModule } from '@nestjs/testing';
import { AmoClientService } from './amo-client.service';

describe('AmoClientService', () => {
  let service: AmoClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmoClientService],
    }).compile();

    service = module.get<AmoClientService>(AmoClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
