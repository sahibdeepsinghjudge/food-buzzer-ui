import { ChangeDetectorRef, Component } from '@angular/core';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { Dataservice } from '../../../dataservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ready',
  imports: [Kdsscreen, CommonModule],
  templateUrl: './ready.html',
  styleUrl: './ready.css',
})
export class Ready {
  orderData: OrderData[]=[];
  orderedData: OrderData[]=[];
  orderLength: number=0;
  constructor(private dataService: Dataservice, private cdr: ChangeDetectorRef){}

  ngOnInit()
  {
    this.dataService.getData().subscribe(data=>{
      this.orderData=data.orders;
      this.orderedData = this.orderData.filter(o=> o.status==='Prepared');
      this.orderLength = this.orderedData.length;
      localStorage.setItem('orders', JSON.stringify(this.orderedData));
      this.cdr.detectChanges();     
    })
  }
  updateStatus(orderId: number, status: string)
  {
    const order = this.orderedData.find(o => o.orderId===orderId);
    if(order){
      order.status=status;
      this.orderedData = this.orderedData.filter(o => o.orderId !== orderId);
      this.orderData = this.orderData.map(o =>
      o.orderId === orderId ? { ...o, status: status } : o
      );
      localStorage.setItem('orders', JSON.stringify(this.orderData));
    }
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
