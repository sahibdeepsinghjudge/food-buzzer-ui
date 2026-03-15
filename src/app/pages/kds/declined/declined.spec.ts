import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Declined } from './declined';

describe('Declined', () => {
  let component: Declined;
  let fixture: ComponentFixture<Declined>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Declined]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Declined);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
