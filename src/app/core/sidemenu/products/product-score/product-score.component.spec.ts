import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductScoreComponent } from './product-score.component';

describe('ProductScoreComponent', () => {
  let component: ProductScoreComponent;
  let fixture: ComponentFixture<ProductScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
