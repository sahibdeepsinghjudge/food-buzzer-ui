import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../../ui/header/header';
import { Sidebar } from '../../../ui/sidebar/sidebar';



export interface NavItem{
  text:string,
  link:string,
  visibleTo:number[]
}


@Component({
  selector: 'dashboard-layout',
  imports: [RouterModule, Header, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
    navItems:NavItem[] = [
        { text: 'Home', link: '/dashboard', visibleTo:[2,3] },
        { text: 'Orders', link: '/orders', visibleTo: [0, 1, 2, 3] },
        { text: 'Inventory', link: '/inventory',visibleTo:[2,3] },
        { text: 'Recipes', link: '/recipes',visibleTo:[2,3] },
        { text: 'Products', link: '/products', visibleTo:[2,3] },
        { text: 'Team', link: '/team',visibleTo:[3] },
        { text: 'Customers', link: '/customers',visibleTo:[2,3] },
        { text: 'POS', link: '/pos', visibleTo: [1,2, 3] },
        { text: 'Table Manager', link: '/table-manager', visibleTo: [2, 3] },
        { text: 'KDS', link: '/kds', visibleTo: [1, 2, 3] },
        { text: 'Settings', link: '/settings', visibleTo: [0, 1, 2, 3] },
    ] 
  headerNavItems = [
 

    // { text: 'Accounts', link: '/accounts' },
  ]
}
