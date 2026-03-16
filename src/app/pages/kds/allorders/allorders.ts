import { ChangeDetectorRef, Component} from '@angular/core';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { Dataservice } from '../../../dataservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allorders',
  imports: [Kdsscreen, CommonModule],
  templateUrl: './allorders.html',
  styleUrl: './allorders.css',
})
export class Allorders{
  orderedData:OrderData[]=[];
  tables:number[]=[];
  orderLength: number=0;
  constructor(private dataService: Dataservice, private cdr: ChangeDetectorRef){}

  ngOnInit(){
    this.dataService.getData().subscribe(data=>{
      this.orderedData = data.orders;
      this.orderLength = this.orderedData.length;
      this.cdr.detectChanges();     
    })
  }

  printPage(){

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
    if(order)
    {
      order.status=status;
    }
    this.activeDropDown=null;
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