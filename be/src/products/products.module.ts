import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Order, OrderSchema } from 'src/orders/order.schema';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    HttpModule,
    ReportsModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
