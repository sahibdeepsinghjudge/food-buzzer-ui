
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
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
  //@Input() checkDetails:number = 0;
  declineReason='';
  restaurantId!: number;
  restaurantData: Restaurant[]=[];
  restaurant: any;
  owner!: any;
  ownerData: Owner[]=[];
  ownerid:number=0;
  constructor(private route: ActivatedRoute, private router: Router, private dataService: Dataservice, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    ///this.restaurant = this.restaurants.find(r => r.id === this.restaurantId);
    this.dataService.getData().subscribe(data=>{
    this.restaurantData = data.restaurants.data;
    this.restaurant = this.restaurantData.find( r => r.id===this.restaurantId);
    this.ownerid=this.restaurant.ownerId;
    this.ownerData = data.owners.data;
    this.owner = this.ownerData.find(r => r.id===this.ownerid);
   
    console.log("Hello Owner");
    console.log(this.owner);
    console.log("Hello Restaurant");
    console.log(this.restaurant);
    this.cdr.detectChanges();
 });
    //this.restaurant = this.getRestaurantById(this.restaurantId);
  }

  
  /*getRestaurantById(id: number) {
    return this.restaurants.find(r => r.id === id);
  }*/

  updateStatus(id: number, status: string) {
    if(this.restaurant)
    {
      this.restaurant.status=status;
      /*this.dataService.updateRestaurantStatus(this.restaurant.id, 'Approved')
      .subscribe(() => {
        console.log('Status updated in backend');
        this.router.navigate(['/admin']);
      });*/

    }
    /*const restaurant = this.restaurants.find(r => r.id === id);
    //const restaurant = this.getRestaurantById(id);
    if (restaurant) {
      restaurant.status = status;
    }*/
  }
}