import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: false,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent {
  @Input({ required: true})
  checkboxName!: string;

  @Input({ required: true})
  text!: string;

  @Input({ required: true })
  value!: boolean;

  @Output('checkboxChange')
  onCheckboxChange = new EventEmitter<boolean>();


  checkboxChange(val: boolean) {
    this.onCheckboxChange.emit(val);
  }
  
}
