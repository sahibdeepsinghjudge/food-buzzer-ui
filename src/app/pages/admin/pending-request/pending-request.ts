import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { TableComponent } from '../../../ui/table/table';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-pending-request',
  imports: [TilesContainer, TableComponent, CommonModule],
  templateUrl: './pending-request.html',
  styleUrl: './pending-request.css',
})
export class PendingRequest implements OnInit {
  checkRequestStatus: string='pending';//for pending request
  index: number=0;
  serialNo:number=0;
  tableData: any[]=[];
  tableColumns: any[]=[];

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef){}
  ngOnInit(){
    this.adminService.getRequestsByStatus('pending').subscribe((data: any) => {
      const requestArray = data.requests || [];
      this.tableData = requestArray.map((r: any, index: number) => {
        return {
          serialNo: index+1,
          id: r.restaurantId,
          name: r.name,
          ownerName: r.ownerFullName || 'N/A',
          status: r.approvalStatus || 'pending'
        }
      });
      this.tableColumns=[
        { key: 'serialNo', label: 'Id' },
        { key: 'name', label: 'Restaurant Name', type: "link", routerLink: "/admin/restaurant-details" },
        { key: 'ownerName', label: 'Owner Name' },
        { key: 'status', label: 'Status'}
      ];
      this.dataTiles = [
        { number: data.pendingRequestsCount || requestArray.length, label: 'Pending Requests' },
      ];
      this.cdr.detectChanges();
    });
  }
  dataTiles: any[] = [];
}
