import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/common/dtos/create-order.dto';
import { DeliveryStatus } from 'src/common/constants/delivery-status';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/user-roles';
import { User } from 'src/common/decorators/user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  @Roles(UserRole.USER)
  async getOrder(@Param('id') id: string) {
    return await this.ordersService.getOrder(id);
  }

  @Get('search')
  async getOrdersPage(@Body() pageRequest: PageRequest) {
    return await this.ordersService.getOrdersPage(pageRequest);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async editOrderDeliveryStatus(
    @Param('id') id: string,
    @Query('delivery-status') deliveryStatus: DeliveryStatus,
  ) {
    return await this.ordersService.editOrderDeliveryStatus(id, deliveryStatus);
  }

  @Post()
  @Roles(UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  async createOrders(
    @User('_id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.createOrder(userId, createOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrders(@Param('id') id: string) {
    await this.ordersService.deleteOrder(id);
    return;
  }

  @Get('reports')
  @Roles(UserRole.ADMIN)
  @Header('Content-Type', 'application/pdf')
  @Header(
    'Content-Disposition',
    'attachment; filename="Sera - Orders Report.pdf"',
  )
  async downloadOrdersReport(
    @Query('user-id') userId: string,
  ): Promise<StreamableFile> {
    const file = await this.ordersService.downloaOrdersReport(userId);
    return file;
  }
}
