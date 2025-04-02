import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../../services/todo.type';

@Component({
  selector: 'app-todo-card',
  standalone: false,
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.css'
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
