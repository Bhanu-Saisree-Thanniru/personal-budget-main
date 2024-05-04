// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-prev-history',
//   templateUrl: './prev-history.component.html',
//   styleUrl: './prev-history.component.scss'
// })
// export class PrevHistoryComponent {

// }

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';
import { response } from 'express';
import { Income } from '../dashboard/add-income/Income';
import { Budget } from '../../config-budget/Budget';
import { Expense } from '../dashboard/add-expense/Expense';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prev-history',
  templateUrl: './prev-history.component.html',
  styleUrl: './prev-history.component.scss',
})
export class PrevHistoryComponent {
  budgets: any[] = []; // Initialize with an empty array
  incomes: any[] = []; // Initialize with an empty array

  expenses: Expense[] = [];
  addBudgets: Budget[] = [];

  budgetFilter!: number;
  expenseFilter!: number;
  incomeFilter!: any;

  userId!: string;

  constructor(private dataService: DataService, private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.authService.getFirebaseUserId();
    if(this.userId === undefined){
      this.router.navigate(['/budget/login']);
    }
    // Fetch budget history
    // this.http.get('/api/budgets').subscribe((data: Object) => {
    //   this.budgets = data as any[];
    // });

    // // Fetch monthly income
    // this.http.get('/api/incomes').subscribe((data: Object) => {
    //   this.incomes = data as any[];
    // });
  }

  // console.log("prev hist : " + this.budgetFilter);


  onExpenseFilterChange() {
    console.log("Prev hist ts: filterValue" + this.expenseFilter);
    this.dataService.getExpenseDataForDiffMonths(this.userId, this.expenseFilter)
      .subscribe((expense) => {
        this.expenses = expense
    }
    ,error => { console.log("error : " + error)}
    )
  }

  onIncomeFilterChange(){
    this.dataService.getIncomeForDiffMonths(this.userId, this.incomeFilter)
      .subscribe((income) => {
        this.incomes = income
      }
      ,error => { console.log("error : " + error)}
    )
  }
  onBudgetFilterChange(){
    this.dataService.getBudgetDataForMonths(this.userId, this.budgetFilter)
      .subscribe((budget) => {
        this.addBudgets = budget;
      },
      error => { console.log("error : " + error)})
  }
}
