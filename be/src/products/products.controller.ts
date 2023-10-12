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
  Query,
  StreamableFile,
  Header,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { CreateProductDto } from 'src/common/dtos/create-product.dto';
import { GetRecommendationsDto } from 'src/common/dtos/get-recommendations-request.dto';
import { Page } from 'src/common/util/page-builder';
import { ProductDocument } from './products.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from 'src/common/constants/user-roles';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('search')
  async getProductsPage(@Body() pageRequest: PageRequest) {
    return await this.productsService.getProductPage(pageRequest);
  }

  @Post('recommendations')
  async getRecommendations(
    @Body() getRecommendationsDto: GetRecommendationsDto,
  ): Promise<Page<ProductDocument>> {
    return await this.productsService.getRecommendations(getRecommendationsDto);
  }

  @Get('reports')
  // @Roles(UserRole.ADMIN)
  @Header('Content-Type', 'application/pdf')
  @Header(
    'Content-Disposition',
    'attachment; filename="Sera - Products Report.pdf"',
  )
  async downloadReport(@Query('type') type: string): Promise<StreamableFile> {
    const file = await this.productsService.downloadProductsReport(type);
    return file;
  }

  @Post('images')
  @Roles(...Object.values(UserRole))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Query('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.productsService.uploadProductsImage(file);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async editProduct(
    @Param('id') id: string,
    @Body() updateProductsDto: CreateProductDto,
  ) {
    return await this.productsService.updateProduct(id, updateProductsDto);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productsService.getProduct(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string) {
    await this.productsService.deleteProduct(id);
    return;
  }


  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductsDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductsDto);
  }
}
