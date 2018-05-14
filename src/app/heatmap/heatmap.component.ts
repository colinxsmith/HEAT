import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import { RGBColor } from 'd3';
import { DatamoduleModule } from '../datamodule/datamodule.module';
@Component({
  selector: 'app-heatmap',
  // tslint:disable-next-line:max-line-length
  template: '<input  (input)="colourrange[0] = $event.target.value"  value={{colourrange[0]}}><input (input)="colourrange[1] = $event.target.value"  value={{colourrange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{butName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of diags">{{i}}</option></select>',
  styleUrls: ['./heatmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnInit, DatamoduleModule {
  myData = new DatamoduleModule();
  managerData0 = this.myData.managerData0;
  managerData1 = this.myData.managerData1;
  managerData2 = this.myData.managerData2;
  managerData3 = this.myData.managerData3;
  managerData4 = this.myData.managerData4;
  managerData5 = this.myData.managerData5;
  managerData6 = this.myData.managerData6;
  managerData7 = this.myData.managerData7;
  managerData8 = this.myData.managerData8;
  managerData9 = this.myData.managerData9;
  managerData10 = this.myData.managerData10;
  managerData11 = this.myData.managerData11;
  managerData12 = this.myData.managerData12;
  managerData13 = this.myData.managerData13;
  managerData14 = this.myData.managerData14;
  managerData15 = this.myData.managerData15;
  managerData16 = this.myData.managerData16;
  managerData17 = this.myData.managerData17;
  managerData18 = this.myData.managerData18;
  managerData19 = this.myData.managerData19;
  managerData20 = this.myData.managerData20;
  managerData21 = this.myData.managerData21;
  managerData22 = this.myData.managerData22;
  managerData23 = this.myData.managerData23;
  managerData24 = this.myData.managerData24;
  managerData25 = this.myData.managerData25;
  managerData26 = this.myData.managerData26;
  diags = this.myData.diags;
  managerX: string[] = [];
  managerY: string[] = [];
  managerPlot: {x: number, y: number, value: number}[] = [];

  butName = 'Squares';
  transpose = true;
  squares = true;
  chosenData = this.myData.diags[0];
  pad = true;
  padButt = 'Don\'t pad';
  colourrange = ['rgb(255,255,100)', 'rgb(255,100,0)'];

  constructor() { }
  chooseData(daig) {
    this.chosenData = daig;
    this.ngOnInit();
  }
  managerProcess(dataV: {x: string, y: string, value: number}[]) {
    d3.selectAll('svg').remove();
    const here = this, xmap = {}, ymap = {}, revi = [], revj = [];
    this.managerX = [];
    this.managerY = [];
    this.managerPlot = [];
    let ix = 0, iy = 0, i = 0, j = 0, ij = 0;
    dataV.forEach(function (d) {
      if (!(xmap[d.x] > -1)) {
        here.managerX.push(d.x);
        revi.push(ix);
        xmap[d.x] = ix++;
      }
      if (!(ymap[d.y] > -1)) {
        here.managerY.push(d.y);
        revj.push(iy);
        ymap[d.y] = iy++;
      }
    });
    for (i = 0; i < revi.length; ++i) {
      for (j = 0; j < revj.length; ++j) {
        if (ij < dataV.length && dataV[ij].x === here.managerX[i]
          && dataV[ij].y === here.managerY[j]) {
          here.managerPlot.push({ x: i + 1, y: j + 1, value: dataV[ij++].value });
        } else {
          if (here.pad) { here.managerPlot.push({ x: i + 1, y: j + 1, value: 0 }); }
        }
      }
    }
  }
  ngOnInit() {
    if (this.chosenData === this.myData.diags[0]) {
      this.managerProcess(this.myData.managerData0);
    } else if (this.chosenData === this.myData.diags[1]) {
      this.managerProcess(this.myData.managerData1);
    } else if (this.chosenData === this.myData.diags[2]) {
      this.managerProcess(this.myData.managerData2);
    } else if (this.chosenData === this.myData.diags[3]) {
      this.managerProcess(this.myData.managerData3);
    } else if (this.chosenData === this.myData.diags[4]) {
      this.managerProcess(this.myData.managerData4);
    } else if (this.chosenData === this.myData.diags[5]) {
      this.managerProcess(this.myData.managerData5);
    } else if (this.chosenData === this.myData.diags[6]) {
      this.managerProcess(this.myData.managerData6);
    } else if (this.chosenData === this.myData.diags[7]) {
      this.managerProcess(this.myData.managerData7);
    } else if (this.chosenData === this.myData.diags[8]) {
      this.managerProcess(this.myData.managerData8);
    } else if (this.chosenData === this.myData.diags[9]) {
      this.managerProcess(this.myData.managerData9);
    } else if (this.chosenData === this.myData.diags[10]) {
      this.managerProcess(this.myData.managerData10);
    } else if (this.chosenData === this.myData.diags[11]) {
      this.managerProcess(this.myData.managerData11);
    } else if (this.chosenData === this.myData.diags[12]) {
      this.managerProcess(this.myData.managerData12);
    } else if (this.chosenData === this.myData.diags[13]) {
      this.managerProcess(this.myData.managerData13);
    } else if (this.chosenData === this.myData.diags[14]) {
      this.managerProcess(this.myData.managerData14);
    } else if (this.chosenData === this.myData.diags[15]) {
      this.managerProcess(this.myData.managerData15);
    } else if (this.chosenData === this.myData.diags[16]) {
      this.managerProcess(this.myData.managerData16);
    } else if (this.chosenData === this.myData.diags[17]) {
      this.managerProcess(this.myData.managerData17);
    } else if (this.chosenData === this.myData.diags[18]) {
      this.managerProcess(this.myData.managerData18);
    } else if (this.chosenData === this.myData.diags[19]) {
      this.managerProcess(this.myData.managerData19);
    } else if (this.chosenData === this.myData.diags[20]) {
      this.managerProcess(this.myData.managerData20);
    } else if (this.chosenData === this.myData.diags[21]) {
      this.managerProcess(this.myData.managerData21);
    } else if (this.chosenData === this.myData.diags[22]) {
      this.managerProcess(this.myData.managerData22);
    } else if (this.chosenData === this.myData.diags[23]) {
      this.managerProcess(this.myData.managerData23);
    } else if (this.chosenData === this.myData.diags[24]) {
      this.managerProcess(this.myData.managerData24);
    } else if (this.chosenData === this.myData.diags[25]) {
      this.managerProcess(this.myData.managerData25);
    } else if (this.chosenData === this.myData.diags[26]) {
      this.managerProcess(this.myData.managerData26);
    }
    this.butName = this.squares ? 'Circles' : 'Squares';
    this.setUp(this.managerX, this.managerY, this.managerPlot);
  }

  setPad() {
    this.padButt = this.pad ? 'Pad with zero' : 'Don\'t pad';
    this.pad = !this.pad;
    this.ngOnInit();
  }
  setTrans() {
    this.transpose = !this.transpose;
    this.butName = this.squares ? 'Circles' : 'Squares';
    this.ngOnInit();
  }
  setSquares() {
    this.squares = !this.squares;
    this.butName = this.squares ? 'Circles' : 'Squares';
    this.ngOnInit();
  }

  setUp(xLabels: string[], yLabels: string[], dataXY: {x: number, y: number, value: number}[]) {
    const squares = this.squares,
      transpose = this.transpose,
      labelsXY = { x: [' '], y: [' '] }, heatData: {x: number, y: number, value: number}[] = [];
    if (transpose) {
      labelsXY.x = yLabels;
      labelsXY.y = xLabels;
    } else {
      labelsXY.x = xLabels;
      labelsXY.y = yLabels;
    }
    let buckets = labelsXY.x.length;
    console.log('Number of buckets ' + buckets);
    const margin = { top: 120, right: 0, bottom: 100, left: 130 },
      width = 960 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom,
      gridSize = Math.min(Math.floor(width / labelsXY.x.length), Math.floor(height / labelsXY.y.length));
    const legendElementWidth = gridSize;
    if (labelsXY.x[buckets - 1] === 'Total') {
      buckets--;
    }
    const coloursd = d3.scaleLinear<RGBColor>()
      .domain([0, buckets])
      .range([d3.rgb(this.colourrange[0]), d3.rgb(this.colourrange[1])]),
      colors: RGBColor[] = [];
    labelsXY.x.forEach(function (d, ii) {
      colors[ii] = coloursd(ii);
    });

    const svg = d3.select('app-heatmap').append('svg')
    //  .attr('width', width + margin.left + margin.right)
    //  .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),

      YLabels = svg.selectAll('.yLabel')
        .data(labelsXY.y)
        .enter().append('text')
        .text((d) => d)
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'end')
        .attr('transform', (d, i) => `translate(-5,${(i + 0.6) * gridSize})`)
        .attr('class', 'yLabel mono axis-y'),

      XLabels = svg.selectAll('.xLabel')
        .data(labelsXY.x)
        .enter().append('text')
        .text((d) => d)
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'right')
        .attr('transform', (d, i) => `translate(${(i + 0.55) * gridSize},-5) rotate(270)`)
        .attr('class', 'xLabel mono axis-x'),

    type = (d) => {
      if (transpose) {
        return {
          y: +d.x,
          x: +d.y,
          value: +d.value
        };
      } else {
        return {
          y: +d.y,
          x: +d.x,
          value: +d.value
        };
      }
    }, totalsX = [], totalsY = [], THIS = this,
      heatmapChart = function (circ: boolean) {
        dataXY.forEach(function (d) {
          d = type(d);
          if (labelsXY.y[d.y - 1] === 'Total') {
            totalsY.push(d.value);
          } else if (labelsXY.x[d.x - 1] === 'Total') {
            totalsX.push(d.value);
          } else {
            heatData.push(d);
          }
        });
        const colorScale: d3.ScaleQuantile<RGBColor> = d3.scaleQuantile<RGBColor>()
          .domain([d3.min(heatData, (d: { x: number, y: number, value: number }) => d.value),
             d3.max(heatData, (d: { x: number, y: number, value: number }) => d.value)])
          .range(colors);

        const gridDistribution = svg.selectAll('.values')
          .data(heatData);

        if (circ) {
          gridDistribution.enter().append('circle')
            .attr('cx', (d) => (d.x - 1 + 0.45) * gridSize)
            .attr('cy', (d) => (d.y - 1 + 0.45) * gridSize)
            .attr('class', 'values circle bordered')
            .attr('r', gridSize / 2.5)
            .style('fill', ' ' + colors[Math.floor(buckets / 2)])
            .merge(gridDistribution)
            .transition()
            .duration(200)
            .style('fill', (d) => ' ' + colorScale(d.value));
        } else {
          gridDistribution.enter().append('rect')
            .attr('x', (d) => (d.x - 1) * gridSize)
            .attr('y', (d) => (d.y - 1) * gridSize)
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('class', 'values rect bordered')
            .attr('width', gridSize)
            .attr('height', gridSize)
            .style('fill', ' ' + colors[Math.floor(buckets / 2)])
            .merge(gridDistribution)
            .transition()
            .duration(200)
            .style('fill', (d) => ' ' + colorScale(d.value));
        }
        gridDistribution.exit().remove();

        gridDistribution.enter().append('text')
          .attr('x', (d) => (d.x - 1 + 0.45) * gridSize)
          .attr('y', (d) => (d.y - 1 + 0.45) * gridSize)
          .attr('dy', 3)
          .attr('class', 'datavals')
          .text((d) => ' ' + d.value);

        const totsy = svg.selectAll('.totalsY')
          .data(totalsY).enter().append('g').append('text');

        totsy.attr('x', (d, i) => (i + 0.45) * gridSize)
          .attr('y', labelsXY.y.length * gridSize - 6)
          .attr('class', 'text totalsY')
          .text((d) => d);
        totsy.exit().remove();
        const totsx = svg.selectAll('.totalsX')
          .data(totalsX).enter().append('g').append('text');

        totsx.attr('y', (d, i) => (i + 0.45) * gridSize + 3)
          .attr('x', labelsXY.x.length * gridSize - 25)
          .attr('class', 'text totalsX')
          .text((d) => d);
        totsx.exit().remove();

        const scaleC = [colorScale.domain() [0]];
        colorScale.quantiles().forEach(function(d) {
          scaleC.push(d);
        });
        const legend = svg.selectAll('.legend')
          .data(scaleC);

        const legend_g = legend.enter().append('g')
          .attr('class', 'legend');

        legend_g.append('rect')
          .attr('x', (d, i) => legendElementWidth * i)
          .attr('y', function () {
            return height + ((buckets === labelsXY.x.length) ? gridSize / 2 : gridSize);
          })
          .attr('width', legendElementWidth)
          .attr('height', gridSize / 2)
          .style('fill', function(d, i) {
            return '' + colors[i];
          })
          ;

        legend_g.append('text')
          .attr('class', 'mono')
          .text((d) => '≥ ' + Math.round(d))
          .attr('x', (d, i) => legendElementWidth * i)
          .attr('y', height + gridSize * 1.5);

        legend.exit().remove();

      };

    heatmapChart(squares ? false : true);
  }
}

