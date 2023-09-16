import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/companies/company.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  async createItem() {
    // Only company admin
  }

  async editItem() {
    // Only company admin
  }

  async deleteItem() {
    // Only company admin
  }

  async getItem() {}

  async getItemsPage() {}
}
