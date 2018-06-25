import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { RGBColor } from 'd3';
import { DatamoduleModule } from '../datamodule/datamodule.module';
@Component({
  selector: 'app-heatmap',
  // tslint:disable-next-line:max-line-length
  template: '<button  (click)="ngOnInit()">RUN</button><select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of managerFigure">{{i}}</option></select> No. colours in Large Map<input  (input)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><input  (input)="colourrange[0] = $event.target.value" size="3" maxlength="16"  value={{colourrange[0]}}><input (input)="colourrange[1] = $event.target.value" size="3" maxlength="16"  value={{colourrange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{butName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of managerDataTypes">{{i}}</option></select>',
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
  managerPlot: { x: number, y: number, value: number }[] = [];
  numColours = 25;

  butName = 'Squares';
  transpose = true;
  squares = true;
  chosenData = this.managerDataTypes[0];
  chosenFigure = this.managerFigure[0];
  pad = true;
  padButt = !this.pad ? 'Pad with zero' : 'Don\'t pad';
  colourrange = ['rgb(234,235,236)', 'rgb(245,10,5)', 'cyan', 'yellow', 'lightgreen', 'steelblue', 'rgb(200,100,200)', 'rgb(200,200,100)'];

  constructor() {
    /*  this.managerData.forEach(function (d) { // Remove the numbers from the office group labels (testing)
        d.forEach(function (dd) {
          dd.y = dd.y.replace(/[0-9]/g, '');
        });
      });*/
  }
  chooseData(daig: string) {
    this.chosenData = daig;
    this.ngOnInit();
  }
  chooseFigure(daig: string) {
    this.chosenFigure = daig;
  }
  managerProcess(dataV: { x: string, y: string, value: number }[]) {
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
      if (!(ymap[d.y.replace(/[0-9]/g, '')] > -1)) {
        here.managerY.push(d.y.replace(/[0-9]/g, ''));
        revj.push(iy);
        ymap[d.y.replace(/[0-9]/g, '')] = iy++;
      }
    });
    for (i = 0; i < revi.length; ++i) {
      for (j = 0; j < revj.length; ++j) {
        if (ij < dataV.length && dataV[ij].x === here.managerX[i]
          && dataV[ij].y.replace(/[0-9]/g, '') === here.managerY[j].replace(/[0-9]/g, '')) {
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
      margin = { top: 110, right: 10, bottom: 30, left: 90 },
      width = 1000 - margin.left - margin.right,
      height = 1500 - margin.top - margin.bottom,
      scaleX = d3.scaleLinear<number, number>().domain([0, this.managerDataTypes.length]).range([0, width]),
      scaleY = d3.scaleLinear<number, number>().domain([0, this.managerData[0].length]).range([0, height]),
      svg = d3.select('app-heatmap').append('svg')
        .attr('width', `${width + margin.left + margin.right}`)
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
      .attr('transform', (d, i) => `translate(${margin.left + scaleX(i + 0.65)},${margin.top - 3}) rotate(280)`)
      .attr('class', 'xLabel mono axis-x');

    let pastLabel = '', iL = 1;
    const iOffice: {} = {}; // Find the office numbers
    const YOffice = svg.selectAll('.yLabel0')
      .data(this.managerData[0])
      .enter().append('text')
      .text(function (d) {
        let back = '';
        if (pastLabel !== d.x) {
          pastLabel = d.x;
          back = d.x;
          if (d.y.match(/[0-9]/)) { // Check in case the data has a number in the office name
            iOffice[back] = '';
          } else {
            iOffice[back] = iL++;
          }
        }
        return back;
      })
      .attr('x', -20 * Math.cos(Math.PI / 180 * 40))
      .attr('y', -20 * Math.sin(Math.PI / 180 * 40))
      .style('text-anchor', 'end')
      .attr('transform', (d, i) => `translate(${margin.left}, ${margin.top + scaleY(i + 1)}) rotate(-40)`)
      .attr('class', 'yLabel mono axis-y');
    console.log(iOffice);

    const YOfficeGroups = svg.selectAll('.yLabel1')
      .data(this.managerData[0])
      .enter().append('text')
      .text((d) => d.y)
      .attr('x', -10)
      .attr('y', 0)
      .style('text-anchor', 'end')
      .attr('transform', (d, i) => `translate(${margin.left},${margin.top + scaleY(i + 1)})`)
      .attr('class', 'yLabel mono axis-y');

    YOfficeGroups.style('font-size', '' + (+YOfficeGroups.style('font-size').replace('px', '') * 0.66) + 'px');

    // Daryl's "heat map" is plotted as a load of verticle heat map strips, each with its own scale

    const localThis = this;
    this.managerData.forEach(function (di, ix) {
      const ixx = ix % (localThis.colourrange.length - 1);
      const coloursd = d3.scaleLinear<RGBColor, RGBColor>()
        .domain([0, localThis.numColours - 1])
        .range([d3.rgb(localThis.colourrange[(ixx > 0 ? ixx + 1 : ixx) % localThis.colourrange.length]), d3.rgb(localThis.colourrange[1])]),
      colours: RGBColor[] = [];
    for (let i = 0; i < localThis.numColours; ++i) {
      colours[i] = coloursd(i);
    }
      const colorScale = d3.scaleQuantile<RGBColor>()
        .domain([d3.min(di, (d: { x: string, y: string, value: number }) => d.value),
        d3.max(di, (d: { x: string, y: string, value: number }) => d.value)])
        .range(colours);
      const colourMap = svg.selectAll('.map' + ix)
        .data(di)
        .enter().append('rect')
        .attr('x', (dd) => margin.left + scaleX(ix))
        .attr('y', (dd, i) => margin.top + scaleY(i))
        .attr('rx', 0)
        .attr('ry', 0)
        .attr('class', 'values rect bordered')
        .attr('width', width / localThis.managerDataTypes.length)
        .attr('height', height / di.length)
        .style('fill', ' ' + colours[0])
        .on('mouseover', function (dd) {
          tooltip.style('opacity', 0.9);
          tooltip
            .html(`${dd.x} Office<br>${localThis.managerDataTypes[ix]}<br>${dd.y + iOffice[dd.x]} Team<br>${dd.value}`)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY - 28}px`);
        })
        .on('mouseout', (dd) => tooltip.style('opacity', 0));
        colourMap.merge(colourMap)
        .transition()
        .duration(200)
        .style('fill', (dd) => ' ' + colorScale(dd.value));
    });
  }
  setPad() {
    this.pad = !this.pad;
    this.padButt = !this.pad ? 'Pad with zero' : 'Don\'t pad';
    this.ngOnInit();
  }
  setTrans() {
    this.transpose = !this.transpose;
    this.ngOnInit();
  }
  setSquares() {
    this.squares = !this.squares;
    this.butName = this.squares ? 'Circles' : 'Squares';
    this.ngOnInit();
  }

  setUp(xLabels: string[], yLabels: string[], dataXY: { x: number, y: number, value: number }[]) {
    const squares = this.squares,
      transpose = this.transpose,
      labelsXY = { x: [' '], y: [' '] }, heatData: { x: number, y: number, value: number }[] = [];
    if (transpose) {
      labelsXY.x = yLabels;
      labelsXY.y = xLabels;
    } else {
      labelsXY.x = xLabels;
      labelsXY.y = yLabels;
    }
    let buckets = labelsXY.x.length;
    console.log('Number of buckets ' + buckets);
    const margin = { top: 30, right: 0, bottom: 10, left: 130 },
      legendSize = 100,
      width = 1000 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom - legendSize,
      gridSize = Math.min(Math.floor(width / labelsXY.x.length), Math.floor(height / labelsXY.y.length)),
      legendElementWidth = gridSize;
    if (labelsXY.x[buckets - 1] === 'Total') {
      buckets--;
    }
    const coloursd = d3.scaleLinear<RGBColor>()
      .domain([0, buckets - 1])
      .range([d3.rgb(this.colourrange[0]), d3.rgb(this.colourrange[1])]),
      colours: RGBColor[] = [];
    for (let ii = 0; ii < buckets; ii++) {
      colours[ii] = coloursd(ii);
    }

    const tooltip = d3.select('body').append('g').attr('class', 'toolTip'),
      svg = d3.select('app-heatmap').append('svg')
        /* .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + legendSize)*/
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom + legendSize}`)
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
      type = (d: { x: number, y: number, value: number }) => transpose ?
        { y: +d.x, x: +d.y, value: +d.value } :
        { y: +d.y, x: +d.x, value: +d.value }
      , totalsX = [], totalsY = [],
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
        const colorScale = d3.scaleQuantile<RGBColor>()
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
            .attr('r', gridSize / 2)
            .style('fill', ' ' + colours[Math.floor(buckets / 2)])
            .on('mouseover', function (d) {
              tooltip.style('opacity', 0.9);
              tooltip
                .html(`${labelsXY.x[d.x - 1]}<br>${labelsXY.y[d.y - 1]}<br>${d.value}`)
                .style('left', `${d3.event.pageX}px`)
                .style('top', `${d3.event.pageY - 28}px`);
            })
            .on('mouseout', (d) => tooltip.style('opacity', 0))
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
            .on('mouseover', function (d) {
              tooltip.style('opacity', 0.9);
              tooltip
                .html(`${labelsXY.x[d.x - 1]}<br>${labelsXY.y[d.y - 1]}<br>${d.value}`)
                .style('left', `${d3.event.pageX}px`)
                .style('top', `${d3.event.pageY - 28}px`);
            })
            .on('mouseout', (d) => tooltip.style('opacity', 0))
            .merge(gridDistribution)
            .transition()
            .duration(200)
            .style('fill', (d) => ' ' + colorScale(d.value))
            ;
        }
        gridDistribution.enter().append('text')
          .attr('x', (d) => (d.x - 1 + 0.45) * gridSize)
          .attr('y', (d) => (d.y - 1 + 0.45) * gridSize)
          .attr('dy', 3)
          .attr('class', 'datavals')
          .text((d) => ' ' + d.value)
          ;
        const totsy = svg.selectAll('.totalsY')
          .data(totalsY).enter().append('g').append('text');
        totsy.attr('x', (d, i) => (i + 0.45) * gridSize)
          .attr('y', labelsXY.y.length * gridSize - 6)
          .attr('class', 'text totalsY')
          .text((d) => d);
        const totsx = svg.selectAll('.totalsX')
          .data(totalsX).enter().append('g').append('text');
        totsx.attr('y', (d, i) => (i + 0.45) * gridSize + 3)
          .attr('x', labelsXY.x.length * gridSize - 25)
          .attr('class', 'text totalsX')
          .text((d) => d);
        const doLegend = true;
        if (doLegend) {
          const scaleC = [colorScale.domain()[0]];
          colorScale.quantiles().forEach(function (d) {
            scaleC.push(d);
          });
          const legend = svg.selectAll('.legend')
            .data(scaleC);

          const legend_g = legend.enter().append('g')
            .attr('class', 'legend');
          legend_g.append('rect')
            .attr('x', (d, i) => legendElementWidth * i)
            .attr('y', (labelsXY.y.length + 0.25) * gridSize)
            .attr('width', legendElementWidth)
            .attr('height', legendSize / 2)
            .style('fill', function (d, i) {
              return '' + colours[i];
            })
            .on('mouseover', function (d) {
              tooltip.style('opacity', 0.9);
              tooltip
                .html(`${d}`)
                .style('left', `${d3.event.pageX}px`)
                .style('top', `${d3.event.pageY - 28}px`);
            })
            .on('mouseout', (d) => tooltip.style('opacity', 0));
          legend_g.append('text')
            .attr('class', 'legend')
            .text((d) => '\uf105 ' + /* '≥ '*/ + (Math.abs(d) > 1 ? Math.round(d) : Math.round(d * 100) / 100))
            .attr('x', (d, i) => legendElementWidth * (i + 0.25))
            .attr('y',  (labelsXY.y.length + 0.25) * gridSize + legendSize / 4);
        }
      };
    heatmapChart(squares ? false : true);
  }
}

