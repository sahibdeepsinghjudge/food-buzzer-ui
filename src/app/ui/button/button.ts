import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonContainer } from '../button-container/button-container';

type Variant =
  | 'primary'
  | 'secondary'
  | 'black'
  | 'white'
  | 'primary-full'
  | 'secondary-full'
  | 'black-full'
  | 'logout'
  | 'error';

type Radius =
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | 'full';


@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, ButtonContainer],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class Button {
  @Input() text = 'Text Not Initialized';
  @Input() variant: Variant = 'primary';
  @Input() radius: Radius = 'full';
  @Input() routerLink?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;


  constructor(private router: Router) {}

  @Output() clicked = new EventEmitter<void>();

  handleClick(event: Event) {
    if (this.isLoading || this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.type === 'button') {
        event.preventDefault();
    }

    if (this.routerLink) {
      this.router.navigate([this.routerLink]);
    }

    this.clicked.emit();
  }

get buttonClasses() {
  const base =
    'px-8 py-3 cursor-pointer font-semibold ';

  const variants: Record<string, string> = {
    primary: 'bg-primary text-white transition-all hover:px-12',
    secondary: 'bg-bg-sec text-neutral-500 border-2 border-neutral-200 transition-all hover:px-12',
    black: 'bg-black text-white transition-all hover:px-12',
    white: 'bg-white text-black border-2 border-black transition-all hover:px-12',
    'primary-full': 'bg-primary text-white w-full',
    'secondary-full': 'bg-bg-sec text-neutral-500 border-2 border-neutral-200 w-full',
    'black-full': 'bg-black text-white w-full',
    'logout': 'bg-white text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition-all',
    'error': 'bg-red-50 text-red-500 border-2 border-red-500 transition-all hover:px-12',
  };

  const radiusMap: Record<string, string> = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    '4xl': 'rounded-4xl',
    '5xl': 'rounded-5xl',
    '6xl': 'rounded-6xl',
    full: 'rounded-full',
  };

  return [
    base,
    variants[this.variant],
    radiusMap[this.radius],
    this.isLoading || this.disabled ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''
  ];
}
}