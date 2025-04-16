import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateFavorite } from '../api-models/create-favorite.model';
import { CreateProduct } from '../api-models/create-product.model';
import { FavoriteProduct } from '../api-models/favorite-product.model';
import { FavoriteWithProductProperties } from '../api-models/favorite-with-product-properties.model';
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
    const params = new HttpParams().set('barcode', createProduct.barcode);

    return this.httpClient.post<Product>(
      `${environment.apiUrl}/products`,
      createProduct.image ?? undefined,
      { params }
    );
  }

  getFavorites(): Observable<FavoriteProduct[]> {
    return this.httpClient.get<FavoriteProduct[]>(
      `${environment.apiUrl}/favorites`
    );
  }

  getFavoritesWithProductProperties(): Observable<
    FavoriteWithProductProperties[]
  > {
    return this.httpClient.get<FavoriteWithProductProperties[]>(
      `${environment.apiUrl}/favorites/products-entity`
    );
  }

  createFavorite(createFavorite: CreateFavorite): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/favorites`,
      createFavorite
    );
  }

  patchFavorite(barcode: string, name: string): Observable<FavoriteProduct> {
    return this.httpClient.patch<FavoriteProduct>(
      `${environment.apiUrl}/favorites/${barcode}?productName=${name}`,
      {}
    );
  }

  deleteFavorite(productBarcode: string): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.apiUrl}/favorites/${productBarcode}`
    );
  }
}
