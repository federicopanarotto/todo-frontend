import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { TodoService } from './services/todo.service';
import { BehaviorSubject, combineLatest, debounceTime, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Todo } from './services/todo.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  protected todoSrv = inject(TodoService);
  protected checkSubject = new BehaviorSubject<boolean>(false);
  protected refreshSubject = new BehaviorSubject<any>('');

  protected destroyer$ = new Subject<void>();

  todos$ = combineLatest([
    this.refreshSubject,
    this.checkSubject
  ]).pipe(
    takeUntil(this.destroyer$),
    debounceTime(300),
    switchMap(([_, checkValue]) => {
      return this.todoSrv.list(checkValue)
    })
  )

  setCheckValue(value: boolean) {
    this.checkSubject.next(value);
  }

  protected fb = inject(FormBuilder);

  todoForm = this.fb.group({
    title: new FormControl<string | null>('', {validators: [Validators.required]}),
    dueDate: new FormControl<Date | null>(null)
  })

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      this.destroyer$.next();
      this.destroyer$.complete();
  }

  private modalService = inject(NgbModal);
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

          modal.close('Save click');
        });

    }
  }

  dismissModal(modal: any) {
    this.todoForm.reset();

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
