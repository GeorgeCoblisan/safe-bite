import { Injectable } from '@angular/core';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerScanResult,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerServiceService {
  async scanBarcode(): Promise<CapacitorBarcodeScannerScanResult> {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.CODABAR,
    });

    return result;
  }
}
