import { Component, Input } from '@angular/core';
import { Logo } from '../logo/logo';
import { NavItem } from '../nav-item/nav-item';
import { Button } from '../button/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Logo, NavItem,Button,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
    @Input() navItems: any[] = [];
    // @Input() currentTab: string = '';
}
