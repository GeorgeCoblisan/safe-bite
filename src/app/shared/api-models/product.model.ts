import { Ingredient } from './ingredient.model';
import { SourceProduct } from './source-product.model';

export interface Product {
  barcode: string;
  name?: string;
  sourceProduct: SourceProduct;
  lastUpdated: Date;
  ingredients: Ingredient[];
}
