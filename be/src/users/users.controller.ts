import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { UserRole } from 'src/common/constants/user-roles';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(id: string) {
    const { password, ...user } = await this.usersService.getUser(id)
    return user;
  }

  @Get('search')
  async getUsersPage(pageRequest: PageRequest) {
    return await this.usersService.getUserPage(pageRequest)
  }

  @Get('reports')
  @Roles(UserRole.ADMIN)
  @Header('Content-Type', 'application/pdf')
  @Header(
    'Content-Disposition',
    'attachment; filename="Sera - Users Report.pdf"',
  )
  async downloadOrdersReport(): Promise<StreamableFile> {
    const file = await this.usersService.downloaUsersReport();
    return file;
  }
}
