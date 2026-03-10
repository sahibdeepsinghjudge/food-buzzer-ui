import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button } from '../../../ui/button/button';
import { SelectInput } from '../../../ui/select-input/select-input';
import { MatIconModule } from '@angular/material/icon';
import { TeamsService, TeamMember } from '../../../services/teams.service';

@Component({
  selector: 'app-team-member-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Button, SelectInput, MatIconModule],
  templateUrl: './team-member-details.html',
  styleUrls: ['./team-member-details.css']
})
export class TeamMemberDetails implements OnInit {
  memberId: number | null = null;
  member = signal<TeamMember | undefined>(undefined);
  memberForm!: FormGroup;
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  
  accessLevelOptions = ['0', '1', '2', '3', '4', '5'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private teamsService: TeamsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.memberId = +idParam;
        this.loadMember(this.memberId);
      }
    });
  }

  loadMember(id: number) {
    this.isLoading.set(true);
    this.teamsService.getMemberById(id).subscribe(data => {
      if (data) {
        this.member.set(data);
        this.initForm(data);
      } else {
        // Handle member not found by navigating back
        this.router.navigate(['/team']);
      }
      this.isLoading.set(false);
    });
  }

  initForm(member: TeamMember) {
    this.memberForm = this.fb.group({
      accessLevel: [member.accessLevel.toString(), Validators.required]
    });
  }

  toggleStatus() {
    const currentMember = this.member();
    if (!currentMember) return;
    
    this.isSaving.set(true);
    const newStatus = currentMember.status === 'Active' ? 'Inactive' : 'Active';
    
    this.teamsService.updateMember(currentMember.id, { status: newStatus }).subscribe(updatedMember => {
      this.member.set(updatedMember);
      this.isSaving.set(false);
    });
  }

  saveChanges() {
    const currentMember = this.member();
    if (this.memberForm.invalid || !currentMember) return;

    this.isSaving.set(true);
    const formValues = this.memberForm.value;
    
    const updates: Partial<TeamMember> = {
      accessLevel: parseInt(formValues.accessLevel, 10)
    };

    this.teamsService.updateMember(currentMember.id, updates).subscribe(updatedMember => {
      this.member.set(updatedMember);
      this.isSaving.set(false);
      this.router.navigate(['/team']); // Go back to teams list after saving
    });
  }
}
