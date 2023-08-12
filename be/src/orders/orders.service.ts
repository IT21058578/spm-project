import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from 'src/common/dtos/create-order.dto';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Order, OrderDocument } from 'src/orders/order.schema';
import ErrorMessage from 'src/common/constants/error-message';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { DeliveryStatus } from 'src/common/constants/delivery-status';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly productService: ProductsService,
    private readonly userService: UsersService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createOrder(
    createdBy: string,
    { items }: CreateOrderDto,
  ): Promise<OrderDocument> {
    const existingUser = await this.userService.getUser(createdBy);
    const products = await Promise.all(
      Object.keys(items).map((id) => this.productService.getProduct(id)),
    );

    const order = new this.orderModel();
    order.userId = existingUser.id;
    order.items = products.reduce((obj: any = {}, product): any => ({
      ...obj,
      [product.id]: { qty: items[product.id], price: product.price },
    })) as any;
    order.totalPrice = products
      .map((product) => product.price)
      .reduce((total, crnt) => total + crnt);
    order.deliveryStatus = DeliveryStatus.PENDING;

    await this.productService.adjustMultipleProductStock({ items });
    const savedOrder = await order.save();
    return savedOrder;
  }

  async getOrder(id: string): Promise<OrderDocument> {
    const existingOrder = await this.orderModel.findById(id);

    if (existingOrder === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Order with id '${id}' was not found`,
      });
    }
    return existingOrder;
  }

  async editOrderDeliveryStatus(id: string, deliveryStatus: DeliveryStatus) {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(id, {
      deliveryStatus,
    });

    if (updatedOrder === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Product with id '${id}' was not found`,
      });
    }
    return updatedOrder;
  }

  async deleteProduct(id: string) {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id);

    if (deletedOrder === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Product with id '${id}' was not found`,
      });
    }

    return deletedOrder;
  }

  async getOrdersPage({
    pageNum,
    pageSize,
    sort,
  }: PageRequest): Promise<Page<OrderDocument>> {
    const skippedDocuments = (pageNum - 1) * pageSize;
    const [totalDocuments, orders] = await Promise.all([
      this.orderModel.count({}),
      this.orderModel
        .find({})
        .limit(pageSize)
        .skip(skippedDocuments)
        .sort(
          sort !== undefined
            ? { [sort.field]: sort?.direction ?? 'asc' }
            : undefined,
        ),
    ]);

    const orderPage = PageBuilder.buildPage(orders, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });

    return orderPage;
  }
}
