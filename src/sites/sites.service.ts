import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/companies/company.schema';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) { }
  
  async createSite() {
    // Only company admin
  }

  async editSite() {
    // Only company admin
  }

  async deleteSite() {
    // Only company admin
  }

  async getSite() {}

  async getSitesPage() {}
}
