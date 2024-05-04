import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material/dialog';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import moment from 'moment';
import { Expense } from './Expense';
import { DataService } from '../../../data.service';
import { AuthenticationService } from '../../authentication.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss',
  providers:[provideMomentDateAdapter(MY_FORMATS)]
})
export class AddExpenseComponent {

  expenses = ["Pharmacy","Transportation","Grocery","Utility", "Rent", "Misc"]
  addForm: FormGroup;
  userId!: string;

  constructor(
    public dialogRef: MatDialogRef<AddExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService : DataService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.addForm = this.formBuilder.group({
      // date: new FormControl(moment()),
      // expenseType: new FormControl(),
      // amount: new FormControl()
      date: ['', Validators.required],
      expenseType: ['', Validators.required],
      amount: ['', Validators.required]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  setMonthAndYear(normalizedMonthAndYear: any, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.addForm.get('date')?.value ?? Date();
    //ctrlValue.month(normalizedMonthAndYear.month());
    //ctrlValue.year(normalizedMonthAndYear.year());
    const d: Date = new Date();
    console.log("Date : " + d);
    d.setMonth(normalizedMonthAndYear.month());
    d.setFullYear(normalizedMonthAndYear.year());
    this.addForm.get('date')!.setValue(ctrlValue);
    this.addForm.get('date')!.setValue(d);
    console.log("ctrl val: " + ctrlValue + " this. : " + this.addForm.get('date'));
    datepicker.close();
  }

  newExpense!:  Expense;
  items: Expense[] = [];
  newItem: any = {};

  ngOnInit(): void {
    this.userId = this.authService.userId;
    console.log("Form ng on init add expense.component.ts: " + this.userId);
    this.getExpenseItems();
  }

  getExpenseItems() {
    this.dataService.getExpenseData(this.userId)
      .subscribe((items) => { this.items = items;}
      ,error => { console.log("error : " + error)});
  }

  onSubmit(){
    console.log("data is: " + this.addForm.value);
    //this.dataService.getExpenseByItemName(this.addForm.value)
    const { amount, date, expenseType } = this.addForm.value;
    if(!amount || !date || !expenseType){
      console.log("Date, amount and expense type are required");
    }
    else{
      this.dataService.insertExpenseItem(this.userId, this.addForm.value)
      .subscribe(response => {
        this.getExpenseItems();
        console.log(" Expense added successfully");
        console.log("response is : " + response);
      }
      ,error => { console.log("Error: " + error)});
    }
  }

  addItem() {
    console.log("reached addItem() " + this.newExpense + " Form val: " + this.addForm.value + " this.items: " + this.items);
    this.dataService.insertExpenseItem(this.userId, this.items)
      .subscribe(response => {
        console.log("response is : " + response);
        this.getExpenseItems();
      }
      ,error => { console.log("Error: " + error)});
  }

  updateItem() {
    this.dataService.updateExpenseItem(this.userId, this.newExpense)
      .subscribe(response => this.getExpenseItems()
      ,error => { console.log("Error: " + error)});
  }

  deleteItem(itemName: any) {
    this.dataService.deleteExpenseItem(this.userId, itemName)
      .subscribe(response => this.getExpenseItems()
      ,error => { console.log("Error: " + error)});
  }

  deleteItemI() {
    this.dataService.deleteExpenseItem(this.userId, this.newExpense)
        .subscribe(response => this.getExpenseItems()
        ,error => { console.log("Error: " + error)});
    }

}
