import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { catchError, Observable, of } from 'rxjs';
import { Todo } from '../services/todo.type';

export const fetchListResolver: ResolveFn<Observable<Todo[]>> = (route, state) => {
  const todoSrv = inject(TodoService);

  return todoSrv.list(false).pipe(
    catchError(() => of([]))
  );
};

