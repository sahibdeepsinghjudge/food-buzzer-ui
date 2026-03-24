import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderResponse } from '../../../services/orders.service';

@Component({
  selector: 'app-kds-order-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kds-order-card.html',
  styleUrls: ['./kds-order-card.css']
})
export class KdsOrderCard {
  @Input() order!: OrderResponse;
  @Output() statusChange = new EventEmitter<{ orderId: number; status: string }>();

  activeDropDown = false;

  toggleDropDown() {
    this.activeDropDown = !this.activeDropDown;
  }

  emitStatus(status: string) {
    this.statusChange.emit({ orderId: this.order.id, status });
    this.activeDropDown = false;
  }

  printOrder() {
    window.print();
  }

  get formattedTime(): string {
    if (!this.order?.createdAt) return '-';
    try {
      return new Date(this.order.createdAt).toLocaleTimeString('short');
    } catch {
      return this.order.createdAt;
    }
  }

  get statusColorClass(): string {
    switch (this.order?.status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'COOKING': return 'bg-orange-100 text-orange-800';
      case 'PREPARED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'DECLINED': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  }
}
