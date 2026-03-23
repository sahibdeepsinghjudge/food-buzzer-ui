import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { KdsOrderCard } from '../kds-order-card/kds-order-card';
import { OrdersService } from '../../../services/orders.service';

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

@Component({
  selector: 'app-kds-filtered-orders',
  standalone: true,
  imports: [CommonModule, Kdsscreen, KdsOrderCard],
  templateUrl: './kds-filtered-orders.html',
  styleUrls: ['./kds-filtered-orders.css']
})
export class KdsFilteredOrders implements OnInit {
  orders: any[] = [];
  orderLength = 0;
  config!: FilterConfig;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const filter = this.route.snapshot.data['filter'] || 'view-all';
    this.config = FILTER_MAP[filter] || FILTER_MAP['view-all'];
    this.loadOrders();
  }

  loadOrders() {
    const statuses = this.config.statuses || undefined;
    this.ordersService.getRestaurantOrders(statuses!).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.orderLength = orders.length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
      }
    });
  }

  onStatusChange(event: { orderId: number; status: string }) {
    this.ordersService.updateOrderStatus(event.orderId, event.status).subscribe({
      next: () => { this.loadOrders(); },
      error: (err) => { console.error('Status update failed:', err); }
    });
  }
}
