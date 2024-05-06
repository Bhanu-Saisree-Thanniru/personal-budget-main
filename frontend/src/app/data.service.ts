import { BehaviorSubject, Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Budget } from './budget-planner/dashboard/add-budget/Budget';
import { Income } from './budget-planner/dashboard/add-income/Income';
import { Expense } from './budget-planner/dashboard/add-expense/Expense';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {
  }
  // private incomeDataSubject = new BehaviorSubject<number[]>([]);
  // incomeData$ = this.incomeDataSubject.asObservable();
  private messageSource = new BehaviorSubject<boolean>(false); // Initial value is an empty string
  currentMessage$ = this.messageSource.asObservable();


public respData: any = [];

// expense
private requestUrl =`${environment.apiUrl}/expense/items`;
//private requestUrl = 'http://localhost:3000/expense/items';

getExpenseData(userId: string): Observable<Expense[]> {
  return from(axios.get<Expense[]>(`${this.requestUrl}/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}
getExpenseDataForDiffMonths(userId: string, diff: number): Observable<Expense[]> {
  return from(axios.get<Expense[]>(`${this.requestUrl}/month/${diff}/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}
getExpenseDataForThreeMonths(userId: string): Observable<Expense[]> {
  return from(axios.get<Expense[]>(`${this.requestUrl}/amount/3/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}
getExpenseDataForSixMonths(userId: string): Observable<Expense[]> {
  return from(axios.get<Expense[]>(`${this.requestUrl}/amount/6/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}


getCurrentMonthAmountByExpense(userId: string): Observable<any[]>{
  return from(axios.get<any[]>(`${this.requestUrl}/category/total/${userId}`)
    .then(resp => resp.data)
    .catch(error => error));
}

getCurrentMonthExpense(userId: string): Observable<any[]>{
  return from(axios.get<number>(`${this.requestUrl}/expense/total/${userId}`)
  .then(resp => resp.data)
  .catch(error => error));
}
getExpenseByItemName(userId: string, itemName: any): Observable<Expense[]> {
    return from(axios.get<Expense[]>(`${this.requestUrl}/${itemName}/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}

insertExpenseItem(userId: string, item: any): Observable<Expense[]> {
  console.log("item in data.service.ts: " + item);
  console.log("user id: " + userId);
  return from(axios.post<Expense[]>(`${this.requestUrl}/${userId}`, item)
    .then(resp => {
      resp.data;
      console.log("resp data from data.service.ts: " + resp.data);
    })
    .catch(error => error)
  );
}

updateExpenseItem(userId: string, itemName: any): Observable<Expense[]>{
  return from(axios.put<Expense[]>(`${this.requestUrl}/itemName/${userId}`, itemName)
    .then(resp => resp.data));
}

deleteExpenseItem(userId: string, itemName: any): Observable<null>  {
  return from(axios.delete<void>(`${this.requestUrl}/itemName/${userId}`)
    .then(() => null))
}


// Income APIs
private incomeUrl =`${environment.apiUrl}/income`;
//private incomeUrl = 'http://localhost:3000/income';

getIncomeData(userId: string): Observable<Income[]> {
  return from(axios.get<Income[]>(`${this.incomeUrl}/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}

getIncomeByMonth(userId: string, month: any, year: any): Observable<Income[]> {
    return from(axios.get<Income[]>(`${this.incomeUrl}/month/${month}/year/${year}/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => {
      console.log("Error: " + error);
      return error;
    }));
}


getIncomeByMonthAndYear(userId: string, month: any, year: any): Observable<Income[]> {
  return from(axios.get<any[]>(`${this.incomeUrl}/month/${month}/year/${year}/${userId}`)
  .then((resp) => resp.data)
  .catch((error) => {
    console.log("Error: " + error);
    return error;
  }));
}

getIncomeForDiffMonths(userId: string, diff: number): Observable<Income[]>{
  return from(axios.get<Income[]>(`${this.incomeUrl}/${diff}/${userId}`)
  .then((resp) => resp.data)
  .catch((error) => {
    console.log("Error: " + error);
    return error;
    }));
}

getIncomeForThreeMonths(userId: string): Observable<Income[]> {
  return from(axios.get<Income[]>(`${this.incomeUrl}/3/${userId}`)
  .then((resp) => resp.data)
  .catch((error) => {
    console.log("Error: " + error);
    return error;
    }));
}
getIncomeForSixMonth(userId: string): Observable<Income[]> {
  return from(axios.get<Income[]>(`${this.incomeUrl}/6/${userId}`)
  .then((resp) => resp.data)
  .catch((error) => error));
}
insertIncomeData(userId: string, income: any): Observable<Income[]> {
  console.log("income in data.service.ts: " + income);
  return from(axios.post<Income[]>(`${this.incomeUrl}/${userId}`, income)
    .then(resp => {
      resp.data;
      console.log("resp data from data.service.ts: " + resp.data);
    })
    .catch(error => error)
  );
}

updateIncomeData(userId: string, income: any): Observable<Income[]>{

  return from(axios.put<Income[]>(`${this.incomeUrl}/month/${income.months}/year/${income.year}/${userId}`,income)
    .then(resp => {
        console.log("Data service: " + resp.data);
        resp.data;
      })
    .catch(error => error
      )
    )
}

deleteIncomeData(userId: string, month: any): Observable<null>  {
  return from(axios.delete<void>(`${this.requestUrl}/month/${userId}`)
    .then(() => null))
}



// budget
private budgetUrl =`${environment.apiUrl}/budget/items`;
//private budgetUrl = 'http://localhost:3000/budget/items';

getBudgetData(userId: string): Observable<Budget[]> {
  return from(axios.get<Budget[]>(`${this.budgetUrl}/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}
getBudgetDataForMonths(userId: string, diff: number): Observable<Budget[]> {
  return from(axios.get<Budget[]>(`${this.budgetUrl}/month/${diff}/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}
getBudgetDataForThreeMonths(userId: string): Observable<Budget[]> {
  return from(axios.get<Budget[]>(`${this.budgetUrl}/amount/3/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}
getBudgetDataForSixMonths(userId: string): Observable<Budget[]> {
  return from(axios.get<Budget[]>(`${this.budgetUrl}/amount/6/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}

getCurrentMonthBudget(userId: string): Observable<any[]>{
  return from(axios.get<number>(`${this.budgetUrl}/budget/total/${userId}`)
  .then(resp => resp.data)
  .catch(error => error));
}
getBudgetByItemName(userId: string, itemName: any): Observable<Budget[]> {
    return from(axios.get<Budget[]>(`${this.budgetUrl}/${itemName}/${userId}`)
    .then((resp) => resp.data)
    .catch((error) => error));
}

insertBudgetItem(userId: string, item: any): Observable<Budget[]> {
  console.log("item in data.service.ts: " + item[0]);
  return from(axios.post<Budget[]>(`${this.budgetUrl}/${userId}`, item)
    .then(resp => {
      resp.data;
      console.log("resp data from data.service.ts: " + resp.data);
    })
    .catch(error => error)
  );
}

updateBudgetItem(userId: string, itemName: any): Observable<Budget[]>{
  return from(axios.put<Budget[]>(`${this.budgetUrl}/itemName/${userId}`, itemName)
    .then(resp => resp.data));
}

deleteBudgetItem(userId: string, itemName: any): Observable<null>  {
  return from(axios.delete<void>(`${this.budgetUrl}/itemName/${userId}`)
    .then(() => null))
}

changeMessage(message: boolean) {
  this.messageSource.next(message);
}
}
