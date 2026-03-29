import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuProductService, MenuProduct } from '../../services/menu-product.service';
import { OrdersService, CartItemDTO, OrderRequest } from '../../services/orders.service';
import { Tableservice, TableData } from '../../services/table.service';

@Component({
  selector: 'app-public-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './public-menu.html',
})
export class PublicMenuComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private menuService = inject(MenuProductService);
  private ordersService = inject(OrdersService);
  private tableService = inject(Tableservice);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  slug: string = '';
  restaurantName: string = 'FoodBuzzer';
  restaurantAddress: string = "Pune";
  restaurantId: number | null = null;
  products: MenuProduct[] = [];
  filteredProducts: MenuProduct[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  searchQuery: string = '';

  tables: TableData[] = [];
  cart: CartItemDTO[] = [];

  customerForm!: FormGroup;
  isDetailsSubmitted = signal(false);
  orderPlaced = signal(false);
  showSuccessModal = signal(false);
  isSubmitting = signal(false);

  get cartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  get cartItemCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      tableId: ['']
    });

    this.loadData();
  }

  loadData() {
    if (this.slug) {
      this.menuService.getPublicMenuByRestaurantSlug(this.slug).subscribe({
        next: (res) => {
          this.restaurantName = res.restaurant?.name || 'FoodBuzzer';
          this.restaurantId = res.restaurant?.id || null;
          this.products = res.products || [];
          this.extractCategories();
          this.applyFilters();
        },
        error: (err) => console.error('Failed to load menu for slug', err)
      });
    }

    this.tableService.getTablesBySlug(this.slug).subscribe({
      next: (res) => {
        this.tables = res || [];
      },
      error: (err) => console.error('Failed to load tables', err)
    });
  }

  extractCategories() {
    const cats = new Set(this.products.map(p => p.category).filter(c => !!c));
    this.categories = ['All', ...Array.from(cats)] as string[];
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    let temp = this.products;
    if (this.selectedCategory !== 'All') {
      temp = temp.filter(p => p.category === this.selectedCategory);
    }
    if (this.searchQuery) {
      temp = temp.filter(p => p.name.toLowerCase().includes(this.searchQuery));
    }
    this.filteredProducts = temp;
  }

  addToCart(product: MenuProduct) {
    const existing = this.cart.find(c => c.productId === product.id);
    if (existing) {
      existing.quantity++;
      existing.totalPrice = existing.quantity * existing.unitPrice;
    } else {
      this.cart.push({
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price
      });
    }
  }

  removeFromCart(productId: number) {
    const existing = this.cart.find(c => c.productId === productId);
    if (existing) {
      if (existing.quantity > 1) {
        existing.quantity--;
        existing.totalPrice = existing.quantity * existing.unitPrice;
      } else {
        this.cart = this.cart.filter(c => c.productId !== productId);
      }
    }
  }

  getCartQuantity(productId: number): number {
    const item = this.cart.find(c => c.productId === productId);
    return item ? item.quantity : 0;
  }

  placeOrder() {
    if (this.customerForm.invalid || this.cart.length === 0) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValues = this.customerForm.value;
    const request: OrderRequest = {
      customerName: formValues.customerName,
      customerPhone: formValues.customerPhone,
      tableId: formValues.tableId,
      cartItems: this.cart,
      restaurantId: this.restaurantId || undefined,
      restaurantSlug: this.slug
    };

    this.isSubmitting.set(true);
    this.ordersService.createOrder(request).subscribe({
      next: (res) => {
        console.log(res)
        this.showSuccessModal.set(true);
        this.cart = [];
        this.isSubmitting.set(false);
        // Auto-dismiss modal after 4 seconds
        setTimeout(() => {
          this.showSuccessModal.set(false);
        }, 4000);
        window.scrollTo(0, 0);
      },
      error: (err) => {
        console.error('Failed to place order', err);
        alert('Failed to place order. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }

  continueToMenu() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    this.isDetailsSubmitted.set(true);
    window.scrollTo(0, 0);
  }

  editDetails() {
    this.isDetailsSubmitted.set(false);
    window.scrollTo(0, 0);
  }

  startNewOrder() {
    this.customerForm.reset();
    this.orderPlaced.set(false);
    this.isDetailsSubmitted.set(false);
    this.cart = [];
  }
}
