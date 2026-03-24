import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css']
})
export class OrderDetails implements OnInit {
  order: any = null;
  id!: number;
  isLoading = true;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  loadOrder() {
    this.isLoading = true;
    this.errorMsg = '';
    this.ordersService.getRestaurantOrders().subscribe({
      next: (orders: any[]) => {
        // Compare as numbers to handle type mismatches
        this.order = orders.find((o: any) => Number(o.id) === this.id) || null;
        console.log(this.order);
        if (!this.order) {
          this.errorMsg = 'Order not found. It may belong to a different restaurant.';
        }
        if (!this.order.cartItems) {
          this.errorMsg = 'Cart Items not found. It may belong to a different restaurant.';
        }
        // this.order.cartItems = JSON.parse(this.order.cartItems)
        this.isLoading = false;
       
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Failed to load order details.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(newStatus: string) {
    this.ordersService.updateOrderStatus(this.id, newStatus).subscribe({
      next: () => {
        this.loadOrder();
      },
      error: (err) => {
        console.error('Failed to update status:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/orders']);
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED': return 'bg-green-100 text-green-700';
      case 'COOKING': return 'bg-orange-100 text-orange-700';
      case 'PREPARED': case 'READY': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'DECLINED': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  }

  getCartTotal(): number {
    if (!this.order?.cartItems) return 0;
    return this.order.cartItems.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);
  }

  printBill() {
    window.print();
  }
}
