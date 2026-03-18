import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { TableComponent } from '../../../ui/table/table';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-rejected-requests',
  imports: [TableComponent, TilesContainer, CommonModule],
  templateUrl: './rejected-requests.html',
  styleUrl: './rejected-requests.css',
})
export class RejectedRequests implements OnInit {
  checkRequestStatus="Declined";
  index: number=0;
  serialNo:number=0;
  tableColumns: any[]=[];
  tableData: any[]=[];
  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef){}
  ngOnInit(){
    this.adminService.getRequestsByStatus('declined').subscribe((data: any) => {
      const requestArray = data.requests || [];
      this.tableData = requestArray.map((r: any, index: number) => {
        return {
          serialNo: index+1,
          id: r.restaurantId,
          name: r.name,
          ownerName: r.ownerFullName || 'N/A',
          status: r.approvalStatus || 'Declined'
        }
      });
      this.tableColumns = [
        {key: 'serialNo', label: 'Id' },
        {key: 'name', label: 'Restaurant Name', type: 'link', routerLink: '/admin/restaurant-details'},
        {key: 'ownerName', label: 'Owner Name'},
        {key: 'status', label: 'Status'}
      ]
      this.dataTiles = [
        { number: data.declinedRequestsCount || requestArray.length, label: 'Rejected Requests' },
      ];
      this.cdr.detectChanges();
    });
  }
  dataTiles: any[] = [];
}
