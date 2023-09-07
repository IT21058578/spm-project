import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    UsersModule,
    ProductsModule,
    ReportsModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  exports: [OrdersService, MongooseModule],
})
export class OrdersModule {}
