import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject, map, combineLatest, switchMap, Observable, merge, skip } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../services/todo.type';

@Component({
  selector: 'app-todo-container',
  standalone: false,
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.css'
})
export class TodoContainerComponent {
  protected todoSrv = inject(TodoService);
  protected checkSubject = new BehaviorSubject<boolean>(false);
  protected refreshSubject = new BehaviorSubject<any>('');

  todos$ = combineLatest([
    this.refreshSubject,
    this.checkSubject,
  ]).pipe(
    switchMap(([_, checkValue]) => {
      return this.todoSrv.list(checkValue);
    }),
  );

  setCheckValue(value: boolean) {
    this.checkSubject.next(value);
  }

  todoCheckComplete(todo: Todo, check: boolean) {
    this.todoSrv.check(todo.id, check)
      .subscribe(() => this.refreshSubject.next(''));
  }

  // Modal and form
  protected fb = inject(FormBuilder);
  protected modalService = inject(NgbModal);

  todoForm = this.fb.group({
    title: new FormControl<string | null>('', {validators: [Validators.required]}),
    dueDate: new FormControl<Date | null>(null)
  });

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
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
    } else {
      this.todoForm.markAllAsTouched();
    }
  }

  dismissModal(modal: any) {
    this.todoForm.reset();
    this.todoForm.markAsPristine();
    modal.dismiss('Cross click')
  }

}
