export class CreateOrderDto {
  items: {
    [productId: string]: number;
  };
}
