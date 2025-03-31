import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TodoCardComponent } from './components/todo-card/todo-card.component';
import { ExpiredDatePipe } from './pipes/expired-date.pipe';
import { DatePipe } from '@angular/common';
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';
import { TodoContainerComponent } from './pages/todo-container/todo-container.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckboxComponent,
    TodoCardComponent,
    ExpiredDatePipe,
    CapitalizeFirstLetterPipe,
    TodoContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(), 
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    DatePipe,
    ExpiredDatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
