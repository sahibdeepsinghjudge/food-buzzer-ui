import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kdsscreen } from './kdsscreen';

describe('Kdsscreen', () => {
  let component: Kdsscreen;
  let fixture: ComponentFixture<Kdsscreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kdsscreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kdsscreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
