import { Test, TestingModule } from '@nestjs/testing';
import { ItemRequestsService } from './item-requests.service';

describe('ItemRequestsService', () => {
  let service: ItemRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemRequestsService],
    }).compile();

    service = module.get<ItemRequestsService>(ItemRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
