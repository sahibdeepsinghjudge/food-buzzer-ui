import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProducts } from './create-products';

describe('CreateProducts', () => {
  let component: CreateProducts;
  let fixture: ComponentFixture<CreateProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
