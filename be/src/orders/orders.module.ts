import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/product.module';
import { ProductService } from 'src/products/products.service';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';

@Module({
  controllers: [OrdersController],
  providers: [ProductService],
  imports: [
    UsersModule,
    ProductsModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  exports: [OrdersService, MongooseModule],
})
export class OrdersModule {}
