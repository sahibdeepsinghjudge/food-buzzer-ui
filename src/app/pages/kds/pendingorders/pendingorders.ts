import { ChangeDetectorRef, Component } from '@angular/core';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { Dataservice } from '../../../dataservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pendingorders',
  imports: [Kdsscreen, CommonModule],
  templateUrl: './pendingorders.html',
  styleUrl: './pendingorders.css',
})
export class Pendingorders {
  orderData: OrderData[]=[];
  orderedData: OrderData[]=[];
  orderLength: number=0;
  constructor(private dataService: Dataservice, private cdr: ChangeDetectorRef){}

  ngOnInit()
  {
    this.dataService.getData().subscribe(data=>{
      this.orderData=data.orders;
      this.orderedData = this.orderData.filter(o=> o.status==='Pending');
      this.orderLength = this.orderedData.length;
      localStorage.setItem('orders', JSON.stringify(this.orderedData));
      this.cdr.detectChanges();     
    })
  }

  activeDropDown: number|null = null;
  toggleDropDown(orderId: number)
  {
    if(this.activeDropDown===orderId)
    {
      this.activeDropDown=null;
    }
    else
    {
      this.activeDropDown=orderId;  
    }
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
    this.activeDropDown=null;
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