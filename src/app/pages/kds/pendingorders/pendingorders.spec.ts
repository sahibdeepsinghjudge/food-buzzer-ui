import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pendingorders } from './pendingorders';

describe('Pendingorders', () => {
  let component: Pendingorders;
  let fixture: ComponentFixture<Pendingorders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pendingorders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pendingorders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
