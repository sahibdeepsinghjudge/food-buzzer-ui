
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Dataservice } from '../../../dataservice';
import { Restaurant } from '../../interface/restaurant';
import { Owner } from '../../interface/owner';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../ui/button/button';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [CommonModule, Button, FormsModule],
  templateUrl: './restaurant-details.html',
  styleUrl: './restaurant-details.css',
})
export class RestaurantDetails implements OnInit{
  checkRequestStatus:string = '';
  approvalNotes = '';
  restaurantId!: number;
  restaurantData: any[]=[];
  restaurant: any;
  owner!: any;
  ownerDetails: any = null;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private dataService: Dataservice, 
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));

    this.adminService.getRequestsByStatus().subscribe((data: any) => {
      this.restaurantData = data.requests || [];
      const found = this.restaurantData.find((r: any) => r.restaurantId === this.restaurantId);
      if (found) {
        this.restaurant = found;
        this.owner = { name: found.ownerFullName || 'N/A' };
        
        if(this.restaurant.approvalStatus === "PENDING" || this.restaurant.approvalStatus === "pending")
        {
          this.checkRequestStatus = "pending";
        }

        // Fetch richer owner/user details
        if (found.ownerUserId) {
          this.adminService.getRestaurantByUserId(found.ownerUserId).subscribe((ownerData: any) => {
            this.ownerDetails = ownerData;
            this.cdr.detectChanges();
          });
        }
      }
      this.cdr.detectChanges();
    });
  }

  
  /*getRestaurantById(id: number) {
    return this.restaurants.find(r => r.id === id);
  }*/

  updateStatus(id: number, status: string) {
    if(this.restaurant)
    {
      const isApproved = status.toLowerCase() === 'approved';
      this.adminService.updateApproval({
        restaurantId: id,
        isApproved: isApproved,
        approvalNotes: this.approvalNotes || (isApproved ? 'Approved' : 'Declined')
      }).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Approval update failed:', err);
        }
      });
    }
  }
}