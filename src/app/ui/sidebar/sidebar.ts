import { Component, Input, signal } from '@angular/core';
import { SidebarItem } from '../sidebar-item/sidebar-item';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Button } from '../button/button';
import { NavItem } from '../../pages/dashboard/dashboard-layout/dashboard-layout';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItem, CommonModule, Button],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() navItems: NavItem[] = [];
  
  SideBarItems = signal<NavItem[]>([]);

  constructor(private authService: AuthService) {}

  ngOnInit(){
    this.navItems = this.navItems.filter((item)=>{
      return item.visibleTo.includes(this.userAccessLevel)
    })
    this.SideBarItems.set(this.navItems);

  }

  get userAccessLevel(){
    return this.authService.accessLevel()
  }
  logout() {
    this.authService.logout();
  }
}
