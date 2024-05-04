// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import * as d3 from 'd3';
// import { DataService } from '../../../../data.service';

// @Component({
//   selector: 'app-bar',
//   templateUrl: './bar-chart.component.html',
//   styleUrls: ['./bar-chart.component.scss']
// })
// export class BarChartComponent implements OnInit, AfterViewInit {
//   totalCurrentMonthIncome: number = 0;
//   currentMonthIncome: string = '';
//   months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   totalCurrentMonthExpense: number = 0;
//   currentMonthExpense: string = '';
//   private data = [{}];

//   constructor(private dataService: DataService) { }

//   ngOnInit(): void {
//     this.fetchData();
//   }

//   fetchData(): void {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();

//     // Fetch income data
//     this.dataService.getIncomeByMonth(this.userId, this.months[currentMonth]).subscribe(
//       income => {
//         this.totalCurrentMonthIncome = income[0].amount;
//         this.currentMonthIncome = "$" + this.totalCurrentMonthIncome;
//         this.data.push({ "Framework": "Income", "Stars": this.totalCurrentMonthIncome });

//         // Fetch expense data
//         this.dataService.getCurrentMonthBudget(this.userId).subscribe(
//           budget => {
//             this.totalCurrentMonthExpense = budget[0].total_expense;
//             this.currentMonthExpense = "$" + this.totalCurrentMonthExpense;
//             this.data.push({ "Framework": "Expense", "Stars": this.totalCurrentMonthExpense });

//             // After both income and expense data fetched, draw bars
//             this.createSvg();
//             this.drawBars(this.data);
//           },
//           error => {
//             console.error("Error fetching expense data:", error);
//           }
//         );
//       },
//       error => {
//         console.error("Error fetching income data:", error);
//       }
//     );
//   }

//   ngAfterViewInit(): void { }

//   private svg: any;
//   private margin = 50;
//   private width = 500 - (this.margin * 2);
//   private height = 400 - (this.margin * 2);

//   private createSvg(): void {
//     this.svg = d3.select("figure#bar")
//       .append("svg")
//       .attr("width", this.width + (this.margin * 2))
//       .attr("height", this.height + (this.margin * 2))
//       .append("g")
//       .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
//   }

//   private drawBars(data: any[]): void {
//     // Find the maximum value for adjusting the Y-axis domain dynamically
//     const maxStars = d3.max(data, (d: any) => d.Stars) as number;

//     // Create the X-axis band scale
//     const x = d3.scaleBand()
//       .range([0, this.width])
//       .domain(data.map(d => d.Framework))
//       .padding(0.2);

//     // Draw the X-axis on the DOM
//     this.svg.append("g")
//       .attr("transform", "translate(0," + this.height + ")")
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//       .attr("transform", "translate(-10,0)rotate(-45)")
//       .style("text-anchor", "end");

//     // Create the Y-axis linear scale with dynamic domain
//     const y = d3.scaleLinear()
//       .domain([0, maxStars])
//       .range([this.height, 0]);

//     // Draw the Y-axis on the DOM
//     this.svg.append("g")
//       .call(d3.axisLeft(y));

//     // Create and fill the bars
//     this.svg.selectAll("bars")
//       .data(data)
//       .enter()
//       .append("rect")
//       .attr("x", (d: any) => x(d.Framework))
//       .attr("y", (d: any) => y(d.Stars))
//       .attr("width", x.bandwidth())
//       .attr("height", (d: any) => this.height - y(d.Stars))
//       .attr("fill", (d: any) => d.Framework === "Income" ? "#3182bd" : "#d04a35"); // Adjust fill color based on data
//   }
// }

import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../../../../data.service';
import { map } from 'rxjs/internal/operators/map';
import { Income } from '../../add-income/Income';
import { Budget } from '../../../../config-budget/Budget';
import { Expense } from '../../add-expense/Expense';
import { AuthenticationService } from '../../../authentication.service';

