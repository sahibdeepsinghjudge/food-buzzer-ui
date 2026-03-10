import { Component, ChangeDetectorRef } from '@angular/core';
import { Dataservice } from '../../../dataservice';
import { TableComponent } from '../../../ui/table/table';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { Restaurant } from '../../interface/restaurant';
import { Owner } from '../../interface/owner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rejected-requests',
  imports: [TableComponent, TilesContainer, CommonModule],
  templateUrl: './rejected-requests.html',
  styleUrl: './rejected-requests.css',
})
export class RejectedRequests {
  index: number=0;
  serialNo:number=0;
  tableColumns: any[]=[];
  tableData: any[]=[];
  restaurantData: Restaurant[]=[];
  ownerData: Owner[]=[];
  constructor(private dataService: Dataservice, private cdr: ChangeDetectorRef){}
  ngOnInit(){
    this.dataService.getData().subscribe(data=> {
      this.restaurantData = data.restaurants.data;
      this.ownerData = data.owners.data
      this.tableData = this.restaurantData.filter(r=> r.status==='Declined').map((r,index)=> {
        const owner = this.ownerData.find(o=> o.id===r.ownerId);
        return {
          serialNo: index+1,
          id: r.id,
          name: r.name,
          ownerName: owner?.name,
          status: r.status

        }
      });
      this.tableColumns = [
        {key: 'serialNo', label: 'Id' },
        {key: 'name', label: 'Restaurant Name', type: 'link', routerLink: '/admin/restaurant-details'},
        {key: 'ownerName', label: 'Owner Name'},
        {key: 'status', label: 'Status'}
      ]
      this.cdr.detectChanges();
    });
  }
  dataTiles: any[]=[
    { number: 10, label: 'Rejected Requests', comparison_parameter: 'last month', comparison_number_percentage: -2 },
  ]
}
