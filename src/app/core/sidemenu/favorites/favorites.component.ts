import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  barcodeSharp,
  informationCircleSharp,
  pencilSharp,
  pricetagSharp,
  trashSharp,
} from 'ionicons/icons';
import {
  catchError,
  first,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';

import { FavoriteProduct } from '../../../shared/api-models/favorite-product.model';
import { ApiClientService } from '../../../shared/services/api-client.service';
import { FavoritesService } from '../../../shared/services/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
  imports: [
    IonSkeletonText,
    IonIcon,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
  ],
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites = signal<FavoriteProduct[] | null>(null);

  private destroyNotifyFavorites$ = new Subject<void>();

  constructor(
    private apiClientService: ApiClientService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private favoritesService: FavoritesService
  ) {
    addIcons({
      barcodeSharp,
      pricetagSharp,
      pencilSharp,
      trashSharp,
      informationCircleSharp,
    });
  }

  ngOnInit(): void {
    this.favoritesService.favoritesUpdated$
      .pipe(takeUntil(this.destroyNotifyFavorites$))
      .subscribe(() => {
        this.getFavorites();
      });

    this.getFavorites();
  }

  ngOnDestroy(): void {
    this.destroyNotifyFavorites$.complete();
  }

  navigateToProductDetails(favoriteProduct: FavoriteProduct): void {
    this.navCtrl.navigateForward(
      ['/sidemenu/products/product', favoriteProduct.barcode],
      {
        state: { data: 'favorites' },
        relativeTo: this.activatedRoute,
      }
    );
  }

  counter(i: number): Array<number> {
    return new Array(i);
  }

  async presentEditFavoriteAlert(
    favoriteProduct: FavoriteProduct
  ): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Edit name',
      inputs: [
        {
          name: 'customName',
          type: 'text',
          value: favoriteProduct.customName,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
            this.patchFavorite(favoriteProduct.barcode, data.customName);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentDeleteActionSheet(barcode: string): Promise<void> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Delete favorite',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteFavorite(barcode);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  private getFavorites(): void {
    this.apiClientService
      .getFavorites()
      .pipe(
        first(),
        switchMap((favorites) => {
          this.favorites.set(favorites);
          return of();
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  private patchFavorite(barcode: string, name: string): void {
    this.apiClientService
      .patchFavorite(barcode, name)
      .pipe(first())
      .subscribe({
        next: (updatedFavorite) => {
          this.updateFavoritesSignal(updatedFavorite);
          this.presentUpdateProductSuccessfullToast();
        },
        error: () => {
          this.presentOperationError();
        },
      });
  }

  private deleteFavorite(barcode: string): void {
    this.apiClientService
      .deleteFavorite(barcode)
      .pipe(first())
      .subscribe({
        next: () => {
          this.removeFavoriteFromSignal(barcode);
          this.presentDeleteProductSuccessfullToast();
          this.favoritesService.notifyFavoritesChanged();
        },
        error: () => {
          this.presentOperationError();
        },
      });
  }

  private updateFavoritesSignal(updatedFavorite: FavoriteProduct): void {
    const current = this.favorites();
    const updated = current!.map((product) =>
      product.barcode === updatedFavorite.barcode ? updatedFavorite : product
    );
    this.favorites.set(updated);
  }

  private removeFavoriteFromSignal(barcode: string): void {
    const updated = this.favorites()!.filter(
      (product) => product.barcode !== barcode
    );
    this.favorites.set(updated);
  }

  private async presentUpdateProductSuccessfullToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Favorite product successfully updated',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });

    await toast.present();
  }

  private async presentOperationError(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Something went wrong! Please try again!',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }

  private async presentDeleteProductSuccessfullToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Favorite product successfully deleted',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });

    await toast.present();
  }
}
