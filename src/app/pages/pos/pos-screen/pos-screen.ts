import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuProductService, MenuProduct } from '../../../services/menu-product.service';
import { OrdersService, CartItemDTO, OrderRequest } from '../../../services/orders.service';
import { Tableservice, TableData } from '../../../services/table.service';
import { Logo } from '../../../ui/logo/logo';
import { AuthService } from '../../../services/auth.service';
import { ClockComponent } from '../../../ui/clock-component/clock-component';
import { MatIcon } from '@angular/material/icon';

interface CartItem {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

@Component({
  selector: 'app-pos-screen',
  // standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Logo, ClockComponent, MatIcon],
  templateUrl: './pos-screen.html',
  styleUrls: ['./pos-screen.css']
})
export class PosScreen implements OnInit {
  products: MenuProduct[] = [];
  filteredProducts: MenuProduct[] = [];
  cart: CartItem[] = [];
  tables: TableData[] = [];
  searchQuery = '';
  
  // Checkout Form
  checkoutForm: FormGroup;

  isPlacingOrder = signal(false);
  orderSuccess = signal('');
  orderError = signal('');
  currentDateTime = signal('');

  constructor(
    private fb: FormBuilder,
    private productService: MenuProductService,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private tableService: Tableservice
  ) {
    this.checkoutForm = this.fb.group({
      customerName: ['', [Validators.required]],
      customerPhone: ['', [Validators.required]],
      tableId: [''],
      discount: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products.filter(p => p.isLive !== false);
      this.filteredProducts = [...this.products];
      this.cdr.detectChanges();
      this.currentDateTime.set(new Date().toISOString());
    });
    
    this.tableService.getTableStatus().subscribe({
      next: (data) => {
        this.tables = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to fetch tables:', err)
    });
  }

  filterProducts() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }
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
        unitPrice: product.price,
        quantity: 1,
        totalPrice: product.price
      });
    }
  }

  increaseQty(item: CartItem) {
    item.quantity++;
    item.totalPrice = item.quantity * item.unitPrice;
  }

  decreaseQty(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
    } else {
      this.removeFromCart(item);
    }
  }

  removeFromCart(item: CartItem) {
    this.cart = this.cart.filter(c => c.productId !== item.productId);
  }

  get subtotal(): number {
    return this.cart.reduce((sum, i) => sum + i.totalPrice, 0);
  }

  get discountAmount(): number {
    const discount = this.checkoutForm.value.discount || 0;
    return (this.subtotal * discount) / 100;
  }

  get total(): number {
    return this.subtotal - this.discountAmount;
  }

  get discountValue(): number {
    return this.checkoutForm.value.discount || 0;
  }

  clearCart() {
    this.cart = [];
    this.checkoutForm.reset({ discount: 0 });
    this.orderSuccess.set('');
    this.orderError.set('');
  }

  placeOrder() {
    if (this.cart.length === 0) {
      this.orderError.set('Cart is empty. Please add items to place an order.');
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isPlacingOrder.set(true);
    this.orderError.set('');
    this.orderSuccess.set('');

    const cartItems: CartItemDTO[] = this.cart.map(c => ({
      productId: c.productId,
      name: c.name,
      quantity: c.quantity,
      unitPrice: c.unitPrice,
      totalPrice: c.totalPrice
    }));

    const formVal = this.checkoutForm.value;

    const payload: OrderRequest = {
      customerName: formVal.customerName,
      customerPhone: formVal.customerPhone,
      tableId: formVal.tableId || undefined,
      cartItems,
      overrideDiscount: formVal.discount > 0 ? formVal.discount : undefined
    };

    this.ordersService.createOrder(payload).subscribe({
      next: (res) => {
        this.isPlacingOrder.set(false);
        this.orderSuccess.set(`Order #${res.orderId || ''} placed successfully!`);
        this.cart = [];
        this.checkoutForm.reset({ discount: 0 });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isPlacingOrder.set(false);
        this.orderError.set(err?.error?.message || 'Failed to place order');
        this.cdr.detectChanges();
      }
    });
  }
}
