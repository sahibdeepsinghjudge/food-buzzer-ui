import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { OrdersService, OrderResponse } from '../../../services/orders.service';

@Component({
  selector: 'app-kds-order-detail',
  standalone: true,
  imports: [CommonModule, Kdsscreen, RouterModule],
  templateUrl: './kds-order-detail.html',
  styleUrls: ['./kds-order-detail.css']
})
export class KdsOrderDetail implements OnInit, OnDestroy {
  order: OrderResponse | null = null;
  orderId!: number;
  
  isLoading = true;
  errorMsg = '';
  
  private refreshTimer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
    
    // Auto refresh the details page to keep status and newly added items up to date
    this.refreshTimer = setInterval(() => {
      this.loadOrder(true);
    }, 15000); // 15s refresh
  }

  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  loadOrder(isBackgroundRefresh = false) {
    if (!isBackgroundRefresh) {
        this.isLoading = true;
    }
    this.errorMsg = '';
    
    this.ordersService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        if (order) {
            this.order = order;
        } else {
            this.errorMsg = 'Order not found. It may have been deleted or belongs to another restaurant.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load order:', err);
        if (!isBackgroundRefresh) {
            this.errorMsg = 'Failed to load order. Please try again.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(newStatus: string) {
    if (!this.order) return;
    
    // Optimistic update
    const previousStatus = this.order.status;
    this.order.status = newStatus;
    
    this.ordersService.updateOrderStatus(this.orderId, newStatus).subscribe({
      next: () => { 
          this.loadOrder(true); 
      },
      error: (err) => { 
          console.error('Status update failed:', err);
          this.order!.status = previousStatus; // Revert
          this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/kds/view-all']);
  }

  getCartTotal(): number {
    if (!this.order?.cartItems) return 0;
    return this.order.cartItems.reduce((sum, item) => sum + (item.totalPrice || (item.unitPrice * item.quantity)), 0);
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'COOKING': return 'bg-orange-100 text-orange-800';
      case 'PREPARED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'DECLINED': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  }

  printBill() {
    window.print();
  }
}
