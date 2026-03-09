import {
  Component,
  Input,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-input.html',
  styleUrls: ['./select-input.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInput),
      multi: true,
    },
  ],
})
export class SelectInput implements ControlValueAccessor {

  @Input() label = '';
  @Input() type = 'text';
  @Input() name = 'name';
  @Input() id = 'name';
  @Input() placeholder = 'Enter your name';
  @Input() options: string[] = [];
  @Input() value: string = '';
  @Input() disabled = false;


  // Angular gives these
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  handleBlur() {
    this.onTouched();
  }
}