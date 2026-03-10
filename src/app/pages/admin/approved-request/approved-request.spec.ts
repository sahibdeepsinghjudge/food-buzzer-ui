import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRequest } from './approved-request';

describe('ApprovedRequest', () => {
  let component: ApprovedRequest;
  let fixture: ComponentFixture<ApprovedRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
