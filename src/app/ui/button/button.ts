import { Component, Input } from '@angular/core';
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
  | 'black-full';

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
  @Input() onClick?: any;


  constructor(private router: Router) {}

  handleClick() {
    if (this.routerLink) {
      this.router.navigate([this.routerLink]);
    }
    if (this.onClick) {
      this.onClick();
    }
  }

get buttonClasses() {
  const base =
    'px-8 py-3 cursor-pointer font-semibold transition-all hover:px-12';

  const variants: Record<string, string> = {
    primary: 'bg-primary text-white',
    secondary: 'bg-bg-sec text-neutral-500 border-2 border-neutral-200',
    black: 'bg-black text-white',
    white: 'bg-white text-black border-2 border-black',
    'primary-full': 'bg-primary text-white w-full',
    'secondary-full': 'bg-bg-sec text-neutral-500 border-2 border-neutral-200 w-full',
    'black-full': 'bg-black text-white w-full',
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
  ];
}
}