import { Test, TestingModule } from '@nestjs/testing';
import { AntenantalsController } from './antenantals.controller';
import { AntenantalsService } from './antenantals.service';

describe('AntenantalsController', () => {
  let controller: AntenantalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntenantalsController],
      providers: [AntenantalsService],
    }).compile();

    controller = module.get<AntenantalsController>(AntenantalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
