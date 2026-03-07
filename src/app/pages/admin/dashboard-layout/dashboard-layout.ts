import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../../ui/header/header';
import { Sidebar } from '../../../ui/sidebar/sidebar';

@Component({
  selector: 'admin-dashboard-layout',
  imports: [RouterModule, Header, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
    navItems = [
        { text: 'Dashboard', link: '/admin-dashboard' },
        { text: 'Pending requests', link: '/pending-requests' },
        { text: 'Approved Requests', link: '/approved-requests' },
        { text: 'Rejected Requests', link: '/rejected-requests' },
        { text: 'Restaurants', link: '/restaurants' },
        { text: 'Password Requests', link: '/password-requests' },
    ]
}
