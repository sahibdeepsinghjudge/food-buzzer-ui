import { Component } from '@angular/core';
import { Logo } from '../logo/logo';
import { NavItem } from '../nav-item/nav-item';

@Component({
  selector: 'app-header',
  imports: [Logo, NavItem],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
