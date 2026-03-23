import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-kds-order-detail',
  standalone: true,
  imports: [CommonModule, Kdsscreen],
  templateUrl: './kds-order-detail.html',
  styleUrls: ['./kds-order-detail.css']
})
export class KdsOrderDetail implements OnInit {
  order: any = null;
  orderId!: number;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  loadOrder() {
    this.isLoading = true;
    this.ordersService.getRestaurantOrders().subscribe({
      next: (orders: any[]) => {
        this.order = orders.find((o: any) => Number(o.id) === this.orderId) || null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(newStatus: string) {
    this.ordersService.updateOrderStatus(this.orderId, newStatus).subscribe({
      next: () => { this.loadOrder(); },
      error: (err) => { console.error('Failed:', err); }
    });
  }

  goBack() {
    this.router.navigate(['/kds/view-all']);
  }

  getCartTotal(): number {
    if (!this.order?.cartItems) return 0;
    return this.order.cartItems.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED': return 'bg-green-100 text-green-700';
      case 'COOKING': return 'bg-orange-100 text-orange-700';
      case 'PREPARED': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'DECLINED': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  }

  printBill() {
    window.print();
  }
}
