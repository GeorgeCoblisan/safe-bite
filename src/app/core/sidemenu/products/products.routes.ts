import { Routes } from '@angular/router';

import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductIngredientComponent } from './product-ingredient/product-ingredient.component';
import { ProductScoreComponent } from './product-score/product-score.component';

export const routes: Routes = [
  { path: 'product/:barcode', component: ProductDetailsComponent },
  { path: 'product-ingredient/:code', component: ProductIngredientComponent },
  { path: 'product-score/:barcode', component: ProductScoreComponent },
];
