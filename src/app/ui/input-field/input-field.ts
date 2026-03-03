import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-input-field',
  imports: [],
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
})
export class InputField {
  @Input() placeholder = "Enter your name";
  @Input() type = "text";
  @Input() name = "name";
  @Input() id = "name";
  @Input() value = "";

} 
