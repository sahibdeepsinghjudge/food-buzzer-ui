import { Component, Input, signal } from '@angular/core';
import { Logo } from '../logo/logo';
import { NavItem } from '../nav-item/nav-item';
import { Button } from '../button/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Logo, NavItem,Button,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() navItems: any[] = [];
  isSubmitting = signal(false);
  // @Input() currentTab: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.isSubmitting.set(true);
    this.authService.logout();
    this.isSubmitting.set(false);
  }

  get userEmail(): string {
    return this.authService.getUserEmail();
  }

  get userRole(): string {
    return this.authService.getRole();
  }
}
