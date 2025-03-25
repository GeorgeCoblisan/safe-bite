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
import { first } from 'rxjs';

import { BarcodeScannerService } from '../../../shared/barcode-scanner/barcode-scanner.service';
import { CameraService } from '../../../shared/camera/camera.service';
import { ApiClientService } from '../../../shared/services/api-client.service';

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
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private apiClientService: ApiClientService
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

    this.apiClientService
      .createProduct({
        barcode: '20690069',
        image: this.convertBase64ImageToFormData(image!),
      })
      .pipe(first())
      .subscribe();
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
}
