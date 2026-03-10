import { Component, signal } from '@angular/core';
import { AccountsContainer } from '../accounts-container/accounts-container';
import { Router, RouterModule } from '@angular/router';
import { InputField } from '../../../ui/input-field/input-field';
import { Button } from '../../../ui/button/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [CommonModule, AccountsContainer, RouterModule, InputField, Button, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  title = 'Login';
  loginForm;
  errorMessage = '';
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        console.log('Login successful', response);
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage = err.message || 'Login failed';
      }
    });
  }
}
