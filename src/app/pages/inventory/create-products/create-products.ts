import { Component } from '@angular/core';
import { InputField } from '../../../ui/input-field/input-field';
import { Button } from '../../../ui/button/button';
import { SelectInput } from '../../../ui/select-input/select-input';

@Component({
  selector: 'app-create-products',
  imports: [InputField, Button, SelectInput],
  templateUrl: './create-products.html',
  styleUrl: './create-products.css',
})
export class CreateProducts {
  units = [
    "g",
    "kg",
    "ml",
    "l",
    "piece",
    "dozen",
    "pack",
    "box",
    "case",
    "bottle",
    "can",
    "jar",
    "bag",
    "tray"
  ];
}