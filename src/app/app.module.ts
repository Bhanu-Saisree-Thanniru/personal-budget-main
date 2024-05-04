import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginModule } from './budget-planner/login/login.module';
import { RouterModule } from '@angular/router';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { ConfigBudgetComponent } from './config-budget/config-budget.component';
import { AddIncomeComponent } from './budget-planner/dashboard/add-income/add-income.component';

@NgModule({
  declarations: [AppComponent, ConfigBudgetComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyBxcKh0ESa2prKJ4j-xhKxmwo5XTe2Hizw',
      authDomain: 'personal-budget-application.firebaseapp.com',
      projectId: 'personal-budget-application',
      storageBucket: 'personal-budget-application.appspot.com',
      messagingSenderId: '362355297871',
      appId: '1:362355297871:web:c4fea06d7fb49da9f3643a',
      measurementId: 'G-QNL0QXF0SV',
    }),
    AngularFireAuthModule,
    RouterModule,
  ],
  providers: [provideClientHydration(), provideAnimationsAsync(),provideMomentDateAdapter(undefined, {useUtc: true})],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
