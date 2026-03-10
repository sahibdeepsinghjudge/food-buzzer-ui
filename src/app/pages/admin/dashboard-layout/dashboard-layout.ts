import { Component, Input } from '@angular/core';
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
    @Input() currentTab = '/admin';
    navItems = [
        { text: 'Dashboard', link: '/admin' },
        { text: 'Pending requests', link: '/pending-requests' },
        { text: 'Approved Requests', link: '/admin/approved-requests' },
        { text: 'Rejected Requests', link: '/admin/rejected-requests' },
        { text: 'Restaurants', link: '/restaurants' },
        { text: 'Password Requests', link: '/password-requests' },
    ]
}
