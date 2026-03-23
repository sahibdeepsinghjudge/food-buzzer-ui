import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-kdsscreen',
  imports: [RouterModule, CommonModule],
  templateUrl: './kdsscreen.html',
  styleUrls: ['./kdsscreen.css'],
})
export class Kdsscreen {
  @Input() activeText: string = 'View All';
  @Input() activeLink: string = '';
  @Input() orderLength: number = 0;

  constructor(private authService: AuthService) {}

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

  logout() {
    this.authService.logout();
  }
}