@Component({
  selector: 'app-bar',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, AfterViewInit {
  totalIncomeData: { month: string, amount: number }[] = [];
  totalExpenseData: { month: string, amount: number }[] = [];
  private months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private dataService: DataService, private authService: AuthenticationService) { }

   userId !: string;
  ngOnInit(): void {
    this.fetchData();
    this.userId = this.authService.getFirebaseUserId();
  }

  fetchData(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    //const lastSixMonths = this.getLastSixMonths(currentMonth);

    const incomeObservables = this.dataService.getBudgetDataForSixMonths(this.userId).pipe(
      map((data: Budget[]) => ({ month: this.months, amount: data.length > 0 ? data[0].amount : 0 }))
    );
    console.log("Bar chart: " + incomeObservables);
    const expenseObservables = this.dataService.getExpenseDataForSixMonths(this.userId).pipe(
      map((data: Expense[]) => ({ month: this.months, amount: data.length > 0 ? data[0].amount : 0 }))
    );
    console.log("Bar chart: " + expenseObservables);
  }
    ngAfterViewInit(): void { }
  //   Promise.all(incomeObservables).then((incomes) => {
  //     this.totalIncomeData = incomes.map((income, index) => ({
  //       month: this.months[index],
  //       amount: income[0].amount
  //     }));

  //     return Promise.all(expensePromises);
  //   }).then((expenses) => {
  //     this.totalExpenseData = expenses.map((expense, index) => ({
  //       month: lastSixMonths[index],
  //       amount: expense[0].total_expense
  //     }));

  //     this.drawChart();
  //   }).catch((error) => {
  //     console.error("Error fetching data:", error);
  //   });
  // }

  // ngAfterViewInit(): void { }

  // private drawChart(): void {
  //   // Create the SVG element
  //   const svg = d3.select("figure#bar")
  //     .append("svg")
  //     .attr("width", 500)
  //     .attr("height", 400);

  //   // Define margins and dimensions
  //   const margin = { top: 20, right: 20, bottom: 70, left: 40 };
  //   const width = 500 - margin.left - margin.right;
  //   const height = 400 - margin.top - margin.bottom;

  //   // Create X scale
  //   const xScale = d3.scaleBand()
  //     .range([0, width])
  //     .domain(this.totalIncomeData.map(d => d.month))
  //     .padding(0.1);

  //   // Create Y scale
  //   const yScale = d3.scaleLinear()
  //     .domain([0, d3.max([...this.totalIncomeData, ...this.totalExpenseData], d => d.amount)])
  //     .range([height, 0]);

  //   // Create X axis
  //   svg.append("g")
  //     .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
  //     .call(d3.axisBottom(xScale))
  //     .selectAll("text")
  //     .style("text-anchor", "end")
  //     .attr("dx", "-0.8em")
  //     .attr("dy", "-0.55em")
  //     .attr("transform", "rotate(-90)");

  //   // Create Y axis
  //   svg.append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  //     .call(d3.axisLeft(yScale));

  //   // Create bars for income
  //   svg.selectAll(".incomeBar")
  //     .data(this.totalIncomeData)
  //     .enter().append("rect")
  //     .attr("class", "incomeBar")
  //     .attr("x", d => xScale(d.month) + margin.left)
  //     .attr("width", xScale.bandwidth())
  //     .attr("y", d => yScale(d.amount) + margin.top)
  //     .attr("height", d => height - yScale(d.amount))
  //     .attr("fill", "green");

  //   // Create bars for expense
  //   svg.selectAll(".expenseBar")
  //     .data(this.totalExpenseData)
  //     .enter().append("rect")
  //     .attr("class", "expenseBar")
  //     .attr("x", d => xScale(d.month) + margin.left)
  //     .attr("width", xScale.bandwidth())
  //     .attr("y", d => yScale(d.amount) + margin.top)
  //     .attr("height", d => height - yScale(d.amount))
  //     .attr("fill", "red");
   }

