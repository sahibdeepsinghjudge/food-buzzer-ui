import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardLayout } from '../dashboard-layout/dashboard-layout';
import { TableComponent } from '../../../ui/table/table';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { Dataservice } from '../../../dataservice';
import { Restaurant } from '../../interface/restaurant';
import { Owner } from '../../interface/owner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approved-request',
  imports: [DashboardLayout, TableComponent, TilesContainer, CommonModule],
  templateUrl: './approved-request.html',
  styleUrl: './approved-request.css',
})
export class ApprovedRequest implements OnInit{
  //checkDetail:number = 1; //1 means request not pending
  index: number=0;
  serialNo:number=0;
  tableData: any[]=[]
  restaurantdata: Restaurant[]=[]
  owner: Owner[]=[]
  tableColumns: any[]=[]
  constructor(private dataService: Dataservice, private cdr: ChangeDetectorRef){}
  ngOnInit(){
    this.dataService.getData().subscribe(data=>{
      this.restaurantdata=data.restaurants.data;
      this.owner=data.owners.data;

      this.tableData=this.restaurantdata.filter(r => r.status==='Approved').map((r,index)=>{
        const owner=this.owner.find(o=> o.id===r.ownerId);
              console.log("Data is");

              console.log(this.tableData);

        return {
          serialNo: index+1,
          id: r.id,
          name: r.name,
          ownerName: owner?.name,
          status: r.status
        }
      });
      this.tableColumns = [
      { key: 'serialNo', label: 'Id' },
      { key: 'name', label: 'Restaurant Name', type: "link", routerLink: "/admin/restaurant-details" },
      { key: 'ownerName', label: 'Owner Name' },
      { key: 'status', label: 'Status'}
    ];
    this.cdr.detectChanges();
  });
  }
  dataTiles: any[]=[
    { number: 10, label: 'Approved Requests', comparison_parameter: 'last month', comparison_number_percentage: 4 },
  ]
}
