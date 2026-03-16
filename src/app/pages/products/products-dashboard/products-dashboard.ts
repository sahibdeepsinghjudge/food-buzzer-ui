import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../ui/input-field/input-field';
import { Button } from '../../../ui/button/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuProductService, MenuProduct } from '../../../services/menu-product.service';

@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputField, MatIconModule, Button],
  templateUrl: './products-dashboard.html',
  styleUrl: './products-dashboard.css',
})
export class ProductsDashboard implements OnInit {
  products = signal<MenuProduct[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);
  isDeleting = signal<number | null>(null);

  filteredProducts = computed(() => {
    const query = this.searchQuery();
    const allProducts = this.products();
    
    if (!query) {
      return allProducts;
    }

    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query)
    );
  });

  constructor(private menuProductService: MenuProductService, private router: Router) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.menuProductService.getProducts().subscribe(data => {
      this.products.set(data);
      this.isLoading.set(false);
    });
  }

  onSearch(query: string) {
    this.searchQuery.set(query.toLowerCase());
  }

  editProduct(id: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/products/edit-product', id]);
  }

  deleteProduct(id: number, name: string, event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      this.isDeleting.set(id);
      this.menuProductService.deleteProduct(id).subscribe(success => {
        if (success) {
          this.fetchProducts(); // Refresh list
        }
        this.isDeleting.set(null);
      });
    }
  }
}
