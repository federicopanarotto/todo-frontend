import { Component, inject, signal, TemplateRef, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject, map, combineLatest, takeUntil, debounceTime, switchMap, tap, Observable, of, filter, concatMap, startWith, catchError } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../services/todo.type';

@Component({
  selector: 'app-todo-container',
  standalone: false,
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.css'
})
export class TodoContainerComponent {
  protected fb = inject(FormBuilder);
  protected todoSrv = inject(TodoService);
  protected checkSubject = new BehaviorSubject<boolean>(false);
  protected refreshSubject = new BehaviorSubject<any>('');
  protected destroyer$ = new Subject<void>();

  protected activatedRoute = inject(ActivatedRoute);

  todoForm = this.fb.group({
    title: new FormControl<string | null>('', {validators: [Validators.required]}),
    dueDate: new FormControl<Date | null>(null)
  });

  todosResolver$: Observable<Todo[]> = this.activatedRoute.data
    .pipe(
      map(todos => todos['data']),
    );

  loading = true;

  todos$ = combineLatest([
    this.refreshSubject,
    this.checkSubject,
  ]).pipe(
    takeUntil(this.destroyer$),
    switchMap(([_, checkValue]) => {
      if (this.loading) {
        this.loading = false;
        return this.todosResolver$;
      } else {
        return this.todoSrv.list(checkValue);
      }
    })
  );


  setCheckValue(value: boolean) {
    this.checkSubject.next(value);
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
      this.destroyer$.next();
      this.destroyer$.complete();
  }

  protected modalService = inject(NgbModal);
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

  todoCheckComplete(todo: Todo, check: boolean) {
    this.todoSrv.check(todo.id, check).subscribe(() => {
      this.refreshSubject.next('');
    });
  }
}
