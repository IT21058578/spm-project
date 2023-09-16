import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/companies/company.schema';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) { }
  
  async createSuppliers() {
    // Only company admin
  }

  async editSuppliers() {
    // Only company admin
  }

  async deleteSuppliers() {
    // Only company admin
  }

  async getSuppliers() {}

  async getSupplierssPage() {}
}
