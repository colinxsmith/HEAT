import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import { RGBColor } from 'd3';
import { DatamoduleModule } from '../datamodule/datamodule.module';
@Component({
  selector: 'app-heatmap',
  // tslint:disable-next-line:max-line-length
  template: '<button  (click)="ngOnInit()">RUN</button><select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of managerFigure">{{i}}</option></select><input  (input)="colourrange[0] = $event.target.value"  value={{colourrange[0]}}><input (input)="colourrange[1] = $event.target.value"  value={{colourrange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{butName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of managerDataTypes">{{i}}</option></select>',
  styleUrls: ['./heatmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnInit, DatamoduleModule {
  myData = new DatamoduleModule();
  managerDataTypes = this.myData.managerDataTypes;
  managerFigure = ['Heat Map', 'Large Map'];
  managerData = this.myData.managerData;
  managerX: string[] = [];
  managerY: string[] = [];
  managerPlot: {x: number, y: number, value: number}[] = [];

  butName = 'Squares';
  transpose = true;
  squares = true;
  chosenData = this.managerDataTypes[0];
  chosenFigure = this.managerFigure[0];
  pad = true;
  padButt = 'Don\'t pad';
  colourrange = ['rgb(255,255,100)', 'rgb(255,100,0)'];

  constructor() { }
  chooseData(daig) {
    this.chosenData = daig;
    this.ngOnInit();
  }
  chooseFigure(daig) {
    this.chosenFigure = daig;
  }
  managerProcess(dataV: {x: string, y: string, value: number}[]) {
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
    const localThis = this;
    d3.selectAll('svg').remove();
    if (this.chosenFigure === this.managerFigure[0]) {
    localThis.managerDataTypes.forEach(function (d, i) {
        if (localThis.chosenData === d) {
          localThis.managerProcess(localThis.managerData[i]);
        }
      });
      this.butName = this.squares ? 'Circles' : 'Squares';
      this.setUp(this.managerX, this.managerY, this.managerPlot);
    } else if (this.chosenFigure === this.managerFigure[1]) {
      this.largeMap();
    }
   }

  largeMap() {
    const tooltip = d3.select('body').append('g').attr('class', 'toolTip'),
      coloursd = d3.scaleLinear<RGBColor>()
        .domain([0, this.managerData[0].length])
        .range([d3.rgb(this.colourrange[0]), d3.rgb(this.colourrange[1])]),
      colours: RGBColor[] = [];
    this.managerData[0].forEach(function (d, i) {
      colours[i] = coloursd(i);
    });
    const margin = { top: 105, right: 10, bottom: 10, left: 90 },
      width = 960 - margin.left - margin.right,
      height = 1500 - margin.top - margin.bottom,
      svg = d3.select('app-heatmap').append('svg').attr('width', `${width + margin.left + margin.right}`)
      .attr('height', `${height + margin.bottom + margin.top}`);
     svg.append('rect').attr('width', `${width + margin.left + margin.right}`)
     .attr('height', `${height + margin.bottom + margin.top}`).attr('x', 0).attr('y', '0').attr('class', 'rim');
     svg.append('rect').attr('width', width).attr('height', height)
     .attr('x', `${margin.left}`).attr('y', `${margin.top}`).attr('class', 'rim');
     const XLabels = svg.selectAll('.xLabel')
     .data(this.managerDataTypes)
     .enter().append('text')
     .text((d) => d)
     .attr('x', 0)
     .attr('y', 0)
     .style('text-anchor', 'right')
     .attr('transform', (d, i) => `translate(${margin.left + (i + 0.65) * width / this.managerDataTypes.length}
     ,${margin.top - 3}) rotate(280)`)
     .attr('class', 'xLabel mono axis-x');

     let pastLabel = '';
     const YOffice = svg.selectAll('.yLabel0')
     .data(this.managerData[0])
       .enter().append('text')
       .text(function (d) {
         let back = '';
         if (pastLabel !== d.x) {
           pastLabel = d.x;
           back = d.x;
          }
       return back;
     })
     .attr('x', 0)
     .attr('y', 0)
     .style('text-anchor', 'end')
     .attr('transform', (d, i) => `translate(${margin.left - 30},
      ${margin.top + (i + 1) * height / this.managerData[0].length}) rotate(-30)`)
     .attr('class', 'yLabel mono axis-y');

     const YOfficeGroups = svg.selectAll('.yLabel1')
     .data(this.managerData[0])
     .enter().append('text')
     .text((d) => d.y)
     .attr('x', 0)
     .attr('y', 0)
     .style('text-anchor', 'end')
     .attr('transform', (d, i) => `translate(${margin.left - 10},${margin.top + (i + 1) * height / this.managerData[0].length})`)
     .attr('class', 'yLabel mono axis-y');
     YOfficeGroups.style('font-size', '' + (+YOfficeGroups.style('font-size').replace('px', '') * 0.66) + 'px');

    const localThis = this;
    this.managerData.forEach(function (di, ix) {
      const colorScale: d3.ScaleQuantile<RGBColor> = d3.scaleQuantile<RGBColor>()
        .domain([d3.min(di, (d: { x: string, y: string, value: number }) => d.value),
        d3.max(di, (d: { x: string, y: string, value: number }) => d.value)])
        .range(colours);
      const colourMap = svg.selectAll('.map' + ix)
        .data(di);
      colourMap.enter().append('rect')
        .attr('x', (dd) => margin.left + ix * width / localThis.managerDataTypes.length)
        .attr('y', (dd, ii) => margin.top + ii * height / di.length )
        .attr('rx', 0)
        .attr('ry', 0)
        .attr('class', 'values rect bordered')
        .attr('width', width / localThis.managerDataTypes.length)
        .attr('height', height / di.length)
        .style('fill', ' ' + colours[0])
        .on('mouseover', function (dd) {
          tooltip.style('opacity', 0.9);
          tooltip
            .html(`${dd.x}<br>${localThis.managerDataTypes[ix]}<br>${dd.y}<br>${dd.value}`)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY - 28}px`);
        })
        .on('mouseout', function (dd) {
          tooltip.style('opacity', 0);
        })
        .merge(colourMap)
        .transition()
        .duration(200)
        .style('fill', (dd) => ' ' + colorScale(dd.value))
        ;
    });

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
      height = 500 - margin.top - margin.bottom,
      gridSize = Math.min(Math.floor(width / labelsXY.x.length), Math.floor(height / labelsXY.y.length));
    const legendElementWidth = gridSize;
    if (labelsXY.x[buckets - 1] === 'Total') {
      buckets--;
    }
    const coloursd = d3.scaleLinear<RGBColor>()
      .domain([0, buckets])
      .range([d3.rgb(this.colourrange[0]), d3.rgb(this.colourrange[1])]),
      colours: RGBColor[] = [];
    labelsXY.x.forEach(function (d, ii) {
      colours[ii] = coloursd(ii);
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
          .range(colours);

        const gridDistribution = svg.selectAll('.values')
          .data(heatData);

        if (circ) {
          gridDistribution.enter().append('circle')
            .attr('cx', (d) => (d.x - 1 + 0.45) * gridSize)
            .attr('cy', (d) => (d.y - 1 + 0.45) * gridSize)
            .attr('class', 'values circle bordered')
            .attr('r', gridSize / 2.5)
            .style('fill', ' ' + colours[Math.floor(buckets / 2)])
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
            .style('fill', ' ' + colours[Math.floor(buckets / 2)])
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
            return '' + colours[i];
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

