import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/common/dtos/create-order.dto';
import { DeliveryStatus } from 'src/common/constants/delivery-status';
import { PageRequest } from 'src/common/dtos/page-request.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return await this.ordersService.getOrder(id);
  }

  @Get('search')
  async getOrdersPage(@Body() pageRequest: PageRequest) {
    return await this.ordersService.getOrdersPage(pageRequest);
  }

  @Put(':id')
  async editOrderDeliveryStatus(
    @Param('id') id: string,
    @Query('delivery-status') deliveryStatus: DeliveryStatus,
  ) {
    return await this.ordersService.editOrderDeliveryStatus(id, deliveryStatus);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrders(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.createOrder('', createOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrders(@Param('id') id: string) {}
}
