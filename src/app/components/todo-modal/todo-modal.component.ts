import { Component, inject, signal, TemplateRef, WritableSignal } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TodoService } from '../../services/todo.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-todo-modal',
  standalone: false,
  templateUrl: './todo-modal.component.html',
  styleUrl: './todo-modal.component.css'
})
export class TodoModalComponent {
  protected todoSrv = inject(TodoService);
  protected modalService = inject(NgbModal);
  protected fb = inject(FormBuilder);

  protected refreshSubject = new BehaviorSubject<any>('');

  todoForm = this.fb.group({
    title: new FormControl<string | null>('', {validators: [Validators.required]}),
    dueDate: new FormControl<Date | null>(null)
  })

	closeResult: WritableSignal<string> = signal('');

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
	}

  closeModal(modal: any) {
    if (this.todoForm.valid) {
      const title = this.todoForm.value.title!;
      let dueDate = undefined;

      if (this.todoForm.value.dueDate) {
        dueDate = this.todoForm.value.dueDate!.toISOString().split('T')[0];
      }

      this.todoSrv.add(title, dueDate)
        .subscribe(() => {
          this.refreshSubject.next('');
          this.todoForm.reset();
          this.todoForm.markAsPristine();
          modal.close('Save click');
        });

    }
  }

  dismissModal(modal: any) {
    this.todoForm.reset();
    this.todoForm.markAsPristine();

    modal.dismiss('Cross click')
  }

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}
