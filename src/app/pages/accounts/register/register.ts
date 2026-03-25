import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from '../../../ui/button/button';
import { InputField } from '../../../ui/input-field/input-field';
import { AccountsContainer } from '../accounts-container/accounts-container';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { Logo } from '../../../ui/logo/logo';

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
  message: 'User registered successfully' | 'Details are valid' | 'Redirecting to onboarding...' | 'Account created';
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
    Logo
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  currentStep = signal<1 | 2 | 3>(1);
  message = signal<Error | Success | any>(null);
  step1form;
  step2form;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.step1form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.step2form = this.fb.nonNullable.group({
      rest_name: ['', Validators.required],
      rest_address: ['', Validators.required],
      gst_number: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(?!0|91|123)[1-9][0-9]{9}$/)]],
      zip_code: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }


  // goBack() {
  //   if (this.currentStep() == 1) {
  //     this.currentStep.set(1);
  //   } else {
  //     const x = this.currentStep() - 1;
  //     this.currentStep.set(x as 1 | 2);
  //   }
  //   return;
  // }

  validateFirstStep() {
    if (this.step1form.invalid) {
      this.step1form.markAllAsTouched();
      this.message.set({
        code: 422,
        message: 'Unprocessable entity',
      });

      return false;
    }
    this.message.set({
      code: 200,
      message: 'Details are valid',
    });
    return true;
    // console.log('Form Data:', this.step1form.getRawValue());
  }

  validateSecondStep() {
    if (this.step2form.invalid) {
      this.step2form.markAllAsTouched();
      this.message.set({
        code: 422,
        message: 'Unprocessable entity',
      });

      return false;
    }
    return true;
  }

  submitForm1() {

    this.isSubmitting.set(true);
    const step1Data = this.step1form.getRawValue();

    this.authService.registerStepData1(step1Data).subscribe({
      next: (response) => {
        if (response.userId != null) {
          this.isSubmitting.set(false);
          this.message.set({
            code: 200,
            message: 'Account created',
          });
          localStorage.setItem("userId",response.userId)
          localStorage.setItem("role", response.role)
          localStorage.setItem("userEmail",step1Data.email)
          localStorage.setItem("access_level",response.accessLevel+"")
          this.currentStep.set(2);
          console.log('Registration successful:', response);
        } else {
          this.isSubmitting.set(false);
          this.message.set({
            code: 401,
            message: response.message,
          });
        }

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

  submitForm2() {
    if (this.validateSecondStep()) {
      this.isSubmitting.set(true);

      const step2Data = this.step2form.getRawValue();

      this.authService.registerStepData2(step2Data).subscribe({
        next: (response) => {
          if (response.restaurantId != null) {
            this.isSubmitting.set(false);
            this.message.set({
              code: 200,
              message: 'Redirecting to onboarding...',
            });
            this.router.navigate(["/onboarding"]);
            console.log('Registration successful:', response);
          } else {
            this.isSubmitting.set(false);
            this.message.set({
              code: 500,
              message: 'Internal server error',
            });
          }

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
    this.isSubmitting.set(false);
  }


}