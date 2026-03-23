import { ChangeDetectorRef, Component } from '@angular/core';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-completed',
  imports: [Kdsscreen, CommonModule, RouterModule],
  templateUrl: './completed.html',
  styleUrl: './completed.css',
})
export class Completed {
  orderedData: any[] = [];
  orderLength: number = 0;
  constructor(private ordersService: OrdersService, private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getRestaurantOrders(['COMPLETED']).subscribe(orders => {
      this.orderedData = orders;
      this.orderLength = this.orderedData.length;
      this.cdr.detectChanges();
    });
  }

  printPage() {}
}