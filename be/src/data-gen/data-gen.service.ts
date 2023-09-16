import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryStatus } from 'src/common/constants/delivery-status';
import { Order } from 'src/orders/order.schema';
import { Product, ProductDocument } from 'src/products/products.schema';
import { Review } from 'src/reviews/review.schema';
import { User, UserDocument } from 'src/users/user.schema';

const productBrandsList = [
  // Global
  'Nike',
  'Louis Vuitton',
  'Gucci',
  'Adidas',
  'Hermes',
  'Zara',
  'H&M',
  'Cartier',
  'UNIQLO',
];

const productTypesList = ['T-Shirt', 'Shirt', 'Dress', 'Jacket', 'Hoodie'];

const productPantsTagsList = [
  'Nylon',
  'Wide-Leg',
  'Cargo-Pants',
  'Utility',
  'Leather',
  'High-Waist',
  'Flared',
  'Mid-rise',
  'Cargo',
  'Diamond-Pattern',
  'Metallic',
  'High-Shine',
  'Side-Split',
  'Embellished',
  'Quilted',
  'Detail',
  'Runner',
];

const productTopsTagsList = [
  'One-shoulder',
  'Sleeveless',
  'Long-Sleeve',
  'Wide-Neck',
  'Single-Breasted',
  'Double-Breasted',
];

const productCommonTagsList = [
  'Sequin',
  'Checkerboard',
  'Crochet',
  'Satin',
  'Textured',
  'Ruffle',
  'Asymmetric',
  'Graphic',
  'Pleated',
  'Floral',
  'Cut-out',
  'Sweater',
  'Patchwork',
  'Tie-Dye',
  'Lace',
  'Snake-Print',
  'Pinstripe',
  'Ribbed',
  'Oversized',
  'Frill',
  'Sportswear',
  'Fluffy',
  'Petite',
  'Biker',
  'Fringe',
  'Cropped',
  'Padded',
];

const productColorsList = [
  "Black",
  "Red",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Blue",
  "Brown",
  "Orange",
  "White",
  "Gray",
]

@Injectable()
export class DataGenService {
  private readonly logger = new Logger(DataGenService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  async generateAll() {
    this.logger.log('Starting data generation process....');
    // await this.generateUsers(1000);
    // await this.generateProducts(1000);
    await this.generateOrders(20000);
    await this.generateReviews(7500);
  }

  private async generateUsers(n: number) {
    this.logger.log(`Generating ${n} users...`);
    const promises = Array(n).fill('').map(this.generateUser);
    await Promise.all(promises);
    this.logger.log('Succesfully generated users');
  }

  private generateUser = async () => {
    const newUser = new this.userModel({
      country: faker.location.countryCode(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });
    const savedUser = await newUser.save();
    this.logger.log(`Saved user with id ${savedUser.id}`);
  };

  private generateProduct = async (types: string[], tags: string[]) => {
    const newProduct = new this.productModel({
      brand: faker.helpers.arrayElement(productBrandsList),
      type: faker.helpers.arrayElement(types),
      color: faker.helpers.arrayElement(productColorsList),
      price: faker.number.float({ min: 100, max: 10000, precision: 0.01 }),
      tags: faker.helpers.arrayElements(
        tags,
        faker.number.int({ max: 5, min: 1 }),
      ),
      countInStock: faker.number.int({ min: 0, max: 100 }),
      createdAt: faker.date.between({
        from: '2023-01-01T00:00:00.000Z',
        to: '2024-01-01T00:00:00.000Z',
      }),
    });
    const savedProduct = await newProduct.save();
    this.logger.log(`Saved product with id ${savedProduct.id}`);
  };

  private async generateProducts(n: number) {
    this.logger.log(`Generating ${n} products...`);
    const topPromises = Array((5 * n) / 10)
      .fill('')
      .map(() =>
        this.generateProduct(productTypesList, [
          ...productCommonTagsList,
          ...productTopsTagsList,
        ]),
      );

    const pantsPromises = Array((4 * n) / 10)
      .fill('')
      .map(() =>
        this.generateProduct(
          ['Trousers', 'Jeans', 'Shorts', 'Skirt'],
          [...productCommonTagsList, ...productPantsTagsList],
        ),
      );

    await Promise.all([...topPromises, ...pantsPromises]);
    this.logger.log('Succesfully generated products');
  }

  private async generateOrders(n: number) {
    this.logger.log(`Generating ${n} orders...`);
    const promises = Array(n)
      .fill('')
      .map(async () => {
        // Randomnly select some items
        const selectedProducts =
          await this.productModel.aggregate<ProductDocument>([
            { $sample: { size: faker.number.int({ min: 1, max: 3 }) } },
          ]);
        let totalPrice = 0;
        let latestProductCreatedAt = new Date(2001, 0, 1);
        const items = {};

        selectedProducts.forEach((product) => {
          const qty = faker.number.int({ min: 0, max: 3 });
          Object.assign(items, {
            [product._id.toString()]: { price: product.price, qty },
          });
          totalPrice += qty * product.price;
          latestProductCreatedAt =
            product.createdAt > latestProductCreatedAt
              ? product.createdAt
              : latestProductCreatedAt;
        });

        // Randomnly select a user
        const selectedUser = (
          await this.userModel.aggregate<UserDocument>([
            { $sample: { size: 1 } },
          ])
        ).at(0);

        const newOrder = new this.orderModel({
          deliveryStatus: DeliveryStatus.COMPLETED,
          createdAt: faker.date.between({
            from: latestProductCreatedAt,
            to: '2024-01-01T00:00:00.000Z',
          }),
          createdBy: selectedUser?._id.toString(),
          totalPrice,
          items,
        });

        const savedOrder = await newOrder.save();
        this.logger.log(`Saved order with id '${savedOrder.id}'`);
      });
    await Promise.all(promises);
    this.logger.log('Succesfully generated orders');
  }

  private async generateReviews(n: number) {
    this.logger.log(`Generating ${n} reviews...`);
    const productCount = await this.productModel.countDocuments();
    const userCount = await this.userModel.countDocuments();
    const promises = Array(n)
      .fill('')
      .map(async () => {
        const selectedUser = await this.userModel
          .findOne()
          .skip(Math.random() * userCount);

        const selectedProduct = await this.productModel
          .findOne()
          .skip(Math.random() * productCount);

        if (
          !selectedProduct?.id ||
          !selectedUser?.id ||
          !selectedProduct?.createdAt
        )
          throw Error();

        const newReview = new this.reviewModel({
          productId: selectedProduct?.id,
          createdBy: selectedUser?.id,
          rating: faker.number.float({ precision: 0.1, max: 5, min: 0 }),
          createdAt: faker.date.between({
            from: selectedProduct?.createdAt ?? '2023-01-01T00:00:00.000Z',
            to: '2024-01-01T00:00:00.000Z',
          }),
        });
        const savedReview = await newReview.save();
        this.logger.log(`Saved review with id '${savedReview.id}'`);
      });
    await Promise.all(promises);
    this.logger.log('Succesfully generated reviews');
  }
}
