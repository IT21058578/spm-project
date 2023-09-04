import { Controller, Post } from '@nestjs/common';
import { DataGenService } from './data-gen.service';

@Controller('data-gen')
export class DataGenController {
  constructor(private readonly datagenService: DataGenService) {}

  @Post()
  async generateData() {
    await this.datagenService.generateAll();
  }
}
