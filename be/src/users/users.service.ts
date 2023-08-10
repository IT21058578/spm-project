import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import ErrorMessage from 'src/common/constants/error-message';
import { PageRequest } from 'src/common/dtos/page-request.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateUser(id: string, userDto: CreateUserDto): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto);

    if (updatedUser === null) {
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }
    return updatedUser;
  }

  async getUser(id: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findById(id);

    if (existingUser === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }

    return existingUser;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `User with email '${email}' was not found`,
      });
    }

    return existingUser;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (deletedUser === null) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }

    // TODO: Delete orders, reviews.
  }

  async getUserPage({
    pageNum,
    pageSize,
    sort,
  }: PageRequest): Promise<Page<UserDocument>> {
    const skippedDocuments = (pageNum - 1) * pageSize;
    const [totalDocuments, users] = await Promise.all([
      this.userModel.count({}),
      this.userModel
        .find({})
        .limit(pageSize)
        .skip(skippedDocuments)
        .sort(
          sort !== undefined
            ? { [sort?.field ?? '_id']: sort?.direction ?? 'asc' }
            : undefined,
        ),
    ]);

    const userPage = PageBuilder.buildPage(users, {
      pageNum,
      pageSize,
      totalDocuments,
      sort,
    });

    return userPage;
  }
}
