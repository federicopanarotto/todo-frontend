import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './todo.type';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  protected http = inject(HttpClient);

  list(showCompleted: boolean = false) {
    return this.http.get<Todo[]>(`/api/todos?showCompleted=${showCompleted}`);
  }

  add(title: string, dueDate: string | undefined) {
    return this.http.post<Todo>(`/api/todos`, { title: title, dueDate: dueDate });
  }

  check(id: string, check: boolean) {
    return check 
      ? this.http.patch(`/api/todos/${id}/check`, {}) 
      : this.http.patch(`/api/todos/${id}/uncheck`, {});
  }

}
