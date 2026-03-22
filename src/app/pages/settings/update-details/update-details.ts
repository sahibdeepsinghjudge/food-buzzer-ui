import { ChangeDetectorRef, Component } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../ui/button/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-update-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, MatIconModule],
  templateUrl: './update-details.html',
  styleUrl: './update-details.css',
})
export class UpdateDetails {
  settingsForm!: FormGroup;
  isLoading = true;
  settingsdata: any;
  constructor(private fb: FormBuilder, private serviceData: SettingsService, private cdr: ChangeDetectorRef){

  this.settingsForm = this.fb.group({
      restaurantName: ['', [Validators.minLength(3)]],
      phone: ['', [Validators.pattern('^[6-9][0-9]{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      location: [''],
      zipcode: [''],
      cuisine: [''],      
      openingTime: [''],      
      closeingTime: [''],      
  })
}

  id: number=1;
  ngOnInit(){
    this.serviceData.getData(this.id).subscribe(data=>{
      this.settingsdata = data.restaurantdata;
      console.log(this.settingsdata);
      const record = this.settingsdata[0];
      if (record) {
          this.settingsForm.patchValue({
            restaurantName: record.name,
            phone: record.phone,
            email: record.email,
            location: record.location,
            zipcode: record.zipcode,
            cuisine: record.cuisine,
            openingTime: record.openingTime,
            closeingTime: record.closingTime
          });
        }
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      const finalData = this.settingsForm.value;
      console.log('Sending to API:', finalData);
          } 
    else {
      console.error('Form is invalid. Please check the errors.');
    }
  }
}
