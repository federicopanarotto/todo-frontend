import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-todo-modal',
  standalone: false ,
  templateUrl: './todo-modal.component.html',
  styleUrl: './todo-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoModalComponent {
  protected todoSrv = inject(TodoService);
  protected fb = inject(FormBuilder);
  protected modalService = inject(NgbModal);

  modal = inject(NgbActiveModal);

  todoForm = this.fb.group({
    title: new FormControl<string | null>('', {validators: [Validators.required]}),
    dueDate: new FormControl<Date | null>(null)
  });

  closeModal() {
    if (this.todoForm.valid) {
      this.modal.close(this.todoForm.value);
      this.todoForm.reset();
      this.todoForm.markAsPristine();
    } else {
      this.todoForm.markAllAsTouched();
    }
  }

  dismissModal() {
    this.todoForm.reset();
    this.todoForm.markAsPristine();
    this.modal.dismiss()
  }
}
