import { Component, HostListener, OnInit } from '@angular/core';
import { dataArr } from '../data';
import * as d3 from 'd3';
import { GraphData } from '../graph-data';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  constructor() { }

  data = dataArr;
  private svg: any;
  private margin = 50;
  private width = window.innerWidth - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  dateClicked: Date = new Date();

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }

  showDate(value: any) {
    const date = new Date(value.target.__data__.date);
    this.dateClicked = date;
  }

  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: GraphData[]): void {
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.date))

      /*
      .domain(data.map(d => {
        d.date = new Date(d.date).toLocaleString('en-us', { month: 'long' });
        return d.date;
      }))
      
      */
      .padding(0.2);
      

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "center");
    const y = d3.scaleLinear()
      .domain([0, 300000])
      .range([this.height, 0]);

    this.svg.append("g")
      .call(d3.axisLeft(y));

    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .on("click", (e: any) => this.showDate(e))
      .attr("x", (d: { date: string; }) => x(d.date))
      .attr("y", (d: { value: d3.NumberValue; }) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d: { value: d3.NumberValue; }) => this.height - y(d.value))
      .attr("fill", (d: { color: any; }) => d.color || 'rgb(255, 94, 94)')
  }

  /*
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.width = event.target.innerWidth - (this.margin * 2); 
    this.svg = d3.select("figure#bar > svg").remove();
    this.createSvg();
    this.drawBars(this.data);
  }
  */

}
