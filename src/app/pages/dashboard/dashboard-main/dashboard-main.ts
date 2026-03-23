import { Component, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-main',
  imports: [],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css',
})
export class DashboardMain {
  title = 'Dashboard';
  user= signal<string>("");
  constructor(private authService: AuthService) { }
  ngOnInit(){
    this.user.set(this.authService.getUserEmail());
  }
}
