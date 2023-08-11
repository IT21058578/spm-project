import { Controller, Get } from '@nestjs/common';
import { PageRequest } from 'src/common/dtos/page-request.dto';

@Controller('users')
export class UsersController {
  @Get(':id')
  async getUser(id: string) {}

  @Get('search')
  async getUsersPage(pageRequest: PageRequest) {}
}
