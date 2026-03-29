import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './customers.html',
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  filteredCustomers = signal<Customer[]>([]);
  isLoading = signal(true);
  searchQuery = '';

  selectedCustomer: Customer | null = null;
  isLoadingDetail = false;

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.filteredCustomers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load customers', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(query: string) {
    this.searchQuery = query.toLowerCase();
    this.filteredCustomers.set(this.customers().filter(c =>
      c.name.toLowerCase().includes(this.searchQuery) ||
      c.phone.includes(this.searchQuery)
    ));
  }

  openCustomer(customer: Customer) {
    this.selectedCustomer = customer;
  }

  closeDetail() {
    this.selectedCustomer = null;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}
