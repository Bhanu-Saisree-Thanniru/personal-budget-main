import { Component } from '@angular/core';
import { DataService  } from '../../../../data.service';
import { AuthenticationService } from '../../../authentication.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent {
  totalCurrentMonthIncome: number = 0;
  totalCurrentMonthExpense: number = 0;
  userId!: string;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private data = [{
    "category": '',
    "value": 0
  }];

  constructor(private dataService: DataService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.userId = this.authService.getFirebaseUserId();
    this.fetchData();
    if(this.userId !== undefined){
      this.fetchData();
    }
  }

  fetchData(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const year = currentDate.getFullYear();
    this.dataService.getExpenseDataForSixMonths(this.userId).subscribe(
      income => {
        for (let index = 0; index < income.length; index++) {
          console.log("Month and year: "+ income[index].monthAndYear + " type: " + typeof income[index].monthAndYear);
          //console.log(" month is : " + (income[index].monthAndYear.getMonth()));
          const date = new Date(income[index].monthAndYear);
          const monthNum = date.getMonth();
          const month = this.months[monthNum];
          const amount = income[index].amount;
          this.data.push({ "category": month, "value": amount });
        }
        d3.select("figure#line-chart").selectAll("*").remove();
        this.createLineChart();
      },
      error => {
        console.error("Error fetching income data:", error);
      }
    );
  }


  private createLineChart(): void {
    const margin = { top: 10, right: 10, bottom: 20, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("figure#line-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Adjust domain based on data
    x.domain([0, this.data.length - 1]); // Assuming category is index
    y.domain([0, d3.max(this.data, (d: any) => d.value)]);

    const valueline: any = d3.line()
      .x((d, i) => x(i))
      .y(({ value }: any) => y(value));

    // Add the valueline path
    svg.append("path")
      .data([this.data])
      .attr("class", "line")
      .attr("fill", "none") // Remove fill color
      .attr("stroke", "steelblue") // Set line color
      .attr("stroke-width", 2)
      .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    svg.append("g")
      .call(yAxis);
  }

    // Fetch amount by expense category
    // this.dataService.getCurrentMonthAmountByExpense(this.userId).subscribe(
    //   expense => {
    //     for (let index = 0; index < expense.length; index++) {
    //       const expenseType = expense[index].expenseType;
    //       const amount = expense[index].total_amount;
    //       this.data.push({ "category": expenseType, "value": amount });
    //     }
    //     this.createSvg();
    //     this.drawPie();
    //   },
    //   error => {
    //     console.error("Error fetching expense data:", error);
    //   }
    // )

    // Fetch income data
    // this.dataService.getIncomeByMonth(this.userId, this.months[currentMonth], year).subscribe(
    //   income => {
    //     this.totalCurrentMonthIncome = income[0].amount;
    //     this.data.push({ "category": "Income", "value": this.totalCurrentMonthIncome });

    //     // Fetch expense data
    //     this.dataService.getCurrentMonthExpense(this.userId).subscribe(
    //       budget => {
    //         this.totalCurrentMonthExpense = budget[0].total_expense;
    //         this.data.push({ "category": "Expense", "value": this.totalCurrentMonthExpense });

    //         // After both income and expense data fetched, draw pie chart
    //         this.createSvg();
    //         this.drawPie();
    //       },
    //       error => {
    //         console.error("Error fetching expense data:", error);
    //       }
    //     );
    //   },
    //   error => {
    //     console.error("Error fetching income data:", error);
    //   }
    // );
  // }

  ngAfterViewInit(): void { }

  // private svg: any;
  // private margin = 50;
  // private width = 500;
  // private height = 400;
  // private radius = Math.min(this.width, this.height) / 2 - this.margin;

  // private createSvg(): void {
  //   this.svg = d3.select("figure#pie")
  //     .append("svg")
  //     .attr("width", this.width)
  //     .attr("height", this.height)
  //     .append("g")
  //     .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
  // }

  // private drawPie(): void {
  //   // Create a pie generator
  //   const pie = d3.pie<any>().value((d: any) => d.value);
  //   const expenseTypes = [...new Set(this.data.map(d => d.category))];
  //   // Generate the arcs
  //   const arc = d3.arc()
  //     .innerRadius(0)
  //     .outerRadius(this.radius);

  //   // Generate arcs for each data point
  //   const arcs = this.svg.selectAll("arc")
  //     .data(pie(this.data))
  //     .enter()
  //     .append("g")
  //     .attr("class", "arc");

  //   const colorScale = d3.scaleOrdinal()
  //     .domain(expenseTypes)
  //     .range(d3.schemeAccent);

  //   arcs.append("path")
  //     .attr("d", arc)
  //     .attr("fill", (d : any) => colorScale(d.data.category));

  //   // Draw each arc
  //   // arcs.append("path")
  //   //   .attr("d", arc)
  //   //   .attr("fill", (d: any) => d.data.category === "Income" ? "#3182bd" : "#d04a35");

  //   // Add labels to the arcs
  //   arcs.append("text")
  //     .attr("transform", (d: any) => "translate(" + arc.centroid(d) + ")")
  //     .attr("text-anchor", "middle")
  //     .text((d: any) => d.data.category);
  // }
}
