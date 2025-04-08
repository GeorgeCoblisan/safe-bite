import { Component, OnInit } from '@angular/core';
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

import { AuthService } from '../../../shared/auth/services/auth.service';
import { BarcodeScannerService } from '../../../shared/barcode-scanner/barcode-scanner.service';

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
export class HomeComponent implements OnInit {
  userName?: string;

  private scannedBarcode!: string;

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private authService: AuthService
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
  }

  async startScan(): Promise<void> {
    this.scannedBarcode = (
      await this.barcodeScannerService.scanBarcode()
    ).ScanResult;

    this.navCtrl.navigateForward(
      ['/sidemenu/products/product', this.scannedBarcode],
      { relativeTo: this.activatedRoute }
    );
  }
}
