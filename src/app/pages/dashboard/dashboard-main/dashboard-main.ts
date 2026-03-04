import { Component } from '@angular/core';
import { DashboardLayout } from '../dashboard-layout/dashboard-layout';

@Component({
  selector: 'app-dashboard-main',
  imports: [DashboardLayout],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css',
})
export class DashboardMain {
  title = 'Dashboard';
}
