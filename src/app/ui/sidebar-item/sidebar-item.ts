import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-item',
  imports: [RouterModule],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
  standalone: true,
})
export class SidebarItem  {
  @Input() text: string = '';
  @Input() link: string = '';
  @Input() icon: string = '';

}
