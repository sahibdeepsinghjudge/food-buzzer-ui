import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../ui/button/button';
import { InputField } from '../../../ui/input-field/input-field';
import { SelectInput } from '../../../ui/select-input/select-input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InventoryService, RawMaterial } from '../inventory-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [Button, InputField, SelectInput, MatIconModule, RouterModule, ReactiveFormsModule],
  templateUrl: './view-product.html',
  styleUrls: ['./view-product.css'],
})
export class ViewProduct {
  productForm: FormGroup;
  isSaving = signal(false);

  units = [
    "g", "kg", "ml", "l", "piece", "dozen",
    "pack", "box", "case", "bottle", "can",
    "jar", "bag", "tray"
  ];
  
  productId!: number;
  product = signal<RawMaterial | null>(null);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService
  ) { 
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      unit: ['', Validators.required],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [null],
      costPerUnit: [0, [Validators.min(0)]],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.inventoryService.getMaterialById(this.productId).subscribe(product => {
      if (product) {
        this.product.set(product);
        this.productForm.patchValue({
          name: product.name,
          unit: product.unit,
          currentStock: product.currentStock,
          reorderLevel: product.reorderLevel,
          costPerUnit: product.costPerUnit,
          isActive: product.isActive
        });
      }
    });
  }

  updateProduct() {
    if (this.productForm.invalid) return;
    this.isSaving.set(true);
    const data = this.productForm.value;
    
    // We update stock and basic info
    this.inventoryService.updateStock(this.productId, data).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        console.error('Failed to update material', err);
        this.isSaving.set(false);
      }
    });
  }

  deleteProduct() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.inventoryService.deleteMaterial(this.productId).subscribe({
        next: () => {
          this.router.navigate(['/inventory']);
        },
        error: (err) => console.error('Failed to delete', err)
      });
    }
  }
}
