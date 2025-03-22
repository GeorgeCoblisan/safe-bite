import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
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
import { cameraOutline, pricetagOutline } from 'ionicons/icons';
import { catchError, first, Observable, of, switchMap, throwError } from 'rxjs';

import { Product } from '../../../../shared/api-models/product.model';
import { RiskLevel } from '../../../../shared/api-models/risk-level.enum';
import { CameraService } from '../../../../shared/camera/camera.service';
import { ApiClientService } from '../../../../shared/services/api-client.service';

@Component({
  selector: 'app-product-details',
  imports: [
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
  additiveColorMapping: Record<RiskLevel, string> = {
    [RiskLevel.HIGH]: '#b91c1c',
    [RiskLevel.MEDIUM]: '#ca8a04',
    [RiskLevel.LOW]: '#15803d',
  };

  product = signal<Product | null>(null);

  private barcode?: string;

  constructor(
    private route: ActivatedRoute,
    private apiClientService: ApiClientService,
    private alertController: AlertController,
    private cameraService: CameraService,
    private router: Router
  ) {
    addIcons({ pricetagOutline, cameraOutline });
  }

  ngOnInit(): void {
    this.barcode = this.route.snapshot.paramMap.get('barcode') as string;

    this.getProduct(this.barcode);
  }

  counter(i: number): Array<number> {
    return new Array(i);
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
        //this.presentCreationProductErrorAlert();
        return throwError(() => error);
      })
    );
  }

  private createProduct(barcode: string): Observable<Product> {
    return this.apiClientService.createProduct({ barcode }).pipe(
      switchMap((product) => {
        this.product.set(product);
        return of(product);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  private async presentCreationProductErrorAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Oops..a aparut o eroare',
      message:
        'Te rog sa incerci din nou mai tarziu sau sa raportezi problema daca eroarea persista.',
      buttons: ['Close'],
    });

    await alert.present();
  }

  private async presentNotFoundProductAlert(): Promise<void> {
    const alert = await this.alertController.create({
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

    await alert.present();
  }

  async scanIngredients(): Promise<void> {
    let image;

    try {
      image = await this.cameraService.takeImage();
    } catch {
      this.router.navigate(['/sidemenu/home']);
    }

    if (image) {
      this.createProduct(this.barcode!).pipe(first()).subscribe();
    }
  }
}
