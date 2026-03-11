import { ChangeDetectorRef, Component } from '@angular/core';
import { Dataservice } from '../../../dataservice';
import { Restaurant } from '../../interface/restaurant';
import { Owner } from '../../interface/owner';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { TableComponent } from '../../../ui/table/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending-request',
  imports: [TilesContainer, TableComponent, CommonModule],
  templateUrl: './pending-request.html',
  styleUrl: './pending-request.css',
})
export class PendingRequest {
  checkRequestStatus: string='pending';//for pending request
  index: number=0;
  serialNo:number=0;
  restaurants: Restaurant[]=[];
  owners: Owner[]=[];
  tableData: any[]=[];
  tableColumns: any[]=[];
  constructor(private dataService: Dataservice, private cdr: ChangeDetectorRef){}
  ngOnInit(){
    this.dataService.getData().subscribe(data=>{
      this.restaurants = data.restaurants.data;
      this.owners = data.owners.data;
      this.tableData = this.restaurants.filter(r=> r.status=='pending').map((r,index)=>{
        const owner = this.owners.find(o=> o.id==r.ownerId);

        return{
          serialNo: index+1,
          id: r.id,
          name: r.name,
          ownerName: owner?.name,
          status: r.status
        }
      });
      this.tableColumns=[
        { key: 'serialNo', label: 'Id' },
        { key: 'name', label: 'Restaurant Name', type: "link", routerLink: "/admin/restaurant-details" },
        { key: 'ownerName', label: 'Owner Name' },
        { key: 'status', label: 'Status'}
      ];
      this.cdr.detectChanges();
    })
  }
  dataTiles: any[]=[
    { number: 10, label: 'Approved Requests', comparison_parameter: 'last month', comparison_number_percentage: 4 },
  ]
}
