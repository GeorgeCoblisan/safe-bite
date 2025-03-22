import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateProduct } from '../api-models/create-product.model';
import { Product } from '../api-models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  constructor(private httpClient: HttpClient) {}

  getProductByBarcode(barcode: string): Observable<Product> {
    return this.httpClient.get<Product>(
      `${environment.apiUrl}/products/${barcode}`
    );
  }

  createProduct(createProduct: CreateProduct): Observable<Product> {
    return this.httpClient.post<Product>(
      `${environment.apiUrl}/products`,
      createProduct
    );
  }
}
