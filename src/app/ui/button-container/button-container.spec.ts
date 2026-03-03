import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonContainer } from './button-container';

describe('ButtonContainer', () => {
  let component: ButtonContainer;
  let fixture: ComponentFixture<ButtonContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
