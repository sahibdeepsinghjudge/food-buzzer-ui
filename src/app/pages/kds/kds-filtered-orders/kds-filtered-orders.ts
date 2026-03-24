import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { KdsOrderCard } from '../kds-order-card/kds-order-card';
import { OrdersService, OrderResponse } from '../../../services/orders.service';
import { Subscription } from 'rxjs';

interface FilterConfig {
  title: string;
  activeText: string;
  activeLink: string;
  statuses: string[] | null; // null = fetch all
}

const FILTER_MAP: Record<string, FilterConfig> = {
  'view-all':        { title: 'All Orders',       activeText: 'View All',  activeLink: '/kds/view-all',        statuses: null },
  'pending-orders':  { title: 'Pending Orders',   activeText: 'Pending',   activeLink: '/kds/pending-orders',  statuses: ['PENDING'] },
  'accepted':        { title: 'Accepted Orders',  activeText: 'Accepted',  activeLink: '/kds/accepted',        statuses: ['ACCEPTED'] },
  'declined':        { title: 'Declined Orders',  activeText: 'Declined',  activeLink: '/kds/declined',        statuses: ['DECLINED'] },
  'cooking':         { title: 'Cooking Orders',   activeText: 'Cooking',   activeLink: '/kds/cooking',         statuses: ['COOKING'] },
  'ready':           { title: 'Prepared Orders',  activeText: 'Prepared',  activeLink: '/kds/ready',           statuses: ['PREPARED'] },
  'completed':       { title: 'Completed Orders', activeText: 'Completed', activeLink: '/kds/completed',       statuses: ['COMPLETED'] },
};

const REFRESH_INTERVAL_MS = 15000; // 15 seconds

@Component({
  selector: 'app-kds-filtered-orders',
  standalone: true,
  imports: [CommonModule, Kdsscreen, KdsOrderCard],
  templateUrl: './kds-filtered-orders.html',
  styleUrls: ['./kds-filtered-orders.css']
})
export class KdsFilteredOrders implements OnInit, OnDestroy {
  orders: OrderResponse[] = [];
  orderLength = 0;
  config!: FilterConfig;
  
  isLoading = true;
  errorMsg = '';

  private routeSub!: Subscription;
  private refreshTimer: any;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.routeSub = this.route.data.subscribe(data => {
      const filter = data['filter'] || 'view-all';
      this.config = FILTER_MAP[filter] || FILTER_MAP['view-all'];
      this.isLoading = true;
      this.loadOrders();
    });

    this.startAutoRefresh();
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    this.stopAutoRefresh();
  }

  startAutoRefresh() {
    this.stopAutoRefresh(); // ensure no duplicates
    this.refreshTimer = setInterval(() => {
      if (!this.isLoading) { // only background refresh if not already hard-loading
        this.loadOrders(true);
      }
    }, REFRESH_INTERVAL_MS);
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  loadOrders(isBackgroundRefresh = false) {
    if (!isBackgroundRefresh) {
      this.isLoading = true;
    }
    this.errorMsg = '';

    const statuses = this.config.statuses || undefined;
    this.ordersService.getRestaurantOrders(statuses).subscribe({
      next: (orders) => {
        // Sort newest first
        this.orders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.orderLength = this.orders.length;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        // Only show hard error if it's not a background refresh
        if (!isBackgroundRefresh) {
            this.errorMsg = 'Failed to load orders. Please try again.';
            this.isLoading = false;
            this.cdr.detectChanges();
        }
      }
    });
  }

  onStatusChange(event: { orderId: number; status: string }) {
    // Optimistic update for faster UI response
    const orderIndex = this.orders.findIndex(o => o.id === event.orderId);
    if (orderIndex > -1) {
       this.orders[orderIndex].status = event.status;
       // If the view is filtered and the new status doesn't match the list, immediately remove it from view
       if (this.config.statuses && !this.config.statuses.includes(event.status)) {
           this.orders.splice(orderIndex, 1);
           this.orderLength = this.orders.length;
       }
       this.cdr.detectChanges();
    }

    this.ordersService.updateOrderStatus(event.orderId, event.status).subscribe({
      next: () => { 
        this.loadOrders(true); // silent background fetch to ensure sync
      },
      error: (err) => { 
        console.error('Status update failed:', err);
        this.loadOrders(); // revert back to real state if update failed
      }
    });
  }
}
