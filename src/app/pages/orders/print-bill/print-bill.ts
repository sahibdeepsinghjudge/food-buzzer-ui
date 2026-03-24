import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-print-bill',
  standalone: true,
  imports: [CommonModule, DatePipe, MatIconModule, RouterModule],
  templateUrl: './print-bill.html',
  styleUrls: ['./print-bill.css']
})
export class PrintBill implements OnInit {
  order: any = null;
  id!: number;
  isLoading = true;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
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
    
    this.ordersService.getOrderById(this.id).subscribe({
      next: (order) => {
        if (order) {
            this.order = order;
            // Delay auto-print to let CSS and content render
            setTimeout(() => {
               this.printBill();
            }, 500);
        } else {
            this.errorMsg = 'Order not found.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load order:', err);
        this.errorMsg = 'Failed to load order. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  printBill() {
    window.print();
  }
}
