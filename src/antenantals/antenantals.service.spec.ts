import { Test, TestingModule } from '@nestjs/testing';
import { AntenantalsService } from './antenantals.service';

describe('AntenantalsService', () => {
  let service: AntenantalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntenantalsService],
    }).compile();

    service = module.get<AntenantalsService>(AntenantalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
