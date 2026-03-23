import { ChangeDetectorRef, Component } from '@angular/core';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-declined',
  imports: [Kdsscreen, CommonModule, RouterModule],
  templateUrl: './declined.html',
  styleUrl: './declined.css',
})
export class Declined {
  orderedData: any[] = [];
  orderLength: number = 0;
  constructor(private ordersService: OrdersService, private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getRestaurantOrders(['DECLINED']).subscribe(orders => {
      this.orderedData = orders;
      this.orderLength = this.orderedData.length;
      this.cdr.detectChanges();
    });
  }

  printPage() {}
}