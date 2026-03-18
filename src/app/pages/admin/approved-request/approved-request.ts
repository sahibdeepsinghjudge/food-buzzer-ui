import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { TableComponent } from '../../../ui/table/table';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-approved-request',
  imports: [TableComponent, TilesContainer, CommonModule],
  templateUrl: './approved-request.html',
  styleUrl: './approved-request.css',
})
export class ApprovedRequest implements OnInit{
  checkRequestStatus = "Approved"; //1 means request not pending
  index: number=0;
  serialNo:number=0;
  tableData: any[]=[]
  tableColumns: any[]=[]

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef){}
  ngOnInit(){
    this.adminService.getRequestsByStatus('approved').subscribe((data: any) => {
      const requestArray = data.requests || [];
      this.tableData = requestArray.map((r: any, index: number) => {
        return {
          serialNo: index+1,
          id: r.restaurantId,
          name: r.name,
          ownerName: r.ownerFullName || 'N/A',
          status: r.approvalStatus || 'Approved'
        }
      });
      this.tableColumns = [
      { key: 'serialNo', label: 'Id' },
      { key: 'name', label: 'Restaurant Name', type: "link", routerLink: "/admin/restaurant-details" },
      { key: 'ownerName', label: 'Owner Name' },
      { key: 'status', label: 'Status'}
    ];
    this.dataTiles = [
      { number: data.approvedRequestsCount || requestArray.length, label: 'Approved Requests' },
    ];
    this.cdr.detectChanges();
   });
  }
  dataTiles: any[] = [];
}
