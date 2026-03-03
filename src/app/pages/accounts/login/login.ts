import { Component } from '@angular/core';
import { AccountsContainer } from '../accounts-container/accounts-container';
import { RouterModule } from '@angular/router';
import { InputField } from '../../../ui/input-field/input-field';
import { Button } from '../../../ui/button/button';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [AccountsContainer, RouterModule, InputField, Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  title = 'Login';

}
