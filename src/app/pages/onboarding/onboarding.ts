import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../../ui/button/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, RouterModule, Button, MatIconModule],
  templateUrl: './onboarding.html',
  styleUrls: ['./onboarding.css'],
})
export class Onboarding {
  features = [
    {
      icon: 'group',
      title: 'Setup Teams',
      description: 'Invite members and organize your staff into tailored team groups.'
    },
    {
      icon: 'inventory',
      title: 'Manage Inventory',
      description: 'Track incoming raw materials and manage stock levels easily.'
    },
    {
      icon: 'explore',
      title: 'Explore the Software',
      description: 'Look around the dashboard while you wait to see how everything connects.'
    }
  ];
}
