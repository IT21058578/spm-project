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
import { CreateReviewDto } from 'src/common/dtos/create-review-dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from 'src/common/dtos/update-review-dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':id')
  async getReview(@Param('id') id: string) {
    return await this.reviewService.getReview(id);
  }

  @Get('search')
  async getReviewsPage(@Body() pageRequest: PageRequest) {
    return await this.reviewService.getReviewPage(pageRequest);
  }

  @Put(':id')
  async editReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewService.updateReview(id, updateReviewDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewService.createReview(createReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Param('id') id: string) {
    await this.reviewService.deleteReview(id);
  }
}
