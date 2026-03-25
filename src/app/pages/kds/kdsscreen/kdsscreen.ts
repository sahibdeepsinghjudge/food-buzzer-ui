import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { Logo } from '../../../ui/logo/logo';

@Component({
  selector: 'app-kdsscreen',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIcon,Logo],
  templateUrl: './kdsscreen.html',
  styleUrls: ['./kdsscreen.css'],
})
export class Kdsscreen {
  @Input() activeText: string = 'View All';
  @Input() activeLink: string = '/kds/view-all';
  @Input() orderLength: number = 0;

  navHeadItems = [
    { text: 'Pending', link: '/kds/pending-orders' },
    { text: 'Accepted', link: '/kds/accepted' },
    { text: 'Declined', link: '/kds/declined' }
  ];

  navFootItems = [
    { text: 'View All', link: '/kds/view-all' },
    { text: 'Cooking', link: '/kds/cooking' },
    { text: 'Prepared', link: '/kds/ready' },
    { text: 'Completed', link: '/kds/completed' },
  ];

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  isNotStaff(): boolean {
    return this.authService.accessLevel() > 0;
  }
}
