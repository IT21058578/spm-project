import { Module } from '@nestjs/common';
import { CompaniesModule } from 'src/companies/companies.module';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';

@Module({
  imports: [CompaniesModule],
  providers: [SuppliersService],
  controllers: [SuppliersController],
})
export class SuppliersModule {}
