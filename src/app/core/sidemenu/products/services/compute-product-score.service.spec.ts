import { TestBed } from '@angular/core/testing';

import { ComputeProductScoreService } from './compute-product-score.service';

describe('ComputeProductScoreService', () => {
  let service: ComputeProductScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputeProductScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
