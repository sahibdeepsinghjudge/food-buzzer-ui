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
  accessLevelOptions = ['0', '1', '2', '3', '4', '5'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private teamsService: TeamsService
  ) {}

  ngOnInit() {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      accessLevel: ['1', Validators.required]
    });
  }

  saveChanges() {
    if (this.memberForm.invalid) return;

    this.isSaving.set(true);
    const formValues = this.memberForm.value;
    
    this.teamsService.addMember({
      name: formValues.name,
      email: formValues.email,
      accessLevel: parseInt(formValues.accessLevel, 10),
      status: 'Active'
    }).subscribe(() => {
      this.isSaving.set(false);
      this.router.navigate(['/team']);
    });
  }
}
