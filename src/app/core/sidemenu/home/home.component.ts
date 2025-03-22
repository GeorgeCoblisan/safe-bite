import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanSharp } from 'ionicons/icons';

import { BarcodeScannerService } from '../../../shared/barcode-scanner/barcode-scanner.service';
import { CameraService } from '../../../shared/camera/camera.service';
import { OcrService } from '../../../shared/ocr/ocr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [IonContent, IonButton, IonIcon, IonSpinner],
})
export class HomeComponent {
  isLoading = false;

  private scannedBarcode!: string;

  private scannedIngredients: string | undefined;

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private cameraService: CameraService,
    private ocrService: OcrService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) {
    addIcons({ scanSharp });
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

  async scanIngredients(): Promise<void> {
    const image = await this.cameraService.takeImage();

    this.isLoading = true;

    if (image) {
      this.scannedIngredients = await this.ocrService.convertImageToText(image);

      this.isLoading = false;

      if (this.scannedIngredients) {
        console.log(this.scannedIngredients);
        alert(this.scannedIngredients);
      } else {
        alert('Ingredientele nu au fost gasite');
      }
    } else {
      alert('Imaginea nu a fost incarcata cu succes');
    }
  }
}
