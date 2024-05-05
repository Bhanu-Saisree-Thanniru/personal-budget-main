// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-budget',
//   templateUrl: './add-budget.component.html',
//   styleUrl: './add-budget.component.scss'
// })
// export class AddBudgetComponent {

// }

import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { Budget } from './Budget';
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
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrl: './add-budget.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class AddBudgetComponent {
  expenses = [
    'Pharmacy',
    'Transportation',
    'Grocery',
    'Utility',
    'Rent',
    'Misc',
  ];
  addForm: FormGroup;
  userId!: string;

  constructor(
    public dialogRef: MatDialogRef<AddBudgetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.addForm = this.formBuilder.group({
      // date: new FormControl(moment()),
      // expenseType: new FormControl(),
      // amount: new FormControl()
      date: ['', Validators.required],
      expenseType: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  setMonthAndYear(normalizedMonthAndYear: any, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.addForm.get('date')?.value ?? Date();
    console.log(
      ' normalized : ' +
        normalizedMonthAndYear +
        ' normalizedMonthAndYear.month(): ' +
        normalizedMonthAndYear.month() +
        ' normalizedMonthAndYear.year(): ' +
        normalizedMonthAndYear.year()
    );
    const d: Date = new Date();
    console.log('Date : ' + d);
    d.setMonth(normalizedMonthAndYear.month());
    d.setFullYear(normalizedMonthAndYear.year());
    console.log('D is: ' + d);
    this.addForm.get('date')!.setValue(ctrlValue);
    this.addForm.get('date')!.setValue(d);
    console.log(
      'ctrl val: ' + ctrlValue + ' this. : ' + this.addForm.get('date')
    );
    datepicker.close();
  }
  newBudget!: Budget;
  items: Budget[] = [];
  newItem: any = {};

  ngOnInit(): void {
    this.userId = this.authService.getFirebaseUserId();
    this.getBudgetItems();
  }

  getBudgetItems() {
    this.dataService.getBudgetData(this.userId).subscribe(
      (items) => {
        this.items = items;
      },
      (error) => {
        console.log('error : ' + error);
      }
    );
  }

  onSubmit() {
    console.log('data is: ' + this.addForm.value);
    this.dataService.insertBudgetItem(this.userId, this.addForm.value).subscribe(
      (response) => {
        //this.getBudgetItems();
        console.log(' Budget added successfully');
        console.log('response is : ' + response);
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }
  addItem() {
    console.log(
      'reached addItem() ' +
        this.newBudget +
        ' Form val: ' +
        this.addForm.value +
        ' this.items: ' +
        this.items
    );
    this.dataService.insertBudgetItem(this.userId, this.items).subscribe(
      (response) => {
        this.getBudgetItems();
        console.log('response is : ' + response);
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }
}
