import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../../ui/header/header';
import { Sidebar } from '../../../ui/sidebar/sidebar';

@Component({
  selector: 'dashboard-layout',
  imports: [RouterModule, Header, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
    currentTab = '/dashboard';
    navItems = [
        { text: 'Home', link: '/dashboard' },
        // { text: 'POS', link: '/pos' },
        { text: 'Orders', link: '/orders' },
        { text: 'Products', link: '/products' },
        { text: 'Inventory', link: '/inventory' },
        { text: 'Recipies', link: '/recepies' },
        { text: 'Team', link: '/team' },
        { text: 'Analytics', link: '/analytics' },
        { text: 'Digital Menu', link: '/digital-menu' },
        { text: 'Customers', link: '/customers' },
        { text: 'Settings', link: '/settings' },
    ]
  headerNavItems = [
    { text: 'POS', link: '/pos' },
    { text: 'Table Manager', link: '/table-manager' },

    // { text: 'Accounts', link: '/accounts' },
  ]
}
