import { Component, signal } from '@angular/core';
import { InputField } from '../../../ui/input-field/input-field';
import { Button } from '../../../ui/button/button';
import { SelectInput } from '../../../ui/select-input/select-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../inventory-service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-products',
  standalone: true,
  imports: [InputField, Button, SelectInput, ReactiveFormsModule, MatIconModule],
  templateUrl: './create-products.html',
  styleUrls: ['./create-products.css'],
})
export class CreateProducts {
  productForm: FormGroup;
  isSaving = signal(false);
  errorMessage = signal('');

  units = [
    "g", "kg", "ml", "l", "piece", "dozen",
  ];

  categories = [
    "VEGETABLE", "MEAT", "DAIRY", "SPICE", "GRAIN", "BAKERY", "BEVERAGE", "OTHER"
  ];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: [''],
      category: ['OTHER', Validators.required],
      unit: ['kg', Validators.required],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [null],
      costPerUnit: [0, [Validators.min(0)]]
    });
  }

  saveProduct() {
    if (this.productForm.invalid) return;
    this.isSaving.set(true);
    this.errorMessage.set('');

    const data = this.productForm.value;
    
    this.inventoryService.addMaterial(data).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        console.error('Failed to add material', err);
        const errText = err.error?.message || err.message || 'Failed to add material';
        this.errorMessage.set(errText);
        this.isSaving.set(false);
      }
    });
  }
}