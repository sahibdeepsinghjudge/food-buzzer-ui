import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../../ui/header/header';
import { Sidebar } from '../../../ui/sidebar/sidebar';
import { NavItem } from '../../dashboard/dashboard-layout/dashboard-layout';

@Component({
  selector: 'admin-dashboard-layout',
  imports: [RouterModule, Header, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
    @Input() currentTab = '/admin';
    navItems: NavItem[] = [
        { text: 'Dashboard', link: '/admin', visibleTo: [4] },
        { text: 'Pending requests', link: '/admin/pending-request', visibleTo: [4] },
        { text: 'Approved Requests', link: '/admin/approved-requests', visibleTo: [4] },
        { text: 'Rejected Requests', link: '/admin/rejected-requests', visibleTo: [4] },
        { text: 'Password Requests', link: '/password-requests', visibleTo: [4] },
    ]
}
