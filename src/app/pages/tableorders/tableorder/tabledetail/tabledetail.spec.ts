import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tabledetail } from './tabledetail';

describe('Tabledetail', () => {
  let component: Tabledetail;
  let fixture: ComponentFixture<Tabledetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabledetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tabledetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
