import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateReviewDto } from 'src/common/dtos/create-review-dto';
import { Review, ReviewDocument } from './review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ErrorMessage from 'src/common/constants/error-message';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { UpdateReviewDto } from 'src/common/dtos/update-review-dto';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async createReview(reviewDto: CreateReviewDto): Promise<ReviewDocument> {
    const createdReview = new this.reviewModel(reviewDto);
    return await createdReview.save();
  }

  async updateReview(
    id: string,
    reviewDto: UpdateReviewDto,
  ): Promise<ReviewDocument> {
    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      reviewDto,
    );

    if (updatedReview === null) {
      throw new BadRequestException(ErrorMessage.REVIEW_NOT_FOUND, {
        description: `Review with id '${id}' was not found`,
      });
    }
    return updatedReview;
  }

  async getReview(id: string): Promise<ReviewDocument> {
    const existingReview = await this.reviewModel.findById(id);

    if (existingReview === null) {
      throw new BadRequestException(ErrorMessage.REVIEW_NOT_FOUND, {
        description: `Review with id '${id}' was not found`,
      });
    }
    return existingReview;
  }

  async deleteReview(id: string) {
    const deletedReview = await this.reviewModel.findById(id);

    if (deletedReview === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Review with id '${id}' was not found`,
      });
    }

    return deletedReview;
  }

  async getReviewPage({
    pageNum,
    pageSize,
    sort,
  }: PageRequest): Promise<Page<ReviewDocument>> {
    const skippedDocuments = (pageNum - 1) * pageSize;
    const [totalDocuments, reviews] = await Promise.all([
      this.reviewModel.count({}),
      this.reviewModel
        .find({})
        .limit(pageSize)
        .skip(skippedDocuments)
        .sort(
          sort !== undefined
            ? { [sort.field]: sort?.direction ?? 'asc' }
            : undefined,
        ),
    ]);

    const reviewPage = PageBuilder.buildPage(reviews, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });

    return reviewPage;
  }
}
