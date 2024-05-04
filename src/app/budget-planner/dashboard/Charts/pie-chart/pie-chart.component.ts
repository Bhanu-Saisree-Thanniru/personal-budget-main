// import { Component, OnInit } from '@angular/core';
// import * as d3 from 'd3';
// // Adopted from Basic pie chart example on D3 Graph Gallery:
// // https://www.d3-graph-gallery.com/graph/pie_basic.html

// @Component({
//   selector: 'app-pie',
//   templateUrl: './pie-chart.component.html',
//   styleUrls: ['./pie-chart.component.scss']
// })
// export class PieChartComponent implements OnInit {
//   private data = [
//     {"Framework": "Income", "Stars": "1000"},
//     {"Framework": "Expense", "Stars": "500"}

//   ];

//   private svg: any;
//   private margin = 50;
//   private width = 400;
//   private height = 400;
//   // The radius of the pie chart is half the smallest side
//   private radius = Math.min(this.width, this.height) / 2 - this.margin;
//   private colors: any;  constructor() { }

//   ngOnInit(): void {
//     this.createSvg();
//     this.createColors();
//     this.drawChart();
//   }

//   private createSvg(): void {
//     this.svg = d3.select("figure#pie")
//     .append("svg")
//     .attr("width", this.width)
//     .attr("height", this.height)
//     .append("g")
//     .attr(
//       "transform",
//       "translate(" + this.width / 2 + "," + this.height / 2 + ")"
//     );
// }
// private createColors(): void {
//   this.colors = d3.scaleOrdinal()
//   .domain(this.data.map(d => d.Stars.toString()))
//   .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
// }
// private drawChart(): void {
//   // Compute the position of each group on the pie:
//   const pie = d3.pie<any>().value((d: any) => Number(d.Stars));

//   // Build the pie chart
//   this.svg
//   .selectAll('pieces')
//   .data(pie(this.data))
//   .enter()
//   .append('path')
//   .attr('d', d3.arc()
//     .innerRadius(0)
//     .outerRadius(this.radius)
//   )
//   .attr('fill', (d: any, i: any) => (this.colors(i)))
//   .attr("stroke", "#121926")
//   .style("stroke-width", "1px");

//   // Add labels
//   const labelLocation = d3.arc()
//   .innerRadius(100)
//   .outerRadius(this.radius);

//   this.svg
//   .selectAll('pieces')
//   .data(pie(this.data))
//   .enter()
//   .append('text')
//   .text((d: any)=> d.data.Framework)
//   .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
//   .style("text-anchor", "middle")
//   .style("font-size", 15);
// }

// }

// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import * as d3 from 'd3';
// import { DataService } from '../../../../data.service';
// import { AuthenticationService } from '../../../authentication.service';

// @Component({
//   selector: 'app-pie-chart',
//   templateUrl: './pie-chart.component.html',
//   styleUrls: ['./pie-chart.component.scss']
// })
// export class PieChartComponent implements OnInit, AfterViewInit {
//   totalCurrentMonthIncome: number = 0;
//   currentMonthIncome: string = '';
//   months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   totalCurrentMonthExpense: number = 0;
//   currentMonthExpense: string = '';
//   private data = [{}];
//   userId!: string;

//   constructor(private dataService: DataService, private authService: AuthenticationService) { }

//   ngOnInit(): void {
//     this.userId = this.authService.getFirebaseUserId();
//     if (typeof document !== 'undefined') {
//       this.fetchData();
//     }
//     //this.fetchData();
//   }

//   fetchData(): void {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();
//     // Fetch income data
//     this.dataService.getIncomeByMonth(this.userId, this.months[currentMonth], currentYear).subscribe(
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

//             // After both income and expense data fetched, draw pie chart
//             this.createSvg();
//             this.drawPieChart(this.data);
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

//   ngAfterViewInit(): void {
//     console.log("Pie chart component ts: ngAfterViewInit");
//     console.log("type of document: " + typeof document)
//     if (typeof document !== 'undefined') {
//       this.createSvg();
//       this.drawPieChart(this.data);
//     }
//   }

//   private svg: any;
//   private margin = 50;
//   private width = 500 - (this.margin * 2);
//   private height = 400 - (this.margin * 2);

