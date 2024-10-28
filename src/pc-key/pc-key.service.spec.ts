import { Test, TestingModule } from '@nestjs/testing';
import { PcKeyService } from './pc-key.service';

describe('PcKeyService', () => {
  let service: PcKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcKeyService],
    }).compile();

    service = module.get<PcKeyService>(PcKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
