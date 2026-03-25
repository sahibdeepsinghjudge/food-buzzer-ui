import { ChangeDetectorRef, Component } from '@angular/core';
import { RestaurantData, SettingsService } from '../../../services/settings.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../ui/button/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-update-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, MatIconModule],
  templateUrl: './update-details.html',
  styleUrl: './update-details.css',
})
export class UpdateDetails {
  settingsForm!: FormGroup;
  isLoading = true;
  isUpdatingDetails = false;
  approvalStatus: string = '';
  approvalNote: string = '';
  newPasswordChange: any;
  changePass: any;
  isOwner: boolean = false;

  constructor(private fb: FormBuilder, private serviceData: SettingsService, private cdr: ChangeDetectorRef, private authService: AuthService){
    this.isOwner = this.authService.isOwner();

    this.settingsForm = this.fb.group({
      ownerName: [''],
      ownerEmail: ['', [Validators.required, Validators.email]],
      restaurantName: ['', [Validators.minLength(3)]],
      phone: ['', [Validators.pattern('^[6-9][0-9]{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      location: [''],
      zipcode: [''],
      password: [''],
      newpassword: [''],
      confirmpassword: ['']
    })
}

  ngOnInit(){
    forkJoin({
      user: this.serviceData.getUserProfile(),
      restaurant: this.serviceData.getRestaurantInfo()
    }).subscribe({
      next: (res) => {
        const userData = res.user.data || res.user;
        console.log(userData);
        const restaurantData = res.restaurant.data || res.restaurant;
        
        this.approvalStatus = restaurantData.approvalStatus || 'PENDING';
        this.approvalNote = restaurantData.approvalNote || '';

        this.settingsForm.patchValue({
          ownerName: userData.fullName || '', // Backend typically omits FullName on standard profile
          ownerEmail: userData.email || '',
          restaurantName: restaurantData.name || '',
          phone: restaurantData.phone || '',
          email: userData.email || '',
          restEmail: restaurantData.email || '',
          location: restaurantData.address || '',
          zipcode: restaurantData.zipcode || '',
          password: ''
        });
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load settings data', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  changePassword(){
    const newPass = this.settingsForm.get("newpassword")?.value;
    const confirmPass = this.settingsForm.get("confirmpassword")?.value;
    const pass = this.settingsForm.get("password")?.value;
    
    // Clear initial flags
    this.newPasswordChange = true;
    this.changePass = true;

    if (!pass) {
      this.changePass = false;
      return;
    }

    if (newPass !== confirmPass || !newPass) {
      this.newPasswordChange = false;
      return;
    }
    
    // Fire the PUT API
    this.serviceData.updatePassword(pass, newPass).subscribe({
      next: (res) => {
        alert("Password updated successfully!");
        this.settingsForm.patchValue({
          password: '',
          newpassword: '',
          confirmpassword: ''
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to update password:", err);
        // Invalid old password or backend error
        this.changePass = false; 
        this.cdr.detectChanges();
      }
    });
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      this.isUpdatingDetails = true;
      const finalData = this.settingsForm.value;
      
      const payload = {
        name: finalData.restaurantName,
        phone: finalData.phone,
        email: finalData.email,
        address: finalData.location,
        zipcode: finalData.zipcode
      };

      this.serviceData.updateRestaurantInfo(payload).subscribe({
        next: (res) => {
          this.isUpdatingDetails = false;
          alert("Restaurant details updated successfully!");
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to update restaurant:', err);
          alert("Failed to update restaurant details. Please try again.");
          this.isUpdatingDetails = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.error('Form is invalid. Please check the errors.');
    }
  }
}
