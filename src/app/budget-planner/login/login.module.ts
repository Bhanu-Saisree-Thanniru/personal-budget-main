import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LogoutPopupComponent } from './logout-popup/logout-popup.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, LogoutPopupComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
  ],
  providers:[FormBuilder],
  exports: [MatInputModule],
})
export class LoginModule {}
