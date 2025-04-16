import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  favoritesUpdated$ = new Subject<void>();

  constructor() {}

  notifyFavoritesChanged() {
    this.favoritesUpdated$.next();
  }
}
