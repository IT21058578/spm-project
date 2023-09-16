import {
  Controller,
  Get,
  Header,
  StreamableFile,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/user-roles';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  async getUsersPage(@Body() pageRequest: PageRequest) {
    return await this.usersService.getUserPage(pageRequest);
  }

  @Get('reports')
  @Roles(UserRole.ADMIN)
  @Header('Content-Type', 'application/pdf')
  @Header(
    'Content-Disposition',
    'attachment; filename="Sera - Users Report.pdf"',
  )
  async downloadUsersReport(): Promise<StreamableFile> {
    const file = await this.usersService.downloadUsersReport();
    return file;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const { password, ...user } = await this.usersService.getUser(id);
    return user;
  }
}
