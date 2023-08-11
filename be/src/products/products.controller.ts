import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  HttpStatus,
  HttpCode,
  Body,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { CreateProductDto } from 'src/common/dtos/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productsService.getProduct(id);
  }

  @Get('search')
  async getProductsPage(@Body() pageRequest: PageRequest) {
    return await this.productsService.getProductPage(pageRequest);
  }

  @Put(':id')
  async editProducts(
    @Param('id') id: string,
    @Body() updateProductsDto: CreateProductDto,
  ) {
    return await this.productsService.updateProduct(id, updateProductsDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProducts(@Body() createProductsDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductsDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProducts(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
  }
}
