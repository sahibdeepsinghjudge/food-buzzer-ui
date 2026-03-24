import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AnalyticsService, MonthlyAnalyticsResponse, DailyAnalyticsResponse, TopSellingItemDTO } from '../../../services/analytics.service';
import { InventoryService } from '../../inventory/inventory-service';
import { TableComponent, TableColumn } from '../../../ui/table/table';
import { MatIconModule } from '@angular/material/icon';

interface HourlyChartBar {
  hourLabel: string;
  count: number;
  heightPercent: number;
}

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableComponent, MatIconModule],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css',
  providers: [DatePipe] // For formatting today's date
})
export class DashboardMain implements OnInit {
  title = 'Dashboard';
  user = signal<string>("");

  monthlyData = signal<MonthlyAnalyticsResponse | null>(null);
  dailyData = signal<DailyAnalyticsResponse | null>(null);
  lowStockCount = signal<number>(0);
  selectedDate = signal<string>('');
  hourlyChart = signal<HourlyChartBar[]>([]);

  topSellingColumns: TableColumn[] = [
    { key: 'itemName', label: 'Item Name' },
    { key: 'quantitySold', label: 'Quantity Sold' },
    { key: 'revenue', label: 'Revenue (₹)' }
  ];

  isMonthlyLoading = signal(true);
  isDailyLoading = signal(true);
  isInventoryLoading = signal(true);

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private inventoryService: InventoryService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.user.set(this.authService.getUserEmail());
    
    // Set default date to today based on user's timezone format (YYYY-MM-DD for input type="date")
    const today = new Date();
    this.selectedDate.set(this.datePipe.transform(today, 'yyyy-MM-dd') || '');

    this.loadMonthlyData();
    this.loadDailyData();
    this.loadInventoryData();
  }

  loadMonthlyData() {
    this.isMonthlyLoading.set(true);
    this.analyticsService.getCurrentMonthAnalytics().subscribe({
      next: (data) => {
        this.monthlyData.set(data);
        this.isMonthlyLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load monthly analytics', err);
        this.isMonthlyLoading.set(false);
      }
    });
  }

  loadDailyData() {
    if (!this.selectedDate()) return;
    
    this.isDailyLoading.set(true);
    this.analyticsService.getDailyAnalytics(this.selectedDate()).subscribe({
      next: (data) => {
        this.dailyData.set(data);
        this.generateHourlyChart(data.hourlyOrders || []);
        this.isDailyLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load daily analytics', err);
        this.hourlyChart.set([]);
        this.isDailyLoading.set(false);
      }
    });
  }

  loadInventoryData() {
    this.isInventoryLoading.set(true);
    this.inventoryService.getFilteredMaterials('low_on_stock').subscribe({
      next: (materials) => {
        this.lowStockCount.set(materials.length);
        this.isInventoryLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load inventory', err);
        this.isInventoryLoading.set(false);
      }
    });
  }

  onDateChange() {
    this.loadDailyData();
  }

  private generateHourlyChart(hourlyOrders: {hour: number, orderCount: number}[]) {
    let maxCount = 0;
    let minHour = 23;
    let maxHour = 0;
    
    // Find min/max counts and active hours range
    hourlyOrders.forEach(h => {
      if (h.orderCount > 0) {
        if (h.hour < minHour) minHour = h.hour;
        if (h.hour > maxHour) maxHour = h.hour;
        if (h.orderCount > maxCount) maxCount = h.orderCount;
      }
    });

    // Handle case with no orders today by defaulting to a standard 8am-8pm window
    if (maxCount === 0) {
      minHour = 8; 
      maxHour = 20;
    }

    // Add a Y-axis buffer: e.g. if max count is 10, the chart scales up to 15.
    const chartMax = maxCount === 0 ? 1 : Math.ceil(maxCount * 1.5);

    // Create chart bars only from the start time of the first order to the end time
    const chartBars: HourlyChartBar[] = [];
    for (let i = minHour; i <= maxHour; i++) {
        const found = hourlyOrders.find(h => h.hour === i);
        const count = found ? found.orderCount : 0;
        
        const displayHour = i % 12 === 0 ? 12 : i % 12;
        const ampm = i < 12 ? 'AM' : 'PM';
        
        chartBars.push({
            hourLabel: `${displayHour} ${ampm}`,
            count: count,
            heightPercent: maxCount === 0 ? 0 : (count / chartMax) * 100
        });
    }

    this.hourlyChart.set(chartBars);
  }
}
