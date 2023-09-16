import { Module } from '@nestjs/common';
import { ItemRequestsService } from './item-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemRequest, ItemRequestSchema } from './item-request.schema';
import { ItemRequestsController } from './item-requests.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemRequest.name, schema: ItemRequestSchema },
    ]),
  ],
  providers: [ItemRequestsService],
  controllers: [ItemRequestsController],
})
export class ItemRequestsModule {}
