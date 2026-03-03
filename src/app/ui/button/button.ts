import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonContainer } from '../button-container/button-container';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ButtonProps {
  text: string;
  variant: "primary" | "secondary" | "black" | "white" | "primary-full" | "secondary-full" | "black-full";
}

@Component({
  selector: 'ui-button',
  imports: [ButtonContainer, CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button implements ButtonProps {
  @Input() text = "Text Not Initialized";
  @Input() variant: "primary" | "secondary" | "black" | "white" | "primary-full" | "secondary-full" | "black-full" = "primary";
  // @Input() onClick: () => void = () => { };
  @Input() routerLink: string = "";

  constructor(private router: Router) { }

  handleClick() {
    this.router.navigate([this.routerLink]);
  }

}
