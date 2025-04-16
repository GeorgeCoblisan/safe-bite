import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertButton,
  AlertInput,
  NavController,
  ToastController,
} from '@ionic/angular';
import {
  IonAlert,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, pricetagOutline, starSharp } from 'ionicons/icons';
import { catchError, first, Observable, of, switchMap, throwError } from 'rxjs';

import { Ingredient } from '../../../../shared/api-models/ingredient.model';
import { Product } from '../../../../shared/api-models/product.model';
import { RiskLevel } from '../../../../shared/api-models/risk-level.enum';
import { CameraService } from '../../../../shared/camera/camera.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { ApiClientService } from '../../../../shared/services/api-client.service';
import { FavoritesService } from '../../../../shared/services/favorites.service';

@Component({
  selector: 'app-product-details',
  imports: [
    IonAlert,
    IonSkeletonText,
    IonItem,
    IonCardContent,
    IonCardTitle,
    IonToolbar,
    IonContent,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonSkeletonText,
    IonIcon,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  previousRoute?: string;

  additiveColorMapping: Record<RiskLevel, string> = {
    [RiskLevel.HIGH]: '#b91c1c',
    [RiskLevel.MEDIUM]: '#ca8a04',
    [RiskLevel.LOW]: '#15803d',
  };

  product = signal<Product | null>(null);

  favoriteAlertInputs?: AlertInput[] = [
    {
      name: 'customName',
      type: 'text',
      placeholder: 'Custom name',
    },
  ];

  favoriteAlertButtons?: AlertButton[] = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Save',
      handler: (data) => {
        this.createFavorite(data.customName);
      },
    },
  ];

  private barcode?: string;

  constructor(
    private route: ActivatedRoute,
    private apiClientService: ApiClientService,
    private alertService: AlertService,
    private cameraService: CameraService,
    private router: Router,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private favoritesService: FavoritesService
  ) {
    addIcons({ pricetagOutline, cameraOutline, starSharp });
  }

  ngOnInit(): void {
    this.barcode = this.route.snapshot.paramMap.get('barcode') as string;
    this.setPreviousRoute();
    this.getProduct(this.barcode);
  }

  counter(i: number): Array<number> {
    return new Array(i);
  }

  navigateToProductIngredientPage(ingredient: Ingredient): void {
    this.navCtrl.navigateForward(
      ['/sidemenu/products/product-ingredient', ingredient.code],
      { state: { data: ingredient }, relativeTo: this.activatedRoute }
    );
  }

  navigateToProductScorePage(ingredients: Ingredient[]): void {
    this.navCtrl.navigateForward(
      ['/sidemenu/products/product-score', this.barcode],
      {
        state: { data: ingredients.map((ingredient) => ingredient.riskLevel) },
        relativeTo: this.activatedRoute,
      }
    );
  }

  private setPreviousRoute(): void {
    const previousRouteLabel =
      this.router.getCurrentNavigation()?.extras.state?.['data'];

    if (previousRouteLabel === 'favorites') {
      this.previousRoute = '/sidemenu/favorites';
    } else if (previousRouteLabel === 'home') {
      this.previousRoute = '/sidemenu/home';
    }
  }

  private getProduct(barcode: string): void {
    this.getProductByBarcode(barcode)
      .pipe(
        first(),
        catchError((error) => {
          if (error.status === 404) {
            return this.createProduct(barcode).pipe(
              catchError((createError) => {
                this.presentNotFoundProductAlert();
                return throwError(
                  () =>
                    new Error(
                      `Failed to create product: ${createError.message}`
                    )
                );
              })
            );
          }
          return throwError(
            () => new Error(`Failed to fetch product: ${error.message}`)
          );
        })
      )
      .subscribe();
  }

  private getProductByBarcode(barcode: string): Observable<Product> {
    return this.apiClientService.getProductByBarcode(barcode).pipe(
      switchMap((product) => {
        this.product.set(product);
        return of(product);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  private createProduct(
    barcode: string,
    image?: FormData
  ): Observable<Product> {
    return this.apiClientService.createProduct({ barcode, image }).pipe(
      switchMap((product) => {
        this.product.set(product);
        return of(product);
      }),
      catchError((error) => {
        if (image) {
          this.presentCreationProductErrorAlert();
        }
        return throwError(() => error);
      })
    );
  }

  private async presentCreationProductErrorAlert(): Promise<void> {
    await this.alertService.show({
      header: 'Oops..a aparut o eroare',
      message:
        'Te rog sa incerci din nou mai tarziu sau sa raportezi problema daca eroarea persista.',
      buttons: ['Close'],
    });
  }

  private async presentNotFoundProductAlert(): Promise<void> {
    await this.alertService.show({
      header: 'Informatii insuficiente',
      message:
        'Nu s-au gasit suficiente informatii depre acest produs. Te rog sa scanezi lista de ingrediente de pe eticheta.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.scanIngredients();
          },
        },
      ],
    });
  }

  async scanIngredients(): Promise<void> {
    let image;

    try {
      image = await this.cameraService.takeImage();
    } catch {
      this.router.navigate(['/sidemenu/home']);
    }

    if (image) {
      this.createProduct(
        this.barcode!,
        this.convertBase64ImageToFormData(image)
      )
        .pipe(first())
        .subscribe();
    }
  }

  private convertBase64ImageToFormData(base64Image: string): FormData {
    const byteString = atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('image', blob, 'scan.jpg');

    return formData;
  }

  private createFavorite(customName: string): void {
    if (customName && this.product()) {
      this.apiClientService
        .createFavorite({
          productBarcode: this.product()?.barcode!,
          productName: customName,
        })
        .pipe(
          first(),
          catchError((error) => {
            if (error.status === 409) {
              this.presentFavoriteAlreadyExistsToast();
            } else {
              this.presentCreationProductErrorToast();
            }

            return throwError(
              () =>
                new Error(
                  `Failed to add product to favorites: ${error.message}`
                )
            );
          })
        )
        .subscribe({
          next: () => {
            this.presentCreationProductSuccessToast();
            this.favoritesService.notifyFavoritesChanged();
          },
        });
    } else {
      this.presentCreationProductInfoNeededToast();
    }
  }

  private async presentFavoriteAlreadyExistsToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Product already added to favorites',
      duration: 2000,
      position: 'bottom',
      color: 'warning',
    });

    await toast.present();
  }

  private async presentCreationProductErrorToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Something went wrong! Please try again!',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }

  private async presentCreationProductSuccessToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Product successfully added to favorites',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });

    await toast.present();
  }

  private async presentCreationProductInfoNeededToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Please add a name for your product',
      duration: 2000,
      position: 'bottom',
      color: 'warning',
    });

    await toast.present();
  }
}
