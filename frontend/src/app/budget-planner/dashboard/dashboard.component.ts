import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddIncomeComponent } from './add-income/add-income.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { DataService } from '../../data.service';
import { Income } from './add-income/Income';
import { timestamp } from 'rxjs';
import { error } from 'console';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { response } from 'express';
import firebase from 'firebase/compat/app';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  updatedDataEvent: any;

  constructor(public router: Router,public dialog: MatDialog, private dataService: DataService, private cdr: ChangeDetectorRef, private authService: AuthenticationService) {}
  //Income
  //lastMonthsIncome = ['January: $1000', 'February: $1500', 'March: $1200'];
  lastMonthsIncome: string[] = [];
  currentMonthIncome = '';
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  //Expense
  //lastMonthsExpense = ['January: $800', 'February: $1000', 'March: $1200'];
  lastMonthsExpense: string[] = [];
  currentMonthExpense = '';

  //Budget
  //lastMonthsExpense = ['January: $800', 'February: $1000', 'March: $1200'];
  lastMonthsBudget: string[] = [];
  currentMonthBudget = '';

  //Total
  totalCurrentMonthIncome = 0;
  totalCurrentMonthExpense = 0;
  totalCurrentMonthBudget = 0;
  userId!: string;

  ngOnInit(){
    // const user = firebase.auth().currentUser;
    // const firebaseUserId = user ? user.uid : null;
    // console.log('Dashboard component: firebaseUserId :' + firebaseUserId);
    this.userId = this.authService.getFirebaseUserId();
    if(this.userId === undefined){
      this.router.navigate(['/budget/login']);
    }else{
      this.getIncomeData();
      this.getExpenseData();
      this.getBudgetData();
      this.getCurrentMonIncomeData();
      this.getCurrentMonthExpenseData();
      this.getCurrentMonthBudgetData();
      //this.getCurrentMonthIncomeData();
    }
  }

  getIncomeData() {
    this.dataService.getIncomeForThreeMonths(this.userId)
      .subscribe((income) => {
        this.lastMonthsIncome = [];
        console.log("From dashboard.ts Income is : "+ income);
        for (let index = 0; index < income.length; index++) {
          const element = income[index];
          const concatMonExp = income[index].month + ": $" + income[index].amount;
          console.log("concatMonExp: " + concatMonExp);
          this.lastMonthsIncome.push(concatMonExp);
          console.log("last month income: " + this.lastMonthsIncome);
        }
      }
      ,error => { console.log("error : " + error)});
  }

  getExpenseData() {
    this.dataService.getExpenseDataForThreeMonths(this.userId)
      .subscribe((expense) => {
        this.lastMonthsExpense = [];
        console.log("From dashboard.ts Income is : "+ expense);
        for (let index = 0; index < expense.length; index++) {
          const element = expense[index];
          const monthAndYear = expense[index].monthAndYear;
          const date = new Date(monthAndYear);
          const monthName = this.months[date.getMonth()];
          if(expense[index].amount === null){
            expense[index].amount = 0;
          }
          const concatMonExp = monthName + ": $" + expense[index].amount;
          console.log("concatMonExp: " + concatMonExp);
          this.lastMonthsExpense.push(concatMonExp);
          console.log("last month income: " + this.lastMonthsExpense);
        }
      }
      ,error => { console.log("error : " + error)});
  }

  getBudgetData() {
    this.lastMonthsBudget = [];
    this.dataService.getBudgetDataForThreeMonths(this.userId)
      .subscribe((budget) => {
        console.log("From dashboard.ts Income is : "+ budget);
        for (let index = 0; index < budget.length; index++) {
          const element = budget[index];
          const monthAndYear = budget[index].monthAndYear;
          const date = new Date(monthAndYear);
          const monthName = this.months[date.getMonth()];
          const concatMonExp = monthName + ": $" + budget[index].amount;
          console.log("concatMonExp: " + concatMonExp);
          this.lastMonthsBudget.push(concatMonExp);
          console.log("last month income: " + this.lastMonthsBudget);
        }
      }
      ,error => { console.log("error : " + error)});
  }


  getCurrentMonIncomeData() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const year = currentDate.getFullYear();
    this.dataService.getIncomeByMonth(this.userId, this.months[currentMonth], year)
      .subscribe((income) => {
        console.log("From dashboard.ts current mon Income is : "+ income);
        this.totalCurrentMonthIncome = income[0].amount;
        this.currentMonthIncome = "$" + this.totalCurrentMonthIncome;
      }
      ,error => { console.log("error : " + error); return error; });
  }



// getCurrentMonthIncomeData(){
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth();
//   const currentYear = currentDate.getFullYear();
//   this.dataService.getIncomeByMonthAndYear(this.userId, this.months[currentMonth], currentYear)
//     .subscribe(response => {
//       console.log(" response from dashboard: " + response);
//     },
//     error => console.log("Error: " + error))
// }
  getCurrentMonthExpenseData(){
    this.dataService.getCurrentMonthExpense(this.userId)
      .subscribe((budget) => {
        console.log("From dashboard.ts current month expense: "+ budget[0].total_expense);
        this.totalCurrentMonthExpense = budget[0].total_expense;
        this.currentMonthExpense = "$" + this.totalCurrentMonthExpense;
      },
      error => {  console.log("Error: " + error)});
  }

  getCurrentMonthBudgetData(){
    this.dataService.getCurrentMonthBudget(this.userId)
      .subscribe((budget) => {
        this.totalCurrentMonthBudget = budget[0].total_expense;
        this.currentMonthBudget = "$" + this.totalCurrentMonthBudget;
      },
      error => {  console.log("Error: " + error)});
  }
  onIncome() {
   const dialogRef = this.dialog.open(AddIncomeComponent, {
    data: {},
  });

  dialogRef.afterClosed().subscribe(result => {
    setTimeout(() => {
      this.getIncomeData();
      this.getCurrentMonIncomeData();
    }, 200)
      this.dataService.changeIncomeMessage(true);
  });
  }
  onExpense() {
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getExpenseData();
      this.getCurrentMonthExpenseData();
      this.dataService.changeExpenseMessage(true);
    });
  }
  onBudget() {
    const dialogRef = this.dialog.open(AddBudgetComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
        this.getBudgetData();
        this.getCurrentMonthBudgetData();
        this.dataService.changeBudgetMessage(true);
    });
  }

  //Calculate Total
  get currentMonthSavings(): number {
    return this.totalCurrentMonthIncome - this.totalCurrentMonthExpense;
  }

  onIncomeAdded(income: any) {
    // Handle the emitted income data here and update the UI accordingly
    const concatMonExp = `${income.month}: $${income.amount}`;
    this.lastMonthsIncome.push(concatMonExp);
  }
}
