import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Button } from '../../../ui/button/button';
import { InputField } from '../../../ui/input-field/input-field';
import { AccountsContainer } from '../accounts-container/accounts-container';

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
  message: 'User registered successfully' | 'Details are valid';
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
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  currentStep = signal<1 | 2>(1);
  message = signal<Error | Success | null>(null);
  step1form;

  constructor(private fb: FormBuilder) {
    this.step1form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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
}