import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/products/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/common/dtos/create-product.dto';
import ErrorMessage from 'src/common/constants/error-message';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { CreateOrderDto } from 'src/common/dtos/create-order.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(productDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(productDto);
    return await createdProduct.save();
  }

  async updateProduct(
    id: string,
    productDto: CreateProductDto,
  ): Promise<ProductDocument> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      productDto,
    );

    if (updatedProduct === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Product with id '${id}' was not found`,
      });
    }
    return updatedProduct;
  }

  async getProduct(id: string): Promise<ProductDocument> {
    const existingProduct = await this.productModel.findById(id);

    if (existingProduct === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Product with id '${id}' was not found`,
      });
    }
    return existingProduct;
  }

  async deleteProduct(id: string) {
    const deletedProduct = await this.productModel.findById(id);

    if (deletedProduct === null) {
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
    const products = await Promise.all(
      Object.entries(items).map(async ([id, qty]) => {
        const product = await this.getProduct(id);
        product.countInStock -= qty;

        if (product.countInStock < 0) {
          throw new ConflictException(
            ErrorMessage.NOT_ENOUGH_STOCK,
            `Product with id ${id} does not have enough stock for this purchase`,
          );
        }

        return product;
      }),
    );

    await Promise.all(products.map((product) => product.save()));
  }
}
