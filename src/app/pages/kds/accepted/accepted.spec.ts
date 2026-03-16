import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accepted } from './accepted';

describe('Accepted', () => {
  let component: Accepted;
  let fixture: ComponentFixture<Accepted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accepted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Accepted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
