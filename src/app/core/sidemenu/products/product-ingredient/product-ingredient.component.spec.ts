import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIngredientComponent } from './product-ingredient.component';

describe('ProductIngredientComponent', () => {
  let component: ProductIngredientComponent;
  let fixture: ComponentFixture<ProductIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductIngredientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
