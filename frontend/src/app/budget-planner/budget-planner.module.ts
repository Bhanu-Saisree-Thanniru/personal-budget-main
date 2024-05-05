import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetPlannerRoutingModule } from './budget-planner-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { BarChartComponent } from './dashboard/Charts/bar-chart/bar-chart.component';
import { PieChartComponent } from './dashboard/Charts/pie-chart/pie-chart.component'; // Add this line
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AddIncomeComponent } from './dashboard/add-income/add-income.component';
import { AddExpenseComponent } from './dashboard/add-expense/add-expense.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AddBudgetComponent } from './dashboard/add-budget/add-budget.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PrevHistoryComponent } from './prev-history/prev-history.component';
import { SignupComponent } from './signup/signup.component';
import { InActivityComponent } from './in-activity/in-activity.component';

@NgModule({
  declarations: [
    BarChartComponent,
    PieChartComponent,
    DashboardComponent,
    SideNavComponent,
    AddIncomeComponent,
    AddExpenseComponent,
    AddBudgetComponent,
    UserProfileComponent,
    PrevHistoryComponent,
    SignupComponent,
    InActivityComponent
    //LogoutPopupComponent
  ],
  imports: [
    CommonModule,
    BudgetPlannerRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers:[FormBuilder],
})
export class BudgetPlannerModule {}
