import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesContainer } from './tiles-container';

describe('TilesContainer', () => {
  let component: TilesContainer;
  let fixture: ComponentFixture<TilesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TilesContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TilesContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
