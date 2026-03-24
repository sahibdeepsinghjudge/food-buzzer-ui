import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuProductService, MenuProduct } from '../../../services/menu-product.service';
import { OrdersService, CartItemDTO, OrderRequest } from '../../../services/orders.service';
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
  imports: [CommonModule, FormsModule,Logo,ClockComponent,MatIcon],
  templateUrl: './pos-screen.html',
  styleUrls: ['./pos-screen.css']
})
export class PosScreen implements OnInit {
  products: MenuProduct[] = [];
  filteredProducts: MenuProduct[] = [];
  cart: CartItem[] = [];
  searchQuery = '';
  
  // Customer info
  customerName = '';
  customerPhone = '';
  customerEmail = '';
  tableId = '';
  discount = 0;

  isPlacingOrder = signal(false);
  orderSuccess = signal('');
  orderError = signal('');
  currentDateTime = signal('');

  constructor(
    private productService: MenuProductService,
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService : AuthService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products.filter(p => p.isLive !== false);
      this.filteredProducts = [...this.products];
      this.cdr.detectChanges();
      this.currentDateTime.set(new Date().toISOString())
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
    return (this.subtotal * this.discount) / 100;
  }

  get total(): number {
    return this.subtotal - this.discountAmount;
  }

  get canPlaceOrder(): boolean {
    return this.cart.length > 0 && this.customerName.trim() !== '' && this.customerPhone.trim() !== '';
  }

  clearCart() {
    this.cart = [];
    this.customerName = '';
    this.customerPhone = '';
    this.customerEmail = '';
    this.tableId = '';
    this.discount = 0;
    this.orderSuccess.set('');
    this.orderError.set('');
  }

  placeOrder() {
    if (!this.canPlaceOrder) return;

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

    const payload: OrderRequest = {
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail || undefined,
      tableId: this.tableId || undefined,
      cartItems,
      overrideDiscount: this.discount > 0 ? this.discount : undefined
    };

    this.ordersService.createOrder(payload).subscribe({
      next: (res) => {
        this.isPlacingOrder.set(false);
        this.orderSuccess.set(`Order #${res.orderId || ''} placed successfully!`);
        this.cart = [];
        this.customerName = '';
        this.customerPhone = '';
        this.customerEmail = '';
        this.tableId = '';
        this.discount = 0;
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
