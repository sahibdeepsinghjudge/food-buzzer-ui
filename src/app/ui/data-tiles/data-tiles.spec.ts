import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTiles } from './data-tiles';

describe('DataTiles', () => {
  let component: DataTiles;
  let fixture: ComponentFixture<DataTiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTiles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
