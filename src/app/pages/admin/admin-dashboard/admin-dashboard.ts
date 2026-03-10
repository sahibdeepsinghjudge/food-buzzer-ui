import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardLayout } from '../dashboard-layout/dashboard-layout';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { TableComponent } from '../../../ui/table/table';
import { Dataservice } from '../../../dataservice';
import { Restaurant } from '../../interface/restaurant';
import { Owner } from '../../interface/owner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardLayout, TilesContainer,TableComponent, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit{
  checkDetails:number = 0; //0 means pending request
  index: number=0;
  serialNo:number=0;
  tableColumns: any[]=[];
  tableData: any[]=[];
  owner: Owner[]=[];
  restaurant: Restaurant[]=[];
  constructor(private dataService: Dataservice, private cdr: ChangeDetectorRef){}
  ngOnInit(){
   this.dataService.getData().subscribe(data => {

    this.owner = data.owners.data;
    this.restaurant = data.restaurants.data;

    this.tableData = this.restaurant.filter(r=> r.status==='pending').map((r, index) => {
      const owner = this.owner.find(o => o.id === r.ownerId);

      return {
        serialNo: index+1,
        id: r.id,
        name: r.name,
        ownerName: owner?.name,
        status: r.status
      };
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
  dataTiles: any[] = [
    { number: 10, label: 'Pending requests', comparison_parameter: 'last month', comparison_number_percentage: 2 },
    { number: 10, label: 'Approved Requests', comparison_parameter: 'last month', comparison_number_percentage: 4 },
    { number: 10, label: 'Rejected Requests', comparison_parameter: 'last month', comparison_number_percentage: -2 },
    { number: 10, label: 'Restaurants', comparison_parameter: 'last month', comparison_number_percentage: 3 },
    { number: 10, label: 'Password Requests', comparison_parameter: 'last month', comparison_number_percentage: -1 },
  ];
}
