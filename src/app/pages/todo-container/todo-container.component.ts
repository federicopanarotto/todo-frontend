import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, switchMap} from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../services/todo.type';
import { TodoModalComponent } from '../../components/todo-modal/todo-modal.component';

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
      })
    );

  setCheckValue(value: boolean) {
    this.checkSubject.next(value);
  }

  todoCheckComplete(todo: Todo, check: boolean) {
    this.todoSrv.check(todo.id, check)
      .subscribe(() => this.refreshSubject.next(''));
  }

  protected modalService = inject(NgbModal);

	openModal() {
		this.modalService.open(TodoModalComponent).result
      .then((formValues) => {
        console.log(formValues);
        this.todoSrv.add(formValues.title, formValues.dueDate)
         .subscribe(() => {
           this.refreshSubject.next('');
         });
      });
  }
}
