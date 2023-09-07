import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Page, PageBuilder } from 'src/common/util/page-builder';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import ErrorMessage from 'src/common/constants/error-message';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { ReportsService } from 'src/reports/reports.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly reportsService: ReportsService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async updateUser(id: string, userDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto);

    if (updatedUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }
    return updatedUser.toJSON();
  }

  async getUser(id: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const existingUser = await this.userModel.findById(id);

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }

    return existingUser.toJSON();
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with email '${email}'`);
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with email '${email}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with email '${email}' was not found`,
      });
    }

    return existingUser.toJSON();
  }

  async deleteUser(id: string) {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (deletedUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }

    // TODO: Delete orders, reviews.
  }

  async getUserPage({
    pageNum,
    pageSize,
    sort,
  }: PageRequest): Promise<Page<FlattenMaps<User & { _id: Types.ObjectId }>>> {
    const skippedDocuments = (pageNum - 1) * pageSize;
    const [totalDocuments, users] = await Promise.all([
      this.userModel.count({}),
      this.userModel
        .find({})
        .select({ password: 0 })
        .limit(pageSize)
        .skip(skippedDocuments)
        .sort(
          sort !== undefined
            ? { [sort?.field ?? '_id']: sort?.direction ?? 'asc' }
            : undefined,
        ),
    ]);

    const userPage = PageBuilder.buildPage(
      users.map((user) => user.toJSON()),
      {
        pageNum,
        pageSize,
        totalDocuments,
        sort,
      },
    );

    return userPage;
  }

  async downloaUsersReport() {
    const users = await this.userModel.find({});
    return await this.reportsService.generateReport('USER', users);
  }
}
