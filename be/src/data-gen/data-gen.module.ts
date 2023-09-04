import { Module } from '@nestjs/common';
import { DataGenService } from './data-gen.service';
import { DataGenController } from './data-gen.controller';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ReviewModule } from 'src/reviews/review.module';

@Module({
  providers: [DataGenService],
  controllers: [DataGenController],
  imports: [UsersModule, ProductsModule, OrdersModule, ReviewModule],
})
export class DataGenModule {}
