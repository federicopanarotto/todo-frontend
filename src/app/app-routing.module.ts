import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { fetchListResolver } from './resolvers/fetch-list.resolver';
import { TodoContainerComponent } from './pages/todo-container/todo-container.component';

const routes: Routes = [
  {
    path: '',
    component: TodoContainerComponent,
    resolve: {
      data: fetchListResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
