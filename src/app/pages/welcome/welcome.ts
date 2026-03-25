import { Component } from '@angular/core';
import { Button } from '../../ui/button/button';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [Button, RouterModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
    constructor(private auth:AuthService,private router:Router){
        if(this.auth.isAuthenticated()){
            if(this.auth.isAdmin()){
                this.router.navigate(['/admin']);
            }else{
                this.router.navigate(['/dashboard']);
            }
        }
    }
}
