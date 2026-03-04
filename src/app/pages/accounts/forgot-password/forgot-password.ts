import { Component } from '@angular/core';
import { AccountsContainer } from '../accounts-container/accounts-container';
import { InputField } from '../../../ui/input-field/input-field';
import { Button } from '../../../ui/button/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [AccountsContainer, InputField,Button, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

}
