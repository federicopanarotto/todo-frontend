import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { fetchListResolver } from './resolvers/fetch-list.resolver';
import { TodoContainerComponent } from './pages/todo-container/todo-container.component';

const routes: Routes = [
  {
    path: '',
    component: TodoContainerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
