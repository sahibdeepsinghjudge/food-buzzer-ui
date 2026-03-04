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
  @Input() currentTab: string = '/orders';
  navItems = [
        { text: 'Home', link: '/dashboard' },
        { text: 'POS', link: '/pos' },
        { text: 'Orders', link: '/orders' },
        { text: 'Products', link: '/products' },
        { text: 'Inventory', link: '/inventory' },
        { text: 'Recipies', link: '/recepies' },
        { text: 'KDS', link: '/kds' },
        { text: 'Analytics', link: '/analytics' },
        { text: 'Digital Menu', link: '/digital-menu' },
        { text: 'Customers', link: '/customers' },
        { text: 'Settings', link: '/settings' },
    ]
}
