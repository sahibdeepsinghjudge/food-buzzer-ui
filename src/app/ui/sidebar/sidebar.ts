import { Component, Input } from '@angular/core';
import { SidebarItem } from '../sidebar-item/sidebar-item';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Button } from '../button/button';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItem, CommonModule, Button],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() navItems: any[] = [];

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
