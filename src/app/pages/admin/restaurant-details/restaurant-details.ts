
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardLayout } from '../dashboard-layout/dashboard-layout';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [DashboardLayout, CommonModule],
  templateUrl: './restaurant-details.html',
  styleUrl: './restaurant-details.css',
})
export class RestaurantDetails {
  restaurantId!: number;
  restaurant: any;

  restaurants = [
    { id: 1, name: 'Spice Garden', email: 'spice@test.com', status: 'Pending', owner: 'Rahul Sharma', phone: '9876543210', address: 'MG Road, Pune' },
    { id: 2, name: 'Pizza House', email: 'pizza@test.com', status: 'Pending', owner: 'Amit Verma', phone: '9123456780', address: 'Baner, Pune' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    this.restaurant = this.restaurants.find(r => r.id === this.restaurantId);
  }

  approveRequest() {
    if (this.restaurant) {
      this.restaurant.status = 'Approved';
      this.router.navigate(['/admin']);
    }
  }

  declineRequest() {
    if (this.restaurant) {
      this.restaurant.status = 'Declined';
      this.router.navigate(['/admin']);
    }
  }
  getRestaurantById(id: number) {
    return this.restaurants.find(r => r.id === id);
  }

  updateStatus(id: number, status: string) {
    const restaurant = this.restaurants.find(r => r.id === id);
    if (restaurant) {
      restaurant.status = status;
    }
  }

}