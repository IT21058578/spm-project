import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company, CompanySchema } from './company.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ],
  exports: [MongooseModule],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
