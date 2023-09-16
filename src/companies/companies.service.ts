import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  async createCompany() {
    // Only master admin
  }

  async editCompany() {
    // Only master admin
  }

  async deleteCompany() {
    // Only master admin
  }

  async getCompany() {}

  async getCompaniesPage() {}
}
