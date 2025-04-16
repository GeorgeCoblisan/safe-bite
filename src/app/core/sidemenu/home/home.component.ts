import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanSharp, starSharp, trophySharp } from 'ionicons/icons';
import {
  catchError,
  first,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';

import { RiskLevel } from '../../../shared/api-models/risk-level.enum';
import { AuthService } from '../../../shared/auth/services/auth.service';
import { BarcodeScannerService } from '../../../shared/barcode-scanner/barcode-scanner.service';
import { ApiClientService } from '../../../shared/services/api-client.service';
import { FavoritesService } from '../../../shared/services/favorites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonAvatar,
    IonContent,
    IonButton,
    IonIcon,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  userName?: string;

  noFavoritesProducts?: number = 0;

  noFavoritesWithHarmfulIngredients?: number = 0;

  private scannedBarcode!: string;

  private destroyNotifyFavorites$ = new Subject<void>();

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private authService: AuthService,
    private apiClientService: ApiClientService,
    private favoritesService: FavoritesService
  ) {
    addIcons({ scanSharp, trophySharp, starSharp });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userName = user.name ?? user.email;
      },
      error: () => {
        this.userName = 'Guest';
      },
    });

    this.favoritesService.favoritesUpdated$
      .pipe(takeUntil(this.destroyNotifyFavorites$))
      .subscribe(() => {
        this.getFavorites();
        this.getFavoritesWithProductProperties();
      });

    this.getFavorites();
    this.getFavoritesWithProductProperties();
  }

  ngOnDestroy(): void {
    this.destroyNotifyFavorites$.complete();
  }

  async startScan(): Promise<void> {
    this.scannedBarcode = (
      await this.barcodeScannerService.scanBarcode()
    ).ScanResult;

    this.navCtrl.navigateForward(
      ['/sidemenu/products/product', this.scannedBarcode],
      { state: { data: 'home' }, relativeTo: this.activatedRoute }
    );
  }

  private getFavorites(): void {
    this.apiClientService
      .getFavorites()
      .pipe(
        first(),
        switchMap((favorites) => {
          this.noFavoritesProducts = favorites.length;
          return of();
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  private getFavoritesWithProductProperties(): void {
    this.apiClientService
      .getFavoritesWithProductProperties()
      .pipe(
        first(),
        switchMap((favorites) => {
          this.noFavoritesWithHarmfulIngredients = favorites.filter(
            (favorite) => favorite.riskLevels.includes(RiskLevel.HIGH)
          ).length;
          return of();
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe();
  }
}
