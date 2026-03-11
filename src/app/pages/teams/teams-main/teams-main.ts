import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../ui/input-field/input-field';
import { TableComponent, TableColumn } from '../../../ui/table/table';
import { Button } from '../../../ui/button/button';
import { TeamsService, TeamMember } from '../../../services/teams.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-teams-main',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputField, TableComponent, MatIconModule, Button],
  templateUrl: './teams-main.html',
  styleUrls: ['./teams-main.css']
})
export class TeamsMain implements OnInit {
  members = signal<TeamMember[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);

  filteredMembers = computed(() => {
    const query = this.searchQuery();
    const allMembers = this.members();
    
    if (!query) {
      return allMembers;
    }

    return allMembers.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.email.toLowerCase().includes(query)
    );
  });

  columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'accessLevel', label: 'Access Level' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      type: 'button',
      buttonText: 'View',
      onClick: (row: any) => this.viewMember(row.id)
    }
  ];

  constructor(private teamsService: TeamsService, private router: Router) {}

  ngOnInit() {
    this.teamsService.getMembers().subscribe(data => {
      this.members.set(data);
      this.isLoading.set(false);
    });
  }

  onSearch(query: string) {
    this.searchQuery.set(query.toLowerCase());
  }

  viewMember(id: number) {
    this.router.navigate(['/team', id]);
  }
}
