import { Component, Input } from '@angular/core';
import { SidebarItem } from '../sidebar-item/sidebar-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItem,CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() navItems: any[] = [];
}
