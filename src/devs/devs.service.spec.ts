import { Test, TestingModule } from '@nestjs/testing';
import { DevsService } from './devs.service';

describe('DevsService', () => {
  let service: DevsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevsService],
    }).compile();

    service = module.get<DevsService>(DevsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
