import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CompaniesModule } from 'src/companies/companies.module';
import { SitesController } from './sites.controller';

@Module({
  imports: [CompaniesModule],
  providers: [SitesService],
  controllers: [SitesController],
})
export class SitesModule {}
