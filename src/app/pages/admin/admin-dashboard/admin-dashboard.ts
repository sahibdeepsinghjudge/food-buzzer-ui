import { Component } from '@angular/core';
import { DashboardLayout } from '../dashboard-layout/dashboard-layout';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { TableComponent } from '../../../ui/table/table';

@Component({
  selector: 'app-admin-dashboard',
  imports: [TilesContainer,TableComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  dataTiles: any[] = [
    { number: 10, label: 'Pending requests', comparison_parameter: 'last month', comparison_number_percentage: 2 },
    { number: 10, label: 'Approved Requests', comparison_parameter: 'last month', comparison_number_percentage: 4 },
    { number: 10, label: 'Rejected Requests', comparison_parameter: 'last month', comparison_number_percentage: -2 },
    { number: 10, label: 'Restaurants', comparison_parameter: 'last month', comparison_number_percentage: 3 },
    { number: 10, label: 'Password Requests', comparison_parameter: 'last month', comparison_number_percentage: -1 },
  ];
}
