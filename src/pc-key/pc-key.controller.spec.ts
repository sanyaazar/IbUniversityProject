import { Test, TestingModule } from '@nestjs/testing';
import { PcKeyController } from './pc-key.controller';
import { PcKeyService } from './pc-key.service';

describe('PcKeyController', () => {
  let controller: PcKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcKeyController],
      providers: [PcKeyService],
    }).compile();

    controller = module.get<PcKeyController>(PcKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
