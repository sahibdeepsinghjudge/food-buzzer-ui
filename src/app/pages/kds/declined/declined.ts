import { ChangeDetectorRef, Component } from '@angular/core';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { Dataservice } from '../../../dataservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-declined',
  imports: [Kdsscreen, CommonModule],
  templateUrl: './declined.html',
  styleUrl: './declined.css',
})
export class Declined {
  orderData: OrderData[]=[];
  orderedData: OrderData[]=[];
  orderLength: number=0;
  constructor(private dataService: Dataservice , private cdr: ChangeDetectorRef){}

  ngOnInit()
  {
    this.dataService.getData().subscribe(data=>{
      this.orderData = data.orders;
      this.orderedData = this.orderData.filter(o=> o.status==='Declined');
      this.orderLength = this.orderedData.length;
      this.cdr.detectChanges();
    })
  }

  printPage()
  {

  }

}

export interface OrderData{
  orderId: number;
  table: number;
  status: string;
  time: Date;
  customer: Customer;
  items: Items[];
}

export interface Customer{
  name: string;
  email: string;
  mobile: number;
}

export interface Items{
  name: string;
  quantity: number;
  recipe: string[];
}