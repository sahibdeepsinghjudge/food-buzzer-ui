import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from '../../../ui/button/button';
import { InputField } from '../../../ui/input-field/input-field';
import { AccountsContainer } from '../accounts-container/accounts-container';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

interface Error {
  code: 403 | 404 | 500 | 422;
  message:
    | 'Invalid credentials'
    | 'User not found'
    | 'Internal server error'
    | 'Unprocessable entity';
}

interface Success {
  code: 200;
  message: 'User registered successfully' | 'Details are valid' | 'Redirecting to onboarding...';
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Button,
    InputField,
    AccountsContainer,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  currentStep = signal<1 | 2 | 3>(1);
  message = signal<Error | Success | null>(null);
  step1form;
  step2form;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.step1form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.step2form = this.fb.nonNullable.group({
      rest_name: ['', Validators.required],
      rest_address: ['', Validators.required],
      gst_number: ['', Validators.required],
      phone_number: ['', Validators.required],
    });
  }


  goBack() {
    if (this.currentStep() == 1) {
      this.currentStep.set(1);
    } else {
      const x = this.currentStep() - 1;
      this.currentStep.set(x as 1 | 2);
    }
    return;
  }

  validateFirstStep() {
    if (this.step1form.invalid) {
      this.step1form.markAllAsTouched();
      this.message.set({
        code: 422,
        message: 'Unprocessable entity',
      });

      return;
    }

    this.currentStep.set(2);

    this.message.set({
      code: 200,
      message: 'Details are valid',
    });

    console.log('Form Data:', this.step1form.getRawValue());
  }

  validateSecondStep() {
    if (this.step2form.invalid) {
      this.step2form.markAllAsTouched();
      this.message.set({
        code: 422,
        message: 'Unprocessable entity',
      });

      return;
    }

    this.isSubmitting.set(true);
    const step1Data = this.step1form.getRawValue();
    const step2Data = this.step2form.getRawValue();

    this.authService.register(step1Data, step2Data).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.message.set({
          code: 200,
          message: 'Redirecting to onboarding...',
        });
        this.router.navigate(['/onboarding']);
        console.log('Registration successful:', response);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.message.set({
          code: 500,
          message: 'Internal server error',
        });
        console.error('Registration error:', err);
      }
    });
  }

 
}