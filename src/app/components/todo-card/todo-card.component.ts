import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../services/todo.type';

@Component({
  selector: 'app-todo-card',
  standalone: false,
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoCardComponent {
  @Input({ required: true })
  todo!: Todo;
  @Input({ required: true })
  completed!: boolean;

  @Output('completeChange')
  onCompleteChange = new EventEmitter<boolean>();

  completeChange(complete: boolean) {
    this.onCompleteChange.emit(complete);
  }
}
