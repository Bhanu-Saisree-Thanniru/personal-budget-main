import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../../../../data.service';
import { AuthenticationService } from '../../../authentication.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, AfterViewInit {
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
    this.dataService.expenseData$.subscribe(
      value => {
        if (value) {
          this.fetchData();
      }
    }
    )
    //this.fetchData();
  }

  fetchData(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Fetch amount by expense category
    this.dataService.getCurrentMonthAmountByExpense(this.userId).subscribe(
      expense => {
        this.data = [];
        for (let index = 0; index < expense.length; index++) {
          const expenseType = expense[index].expenseType;
          const amount = expense[index].total_amount;
          this.data.push({ "category": expenseType, "value": amount });
        }
        d3.select("figure#pie").selectAll("*").remove();
        this.createSvg();
        this.drawPie();
      },
      error => {
        console.error("Error fetching expense data:", error);
      }
    )

    // Fetch income data
    // this.dataService.getIncomeByMonth(this.userId, this.months[currentMonth], year).subscribe(
    //   income => {
    //     this.totalCurrentMonthIncome = income[0].amount;
    //     this.data.push({ "category": "Income", "value": this.totalCurrentMonthIncome });

        // Fetch expense data
      //   this.dataService.getCurrentMonthExpense(this.userId).subscribe(
      //     budget => {
      //       this.totalCurrentMonthExpense = budget[0].total_expense;
      //       this.data.push({ "category": "Expense", "value": this.totalCurrentMonthExpense });

      //       // After both income and expense data fetched, draw pie chart
      //       this.createSvg();
      //       this.drawPie();
      //     },
      //     error => {
      //       console.error("Error fetching expense data:", error);
      //     }
      //   );
      // },
      // error => {
      //   console.error("Error fetching income data:", error);
      // }
  //});
  }

  ngAfterViewInit(): void { }

  private svg: any;
  private margin = 50;
  private width = 500;
  private height = 400;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
  }

  private drawPie(): void {
    // Create a pie generator
    const pie = d3.pie<any>().value((d: any) => d.value);
    const expenseTypes = [...new Set(this.data.map(d => d.category))];
    // Generate the arcs
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    // Generate arcs for each data point
    const arcs = this.svg.selectAll("arc")
      .data(pie(this.data))
      .enter()
      .append("g")
      .attr("class", "arc");

    const colorScale = d3.scaleOrdinal()
      .domain(expenseTypes)
      .range(d3.schemeAccent);

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", (d : any) => colorScale(d.data.category));

    // Draw each arc
    // arcs.append("path")
    //   .attr("d", arc)
    //   .attr("fill", (d: any) => d.data.category === "Income" ? "#3182bd" : "#d04a35");

    // Add labels to the arcs
    arcs.append("text")
      .attr("transform", (d: any) => "translate(" + arc.centroid(d) + ")")
      .attr("text-anchor", "middle")
      .text((d: any) => d.data.category);
  }
}