//   private createSvg(): void {
//     this.svg = d3.select("figure#pie")
//       .append("svg")
//       .attr("width", this.width + (this.margin * 2))
//       .attr("height", this.height + (this.margin * 2))
//       .append("g")
//       .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
//   }

//   private drawPieChart(data: any[]): void {
//     // Create pie generator
//     const pie = d3.pie().value((d: any) => d.Stars);

//     // Create arc generator
//     const arc = d3.arc()
//       .innerRadius(0)
//       .outerRadius(Math.min(this.width, this.height) / 2 - 1);

//     // Generate pie chart segments
//     const arcs = this.svg.selectAll("arc")
//       .data(pie(data))
//       .enter()
//       .append("g")
//       .attr("class", "arc");

//     // Draw pie chart segments
//     arcs.append("path")
//       .attr("d", arc)
//       .attr("fill", (d: any) => d.data.Framework === "Income" ? "#3182bd" : "#d04a35");

//     // Add labels to pie chart segments
//     arcs.append("text")
//       .attr("transform", (d: any) => "translate(" + arc.centroid(d) + ")")
//       .attr("text-anchor", "middle")
//       .text((d: any) => d.data.Framework);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../data.service';
import { AuthenticationService } from '../../../authentication.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit{
  private data = [{}];
  userId!: string;

  ngOnInit(): void {
      this.userId = this.authService.getFirebaseUserId();
  }
  constructor(private dataService: DataService, private authService: AuthenticationService) { }
    fetchData(): void {
    // Fetch data from your service
    // Example:
    this.dataService.getBudgetData(this.userId).subscribe(data => {
      this.data = data;
      //this.drawChart();
    });
    // For this example, I'm assuming you have data in a format like:
    this.data = [
      { date: '2024-01-01', value: 10 },
      { date: '2024-02-01', value: 20 },
      { date: '2024-03-01', value: 15 },
      // Add more data points as needed
    ];
    // this.drawChart();
  }

  ngAfterViewInit(): void { }

//   private drawChart(): void {
//     const margin = { top: 20, right: 30, bottom: 30, left: 40 };
//     const width = 600 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     const svg = d3.select("figure#line-chart")
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//       const x = d3.scaleTime()
//     .domain(d3.extent(this.data, (d) => data.map(d) => d))
//     .range([0, width]);



//     const y = d3.scaleLinear()
//       .domain([0, d3.max(this.data, (d: any) => d.value)])
//       .nice()
//       .range([height, 0]);

//     const line = d3.line()
//       .x((d: any) => x(new Date(d.date)))
//       .y((d: any) => y(d.value));

//     svg.append("g")
//       .attr("class", "x-axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//     svg.append("g")
//       .attr("class", "y-axis")
//       .call(d3.axisLeft(y));

//     svg.append("path")
//       .datum(this.data)
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", 1.5)
//       .attr("d", line);
//   }
// }


}
//   fetchData(): void {
//     // Fetch data from your service
//     // Example:
//     // this.dataService.getData().subscribe(data => {
//     //   this.data = data;
//     //   this.drawChart();
//     // });
//     // For this example, I'm assuming you have data in a format like:
//     this.data = [
//       { date: '2024-01-01', value: 10 },
//       { date: '2024-02-01', value: 20 },
//       { date: '2024-03-01', value: 15 },
//       // Add more data points as needed
//     ];
//     this.drawChart();
//   }

//   ngAfterViewInit(): void { }

//   private drawChart(): void {
//     const margin = { top: 20, right: 30, bottom: 30, left: 40 };
//     const width = 600 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     const svg = d3.select("figure#line-chart")
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//       const x = d3.scaleTime()
//     .domain(d3.extent(this.data, (...this.data) => data.map(d) => d}))
//     .range([0, width]);



//     const y = d3.scaleLinear()
//       .domain([0, d3.max(this.data, (d: any) => d.value)])
//       .nice()
//       .range([height, 0]);

//     const line = d3.line()
//       .x((d: any) => x(new Date(d.date)))
//       .y((d: any) => y(d.value));

//     svg.append("g")
//       .attr("class", "x-axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//     svg.append("g")
//       .attr("class", "y-axis")
//       .call(d3.axisLeft(y));

//     svg.append("path")
//       .datum(this.data)
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", 1.5)
//       .attr("d", line);
//   }
// }
