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

  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async createReview(
    createdBy: string,
    reviewDto: CreateReviewDto,
  ): Promise<ReviewDocument> {
    this.logger.log('Creating new review...');
    const createdReview = new this.reviewModel({
      reviewDto,
      createdBy,
      createdAt: new Date(),
    });
    return await createdReview.save();
  }

  async updateReview(
    id: string,
    reviewDto: UpdateReviewDto,
  ): Promise<ReviewDocument> {
    this.logger.log(`Attempting to update review with id '${id}'`);
    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      id,
      reviewDto,
    );

    if (updatedReview === null) {
      this.logger.warn(`Could not find review with id '${id}'`);
      throw new BadRequestException(ErrorMessage.REVIEW_NOT_FOUND, {
        description: `Review with id '${id}' was not found`,
      });
    }

    return updatedReview;
  }

  async getReview(id: string): Promise<ReviewDocument> {
    this.logger.log(`Attempting to find review with id '${id}'`);
    const existingReview = await this.reviewModel.findById(id);

    if (existingReview === null) {
      this.logger.warn(`Could not find review with id '${id}'`);
      throw new BadRequestException(ErrorMessage.REVIEW_NOT_FOUND, {
        description: `Review with id '${id}' was not found`,
      });
    }

    return existingReview;
  }

  async deleteReview(id: string) {
    this.logger.log(`Attempting to delete review with id '${id}'`);
    const deletedReview = await this.reviewModel.findByIdAndDelete(id);

    if (deletedReview === null) {
      this.logger.warn(`Could not find review with id '${id}'`);
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `Review with id '${id}' was not found`,
      });
    }

    return deletedReview;
  }

  async getReviewPage({
    pageNum = 1,
    pageSize = 10,
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
