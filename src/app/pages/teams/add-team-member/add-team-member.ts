import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button } from '../../../ui/button/button';
import { SelectInput } from '../../../ui/select-input/select-input';
import { InputField } from '../../../ui/input-field/input-field';
import { MatIconModule } from '@angular/material/icon';
import { TeamsService, TeamMember } from '../../../services/teams.service';

@Component({
  selector: 'app-add-team-member',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Button, SelectInput, InputField, MatIconModule],
  templateUrl: './add-team-member.html',
  styleUrls: ['./add-team-member.css']
})
export class AddTeamMember implements OnInit {
  memberForm!: FormGroup;
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');
  roleOptions = ['staff', 'cashier', 'manager'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private teamsService: TeamsService
  ) {}

  ngOnInit() {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      role: ['staff', Validators.required]
    });
  }

  saveChanges() {
    if (this.memberForm.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set('');
    const formValues = this.memberForm.value;
    
    this.teamsService.addMember({
      fullName: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      password: formValues.password,
      role: formValues.role
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/team']);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.message || 'An unexpected error occurred.');
      }
    });
  }
}
