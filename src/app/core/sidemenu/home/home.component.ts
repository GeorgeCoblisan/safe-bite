import { Component } from '@angular/core';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanSharp } from 'ionicons/icons';

import { BarcodeScannerServiceService } from '../../../shared/barcode-scanner/barcode-scanner-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [IonContent, IonButton, IonIcon],
})
export class HomeComponent {
  private scannedBarcode!: string;

  constructor(private barcodeScannerService: BarcodeScannerServiceService) {
    addIcons({ scanSharp });
  }

  async startScan(): Promise<void> {
    this.scannedBarcode = (
      await this.barcodeScannerService.scanBarcode()
    ).ScanResult;

    console.log(this.scannedBarcode);

    alert(this.scannedBarcode);
  }
}
