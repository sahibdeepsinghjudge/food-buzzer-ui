import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { TableComponent } from '../../../ui/table/table';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Restaurant } from '../../interface/restaurant';
import { Owner } from '../../interface/owner';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ TilesContainer,TableComponent, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})

//export interface RequestResponseData{

//}

export class AdminDashboard implements OnInit{
  checkDetails:number = 0; //0 means pending request
  index: number=0;
  serialNo:number=0;
  tableColumns: any[]=[];
  tableData: any[]=[];
  restaurant: Restaurant[]=[];
  dataTiles: any[] = [];

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef){}

  ngOnInit(){
   this.adminService.getRequestsByStatus().subscribe((data: any) => {
    const requestArray = data.requests || [];
    this.tableData = requestArray.map((r: any, index: number) => {
      return {
        serialNo: index+1,
        id: r.restaurantId,
        name: r.name,
        ownerName: r.ownerFullName || 'N/A',
        status: r.approvalStatus || 'pending'
      };
    });

    this.tableColumns = [
      { key: 'serialNo', label: 'Id' },
      { key: 'name', label: 'Restaurant Name', type: "link", routerLink: "/admin/restaurant-details" },
      { key: 'ownerName', label: 'Owner Name' },
      { key: 'status', label: 'Status'}
    ];

    this.dataTiles = [
      { number: data.pendingRequestsCount || 0, label: 'Pending requests', comparison_parameter: 'total', comparison_number_percentage: null },
      { number: data.approvedRequestsCount || 0, label: 'Approved Requests', comparison_parameter: 'total', comparison_number_percentage: null },
      { number: data.declinedRequestsCount || 0, label: 'Rejected Requests', comparison_parameter: 'total', comparison_number_percentage: null },
      { number: data.requestsCount || 0, label: 'Restaurants', comparison_parameter: 'total', comparison_number_percentage: null },
    ];
    this.cdr.detectChanges();
  });
  }

  
}
