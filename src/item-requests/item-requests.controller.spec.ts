import { Test, TestingModule } from '@nestjs/testing';
import { ItemRequestsController } from './item-requests.controller';

describe('ItemRequestsController', () => {
  let controller: ItemRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemRequestsController],
    }).compile();

    controller = module.get<ItemRequestsController>(ItemRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
