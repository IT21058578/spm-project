import { PageRequest } from './page-request.dto';

export class GetRecommendationsDto {
  userId?: string;
  currentProductId?: string;
  cartProductIds?: string[];
  metadata: PageRequest;
}
