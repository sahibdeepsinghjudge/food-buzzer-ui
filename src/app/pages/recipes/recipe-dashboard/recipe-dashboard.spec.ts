import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDashboard } from './recipe-dashboard';

describe('RecipeDashboard', () => {
  let component: RecipeDashboard;
  let fixture: ComponentFixture<RecipeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
