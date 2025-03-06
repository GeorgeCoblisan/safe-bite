import { TestBed } from '@angular/core/testing';

import { BarcodeScannerServiceService } from './barcode-scanner-service.service';

describe('BarcodeScannerServiceService', () => {
  let service: BarcodeScannerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarcodeScannerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
