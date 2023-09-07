import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/products/products.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/common/dtos/create-product.dto';
import ErrorMessage from 'src/common/constants/error-message';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { CreateOrderDto } from 'src/common/dtos/create-order.dto';
import { GetRecommendationsDto } from 'src/common/dtos/get-recommendations-request.dto';
import { Order } from 'src/orders/order.schema';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from 'src/common/constants/config-key';
import { ReportsService } from 'src/reports/reports.service';
import { ReportPurpose } from 'src/common/constants/report-purpose';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly reportsService: ReportsService,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async createProduct(productDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(productDto);
    return await createdProduct.save();
  }

  async updateProduct(
    id: string,
    productDto: CreateProductDto,
  ): Promise<ProductDocument> {
    this.logger.log(`Attempting to update product with id '${id}'`);
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      productDto,
    );

    if (updatedProduct === null) {
      this.logger.warn(`Could not find product with id '${id}'`);
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Product with id '${id}' was not found`,
      });
    }
    return updatedProduct;
  }

  async getProduct(id: string): Promise<ProductDocument> {
    this.logger.log(`Attempting to find product with id '${id}'`);
    const existingProduct = await this.productModel.findById(id);

    if (existingProduct === null) {
      this.logger.warn(`Could not find product with id '${id}'`);
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Product with id '${id}' was not found`,
      });
    }
    return existingProduct;
  }

  async deleteProduct(id: string) {
    this.logger.log(`Attempting to delete product with id '${id}'`);
    const deletedProduct = await this.productModel.findById(id);

    if (deletedProduct === null) {
      this.logger.warn(`Could not find product with id '${id}'`);
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Product with id '${id}' was not found`,
      });
    }

    return deletedProduct;
  }

  async getProductPage({
    pageNum,
    pageSize,
    sort,
  }: PageRequest): Promise<Page<ProductDocument>> {
    this.logger.log(`Attempting to create product page...`);
    const skippedDocuments = (pageNum - 1) * pageSize;
    const [totalDocuments, products] = await Promise.all([
      this.productModel.count({}),
      this.productModel
        .find({})
        .limit(pageSize)
        .skip(skippedDocuments)
        .sort(
          sort !== undefined
            ? { [sort.field]: sort?.direction ?? 'asc' }
            : undefined,
        ),
    ]);

    const productPage = PageBuilder.buildPage(products, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });

    return productPage;
  }

  async adjustMultipleProductStock({ items }: CreateOrderDto) {
    this.logger.log(`Attempting to adjust product(s) stock counts...`);
    const products = await Promise.all(
      Object.entries(items).map(async ([id, qty]) => {
        const product = await this.getProduct(id);
        product.countInStock -= qty;

        if (product.countInStock < 0) {
          this.logger.warn(
            `Product with id '${id}' deos not have enough stock for this purchase`,
          );
          throw new ConflictException(ErrorMessage.NOT_ENOUGH_STOCK);
        }

        return product;
      }),
    );

    await Promise.all(products.map((product) => product.save()));
    this.logger.log(`Succesfully updated all relevant product(s) stock counts`);
  }

  async getRecommendations(
    getRecommendationsDto: GetRecommendationsDto,
  ): Promise<Page<ProductDocument>> {
    this.logger.log(`Getting recommended products...`);
    const recommendedProducts = (
      await firstValueFrom(
        this.httpService.post<ProductDocument[]>(
          `${this.configService.get(
            ConfigKey.FLASK_URL,
          )}/api/products/recommendations`,
          getRecommendationsDto,
        ),
      )
    ).data;

    this.logger.log(`Found recommended products`);
    const totalDocuments = await this.productModel.count({});
    const { pageNum, pageSize } = getRecommendationsDto.metadata;

    const productPage = PageBuilder.buildPage(recommendedProducts, {
      pageNum,
      pageSize,
      totalDocuments,
    });

    return productPage;
  }

  async downloaProductsReport(type?: string) {
    const products = await this.productModel.find({
      ...(type ? { type: type } : {}),
    });
    return await this.reportsService.generateReport('PRODUCT', products);
  }
}
