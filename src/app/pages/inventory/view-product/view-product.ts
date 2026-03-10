import { Component, signal } from '@angular/core';
import { Button } from '../../../ui/button/button';
import { InputField } from '../../../ui/input-field/input-field';
import { SelectInput } from '../../../ui/select-input/select-input';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService, RawMaterial } from '../inventory-service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-product',
  imports: [Button,InputField,SelectInput,MatIconModule,RouterModule],
  templateUrl: './view-product.html',
  styleUrl: './view-product.css',
})
export class ViewProduct {
  units = [
    "g",
    "kg",
    "ml",
    "l",
    "piece",
    "dozen",
    "pack",
    "box",
    "case",
    "bottle",
    "can",
    "jar",
    "bag",
    "tray"
  ];
  productId!: number;
  product = signal<RawMaterial | null>(null);
  constructor(private route: ActivatedRoute, private router: Router, private inventoryService: InventoryService) { }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.inventoryService.getMaterialById(this.productId).subscribe(product => {
      if (product) {
        this.product.set(product);
      }
    });
  }
}
