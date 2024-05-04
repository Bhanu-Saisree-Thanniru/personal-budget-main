import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material/dialog';
import { DataService } from '../../../data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Income } from './Income';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrl: './add-income.component.scss'
})
export class AddIncomeComponent {

  //amount = new FormControl();
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];
  addIncome!: FormGroup;
  income!: Income[];
  newIncome!: Income;
  userId!: string;
  //amount!: new FormControl();

  @Output() updatedDataEvent = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<AddIncomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService : DataService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {

    this.addIncome = this.formBuilder.group({
      months: ['', Validators.required],
      amount: ['', Validators.required],
      year: ['', Validators.required]
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.getIncomeData();
  }

  getIncomeData() {
    this.dataService.getIncomeData(this.userId)
      .subscribe((income) => { this.income = income;
        return this
      }
      ,error => { console.log("error : " + error)});
  }

  onSubmit(){
    console.log("data is: " + this.addIncome.value);
    const { amount, month, year } = this.addIncome.value;
    if(!amount || !month || !year){
      console.log("Month, year and amount are required");
    }
    else{
      const resp = this.getIncomeDataByMonthAndYear();
      console.log("resp: " + resp);
      // this.dataService.insertIncomeData(this.addIncome.value)
      // .subscribe(response => {
      //   //this.getBudgetItems();
      //   console.log(" Income data added successfully");
      //   console.log("response is : " + response);
      // }
      // ,error => { console.log("Error: " + error)});
    }
  }
  addIncomeData() {
    console.log("Add resp: Add Income : " + this.addIncome.value);
    const { amount, months, year } = this.addIncome.value;
    if(!amount || !months || !year){
      console.log("Month, year and amount are required");
    }
    else{
      this.getIncomeDataByMonthAndYear()
      .subscribe(response => {
        if(response.length > 0){
          console.log("add income: calling updating func ");
          this.updateIncomeData();
        }
        else{
          console.log("Add income: calling adding func");
          this.addIncomeDataToDB();
        }
      },
      (error) => {
        console.log("Error: " + error);
      }
    )
      // this.dataService.insertIncomeData(this.addIncome.value)
      // .subscribe(response => {
      //   //this.getBudgetItems();
      //   console.log(" Income data added successfully");
      //   console.log("response is : " + response);
      // }
      // ,error => { console.log("Error: " + error)});
    }
    // console.log("reached addItem() " + this.newIncome + " Form val: " + this.addIncome.value + " this.income: " + this.income);
    // this.dataService.insertIncomeData(this.addIncome.value)
    //   .subscribe(response => {
    //     this.getIncomeData();
    //     console.log("add income : response is : " + response);
    //   }
    //   ,error => { console.log("Error: " + error)});
  }

  addIncomeDataToDB(){
    this.dataService.insertIncomeData(this.userId, this.addIncome.value)
      .subscribe(response => {
        //this.getBudgetItems();
        this.updatedDataEvent.emit(response);
        this.dialogRef.close(response);
        console.log(" Income data added successfully");
        console.log("response is : " + response);
      }
      ,error => { console.log("Error: " + error)});
  }
  updateIncomeData() {
    this.dataService.updateIncomeData(this.userId, this.addIncome.value)
      .subscribe(response => {
        this.getIncomeData();
        this.updatedDataEvent.emit(this.getIncomeData());
      }
      ,error => { console.log("Error: " + error)});
  }

  getIncomeDataByMonthAndYear(){
    return this.dataService.getIncomeByMonthAndYear(this.userId, this.addIncome.value.months, this.addIncome.value.year);
    // .subscribe(response => {
    //   console.log("add income: Response is : " + response);
    //   return response;
    // },
    // error => { console.log("Error: " + error); });
  }

  deleteIncome(itemName: any) {
  this.dataService.deleteBudgetItem(this.userId, itemName)
      .subscribe(response => this.getIncomeData()
      ,error => { console.log("Error: " + error)});
  }

  deleteItemI() {
    this.dataService.deleteBudgetItem(this.userId, this.newIncome)
        .subscribe(response => this.getIncomeData()
        ,error => { console.log("Error: " + error)});
    }

}
