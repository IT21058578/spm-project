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
import { UserRole } from 'src/common/constants/user-roles';
import { Roles } from 'src/common/decorators/roles.decorator';

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
  @Roles(UserRole.ADMIN)
  async editProduct(
    @Param('id') id: string,
    @Body() updateProductsDto: CreateProductDto,
  ) {
    return await this.productsService.updateProduct(id, updateProductsDto);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductsDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductsDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
  }
}
