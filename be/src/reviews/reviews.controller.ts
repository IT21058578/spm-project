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
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/user-roles';
import { User } from 'src/common/decorators/user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('search')
  async getReviewsPage(@Body() pageRequest: PageRequest) {
    return await this.reviewService.getReviewPage(pageRequest);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  async editReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewService.updateReview(id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(UserRole.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Param('id') id: string) {
    await this.reviewService.deleteReview(id);
  }

  @Get(':id')
  async getReview(@Param('id') id: string) {
    return await this.reviewService.getReview(id);
  }

  @Post()
  @Roles(UserRole.USER)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @User('_id') userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return await this.reviewService.createReview(userId, createReviewDto);
  }
}
