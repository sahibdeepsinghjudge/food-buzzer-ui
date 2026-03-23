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
      password: ['', [Validators.required, Validators.minLength(6)]]
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
        if(response.userId!=null){
           this.isSubmitting.set(false);
          localStorage.setItem("userId",response.userId)
          localStorage.setItem("role",response.role)
          localStorage.setItem("access_level",response.accessLevel+"")
          localStorage.setItem("userEmail", email)
          console.log('Login successful', response);
          if (this.authService.isAdmin()) { 
            this.router.navigate(['/admin']); 
          }else{
            this.router.navigate(['/dashboard']); 
          }
        }else{
            this.isSubmitting.set(false);
            this.errorMessage = 'Invalid Credentials';
        }
       
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage = err.message || 'Login failed';
      }
    });
  }
}
