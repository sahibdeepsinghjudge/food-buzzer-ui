import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-kds-order-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kds-order-card.html',
  styleUrls: ['./kds-order-card.css']
})
export class KdsOrderCard {
  @Input() order: any;
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
}
