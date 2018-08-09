import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
// import { RGBColor } from 'd3';
import { DatamoduleModule } from '../datamodule/datamodule.module';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-heatmap',
  // tslint:disable-next-line:max-line-length
  template: '<select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of managerFigure">{{i}}</option></select> No. colours in Large Map<input  (input)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><input  (input)="colourrange[0] = $event.target.value" size="3" maxlength="16"  value={{colourrange[0]}}><input (input)="colourrange[1] = $event.target.value" size="3" maxlength="16"  value={{colourrange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{buttonName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of this.myData.managerDataTypes">{{i}}</option></select>',
  // tslint:disable-next-line:max-line-length
  //  template: '<button  (click)="ngOnInit()">RUN</button><select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of managerFigure">{{i}}</option></select> No. colours in Large Map<input  (input)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><input  (input)="colourrange[0] = $event.target.value" size="3" maxlength="16"  value={{colourrange[0]}}><input (input)="colourrange[1] = $event.target.value" size="3" maxlength="16"  value={{colourrange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{buttonName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of managerDataTypes">{{i}}</option></select>',
  styleUrls: ['./heatmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnInit {
  myData = new DatamoduleModule();
  managerFigure = ['Heat Map', 'Large Map'].reverse();
  tooltip = AppComponent.toolTipStatic;
  managerX: string[] = [];
  managerY: string[] = [];
  managerPlot: { x: number, y: number, value: number }[] = [];
  numColours = 25;
  buttonName = 'Squares';
  transpose = true;
  squares = true;
  viewbox = true; // Use viewBox attribute for setting width and height (no good on IE)
  chosenData = this.myData.managerDataTypes[0];
  chosenFigure = this.managerFigure[0];
  pad = true;
  padButt = !this.pad ? 'Pad with zero' : 'Don\'t pad';
  colourrange = ['rgb(234,235,236)', 'rgb(245,10,5)'];
  // , 'cyan', 'yellow', 'lightgreen', 'steelblue', 'rgb(200,100,200)', 'rgb(200,200,100)'];
  constructor() {
    this.myData.managerData.forEach((d) => { // Remove the numbers from the office group labels (testing)
      d.forEach((dd) => {
        dd.y = dd.y.replace(/[0-9]/g, '');
      });
    });
  }
  chooseData(daig: string) {
    this.chosenData = daig;
    this.ngOnInit();
  }
  chooseFigure(daig: string) {
    this.chosenFigure = daig;
    this.ngOnInit();
  }
  managerProcess(dataV: { x: string, y: string, value: number }[]) {
    const here = this, xmap = {}, ymap = {};
    this.managerX = [];
    this.managerY = [];
    this.managerPlot = [];
    let nx = 0, ny = 0, ij = 0;
    dataV.forEach((d) => {
      if (!(xmap[d.x] > -1)) {
        here.managerX.push(d.x);
        xmap[d.x] = nx++;
      }
      if (!(ymap[d.y.replace(/[0-9]/g, '')] > -1)) {
        here.managerY.push(d.y.replace(/[0-9]/g, ''));
        ymap[d.y.replace(/[0-9]/g, '')] = ny++;
      }
    });
    for (let i = 0; i < nx; ++i) {
      for (let j = 0; j < ny; ++j) {
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
    d3.selectAll('svg').remove();
    if (this.chosenFigure === 'Heat Map') {
      this.myData.managerDataTypes.forEach((d, i) => {
        if (this.chosenData === d) {
          this.managerProcess(this.myData.managerData[i]);
        }
      });
      this.buttonName = this.squares ? 'Circles' : 'Squares';
      this.setUp(this.managerX, this.managerY, this.managerPlot);
    } else if (this.chosenFigure === 'Large Map') {
      this.largeMap(this.myData.managerDataTypes, this.myData.managerData);
    }
  }
  largeMap(managerDataTypes: string[], managerData: {x: string; y: string; value: number; }[][]) {
    const margin = { top: 110, right: 10, bottom: 30, left: 90 },
      width = 1000 - margin.left - margin.right,
      height = 1500 - margin.top - margin.bottom,
      scaleX = d3.scaleLinear().domain([0, managerDataTypes.length]).range([0, width]),
      scaleY = d3.scaleLinear().domain([0, managerData[0].length]).range([0, height]),
      svg = d3.select('app-heatmap').append('svg')
        .attr('width', `${width + margin.left + margin.right}`)
        .attr('height', `${height + margin.bottom + margin.top}`);
    svg.append('rect').attr('width', `${width + margin.left + margin.right}`)
      .attr('height', `${height + margin.bottom + margin.top}`).attr('x', '0').attr('y', '0').attr('class', 'rim');
    svg.append('rect').attr('width', width).attr('height', height)
      .attr('x', `${margin.left}`).attr('y', `${margin.top}`).attr('class', 'rim');
    const magnify = svg.append('g'), XLabels = svg.selectAll('.xLabel')
      .data(managerDataTypes)
      .enter().append('text')
      .text((d) => d)
      .attr('x', 0)
      .attr('y', 0)
      .style('text-anchor', 'right')
      .attr('transform', (d, i) => `translate(${margin.left + scaleX(i + 0.65)},${margin.top - 3}) rotate(280)`)
      .attr('class', 'axis-x');
    let pastLabel = '', nL = 1;
    const iOffice: {} = {}; // Find the office numbers
    const YOffice = svg.selectAll('.yLabel0')
      .data(managerData[0])
      .enter().append('text')
      .text((d) => {
        let back = '';
        if (pastLabel !== d.x) {
          pastLabel = d.x;
          back = d.x;
          if (d.y.match(/[0-9]/)) { // Check to see whether the data has already got a number in the office name
            iOffice[back] = '';
          } else {
            iOffice[back] = nL++;
          }
        }
        return back;
      })
      .attr('x', -20 * Math.cos(Math.PI / 180 * 40))
      .attr('y', -20 * Math.sin(Math.PI / 180 * 40))
      .style('text-anchor', 'end')
      .attr('transform', (d, i) => `translate(${margin.left}, ${margin.top + scaleY(i + 1)}) rotate(-40)`)
      .attr('class', 'axis-y');
    console.log(iOffice);
    const YOfficeGroups = svg.selectAll('.yLabel1')
      .data(managerData[0])
      .enter().append('text')
      .text((d) => d.y)
      .attr('x', -10)
      .attr('y', 0)
      .style('text-anchor', 'end')
      .attr('transform', (d, i) => `translate(${margin.left},${margin.top + scaleY(i + 1)})`)
      .attr('class', 'axis-y');
    YOfficeGroups.style('font-size', '' + (+YOfficeGroups.style('font-size').replace('px', '') * 0.66) + 'px');

    // Daryl's "heat map" is plotted as a load of verticle heat map strips, each with its own scale

    const colouredRectangles: d3.Selection<d3.BaseType, { x: string, y: string, value: number }, d3.BaseType, {}>[] = [];
    managerData.forEach((di, ix) => {
      const ixx = ix % (this.colourrange.length - 1);
      const coloursd = d3.scaleLinear<d3.RGBColor, d3.RGBColor>()
        .domain([0, this.numColours - 1])
        .range([d3.rgb(this.colourrange[(ixx > 0 ? ixx + 1 : ixx) % this.colourrange.length]), d3.rgb(this.colourrange[1])]),
        colours: d3.RGBColor[] = [];
      for (let i = 0; i < this.numColours; ++i) {
        colours[i] = coloursd(i);
      }
      const colourScale = d3.scaleQuantile<d3.RGBColor>()
        .domain([d3.min(di, (d: { x: string, y: string, value: number }) => d.value),
        d3.max(di, (d: { x: string, y: string, value: number }) => d.value)])
        .range(colours);
      colouredRectangles[ix] = svg.selectAll('.rect')
        .data(di)
        .enter().append('rect')
        .attr('x', (dd) => margin.left + scaleX(ix))
        .attr('y', (dd, i) => margin.top + scaleY(i))
        .attr('width', width / managerDataTypes.length)
        .attr('height', height / di.length)
        .style('fill', (dd) => `${colourScale(dd.value)}`)
        .on('mouseover', (dd) => this.tooltip
          // tslint:disable-next-line:max-line-length
          .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${dd.x} Office<br>${managerDataTypes[ix]}<br>${dd.y + iOffice[dd.x]} Team<br>${dd.value}`)
          .style('left', `${margin.left}px`)
          .style('top', `${d3.event.pageY - 28}px`)
          .style('opacity', 1)
        )
        .on('click', (dd, i) => clicker(di, i))
        .on('mouseout', () => this.tooltip.style('opacity', 0));
    });
    const highlite = svg.append('g').append('rect'),
      datamagbase = magnify.selectAll('.mag').data(colouredRectangles).enter().append('g'),
      doDatamag = true, magnifyBorder = magnify.append('rect'),
      datamag = datamagbase.append('rect'),
      datamagLab = datamagbase.append('text'),
      clicker = (di: { x: string, y: string, value: number }[], i: number) => {
        const hh = height / di.length, doBig = i !== -1;
        highlite
          .attr('x', `${margin.left + scaleX(0)}`)
          .attr('class', 'HL')
          .attr('width', width)
          .attr('height', doBig ? hh : height)
          .style('fill', 'none')
          .style('opacity', '0')
          .transition().duration(100)
          .attr('y', `${margin.top + scaleY(doBig ? i : 0)}`)
          .style('opacity', '1');
        if (doDatamag) {
          const heightHere = 100;
          if (doBig) {
            datamag
              .attr('class', 'mag')
              .attr('y', 4)
              .style('fill', 'rgb(5, 247, 236)')
              .on('mouseover', (d, id) =>
                this.tooltip
                  .style('left', `${d3.event.pageX}px`)
                  .style('top', `${d3.event.pageY}px`)
                  .style('opacity', 1)
                  // tslint:disable-next-line:max-line-length
                  .html(`<a class="fa fa-gears leafy"></a>${managerData[id][i].x}<br>${managerData[id][i].y}<br>${managerDataTypes[id]}<br>${managerData[id][i].value}`)
              )
              .on('mouseout', () => this.tooltip.style('opacity', 0));
            datamag.transition().duration(1500)
              .tween('', (d, k, HH) => {
                return (t: number) => {
                  const transformParameter = (parm: number) => 0.5 * width * (1 - t) * (1 - t) * (1 - t) + t * t * t * parm,
                    x = transformParameter(+(d3.select(d.nodes()[i]).attr('x').replace('px', ''))),
                    w = transformParameter(+(d3.select(d.nodes()[i]).attr('width').replace('px', '')));
                  d3.select(HH[k])
                    .attr('x', `${x}px`)
                    .attr('width', `${w}px`)
                    .attr('height', `${transformParameter(heightHere)}px`)
                    .style('opacity', `${t}`);
                };
              })
              .style('fill', (d) => d3.select(d.nodes()[i]).style('fill'));
            datamagLab
              .attr('x', 0)
              .attr('y', 0)
              .style('opacity', 0)
              .attr('class', 'totalsX')
              .text((d, labIndex) => `${managerData[labIndex][i].value}`)
              .transition().duration(1500)
              .tween('', (d, labIndex, datamagRef) => {
                const dt = +d3.select(d.nodes()[i]).attr('x').replace('px', '') +
                  +d3.select(d.nodes()[i]).attr('width').replace('px', '') / 2;
                return (t: number) => d3.select(datamagRef[labIndex])
                  .attr('transform', `translate(${dt} , ${heightHere / 2}) rotate(${-270 * (1 - Math.sqrt(t))})`)
                  .style('opacity', `${Math.sqrt(t)}`);
              }).on('mouseover', (d, id) =>
                this.tooltip
                  .style('left', `${d3.event.pageX}px`)
                  .style('top', `${d3.event.pageY}px`)
                  .style('opacity', 1)
                  // tslint:disable-next-line:max-line-length
                  .html(`<a class="fa fa-gears leafy"></a>${managerData[id][i].x}<br>${managerData[id][i].y}<br>${managerDataTypes[id]}<br>${managerData[id][i].value}`)
              )
              .on('mouseout', () => this.tooltip.style('opacity', 0));
            magnifyBorder
              .attr('x', margin.left)
              .attr('y', 4)
              .attr('width', width)
              .attr('height', 90)
              .style('shape-rendering', 'crispEdges')
              .style('fill', 'none')
              .style('stroke-width', 4)
              .style('stroke', 'brown');
          } else {
            datamag.style('fill', 'none');
            datamagLab.text('');
            magnifyBorder.style('stroke', 'none');
          }
        }
      }, rectH = svg.append('rect')
        .attr('x', margin.left)
        .attr('y', margin.top)
        .attr('width', width)
        .attr('height', height)
        .style('stroke-width', 4)
        .style('stroke', 'cyan')
        .style('fill', 'none')
        .style('opacity', 0)
        .on('mouseout', () => clicker(managerData[0], -1))
        .on('click', () => clicker(managerData[0], -1));
    clicker(managerData[0], -1);
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
    this.buttonName = this.squares ? 'Circles' : 'Squares';
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
    let buckets = labelsXY.x.length, legendSize = 50;
    console.log('Number of buckets ' + buckets);
    const margin = { top: transpose ? 30 : 60, right: 0, bottom: 10, left: 130 },
      width = 1000 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom - legendSize,
      gridSize = Math.min(Math.floor(width / labelsXY.x.length), Math.floor(height / labelsXY.y.length)),
      legendElementWidth = gridSize;
    legendSize = Math.min(legendSize, legendElementWidth);
    if (labelsXY.x[buckets - 1] === 'Total') {
      buckets--;
    }
    const coloursd = d3.scaleLinear<d3.RGBColor>()
      .domain([0, buckets - 1])
      .range([d3.rgb(this.colourrange[0]), d3.rgb(this.colourrange[1])]), colours: d3.RGBColor[] = [],
      svgheat = d3.select('app-heatmap').append('svg');
    for (let i = 0; i < buckets; i++) {
      colours[i] = coloursd(i);
    }
    if (this.viewbox) {
      svgheat.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom + legendSize}`);
    } else {
      svgheat.attr('width', width + margin.left + margin.right);
      svgheat.attr('height', height + margin.top + margin.bottom + legendSize);
    }
    const svg = svgheat
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
        .attr('class', 'axis-y'),
      XLabels = svg.selectAll('.xLabel')
        .data(labelsXY.x)
        .enter().append('text')
        .text((d) => d)
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'right')
        .attr('transform', (d, i) => `translate(${(i + 0.55) * gridSize},-5) rotate(270)`)
        .attr('class', 'axis-x'),
      tableTranspose = (d: { x: number, y: number, value: number }) => transpose ?
        { y: +d.x, x: +d.y, value: +d.value } :
        { y: +d.y, x: +d.x, value: +d.value }
      , totalsX = [], totalsY = [],
      heatmapChart = (circ: boolean) => {
        dataXY.forEach((d) => {
          d = tableTranspose(d);
          if (labelsXY.y[d.y - 1] === 'Total') {
            totalsY.push(d.value);
          } else if (labelsXY.x[d.x - 1] === 'Total') {
            totalsX.push(d.value);
          } else {
            heatData.push(d);
          }
        });
        const colourScale = d3.scaleQuantile<d3.RGBColor>()
          .domain([d3.min(heatData, (d: { x: number, y: number, value: number }) => d.value),
          d3.max(heatData, (d: { x: number, y: number, value: number }) => d.value)])
          .range(colours);
        const gridDistribution = svg.selectAll('.values')
          .data(heatData);
        let painKiller: d3.Selection<d3.BaseType, { x: number; y: number; value: number; }, d3.BaseType, {}>;
        if (circ) {
          painKiller = gridDistribution.enter().append('circle')
            .attr('cx', width * 0.5)
            .attr('cy', height * 0.5)
            .attr('r', gridSize / 8);
        } else {
          painKiller = gridDistribution.enter().append('rect')
            .attr('x', (d) => Math.min(d.y * gridSize, Math.random() * width))
            .attr('y', (d) => Math.min(d.x * gridSize, Math.random() * height))
            .attr('width', gridSize)
            .attr('height', gridSize);
        }
        painKiller
          .attr('class', 'bordered')
          .on('mouseover', (d) => this.tooltip
            // tslint:disable-next-line:max-line-length
            .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${labelsXY.x[d.x - 1]}<br>${labelsXY.y[d.y - 1]}<br>${d.value}`)
            .style('opacity', 0.9)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY - 28}px`)
          )
          .on('mouseout', () => this.tooltip.style('opacity', 0))
          .transition()
          .duration(1000)
          .attr('x', (d) => (d.x - 1) * gridSize)
          .attr('y', (d) => (d.y - 1) * gridSize)
          .attr('cx', (d) => (d.x - 1 + 0.45) * gridSize)
          .attr('cy', (d) => (d.y - 1 + 0.45) * gridSize)
          .attr('r', gridSize / 2)
          .style('fill', (d) => `${colourScale(d.value)}`);
        gridDistribution.enter().append('text')
          .attr('transform', (d) => `translate(${(d.x - 1) * gridSize}, ${(d.y - 1) * gridSize}) rotate(135)`)
          .attr('dy', 3)
          .attr('class', 'datavals')
          .text((d) => `${d.value}`)
          .transition().duration(1000)
          .attr('transform', (d) => `translate(${(d.x - 1 + 0.45) * gridSize}, ${(d.y - 1 + 0.45) * gridSize}) rotate(0)`);
        const totsy = svg.selectAll('.totalsY')
          .data(totalsY).enter().append('g').append('text');
        totsy.attr('x', (d, i) => (i + 0.45) * gridSize)
          .attr('y', labelsXY.y.length * gridSize - 6)
          .attr('class', 'totalsY')
          .text((d) => d);
        const totsx = svg.selectAll('.totalsX')
          .data(totalsX).enter().append('g').append('text');
        totsx.attr('y', (d, i) => (i + 0.45) * gridSize + 3)
          .attr('x', labelsXY.x.length * gridSize - 25)
          .attr('class', 'totalsX')
          .text((d) => d);
        const doLegend = true;
        if (doLegend) {
          const scaleC = [colourScale.domain()[0]];
          colourScale.quantiles().forEach((d) => scaleC.push(d));
          const legend = svg.selectAll('.legend')
            .data(scaleC);
          const legend_g = legend.enter().append('g')
            .attr('class', 'legend');
          legend_g.append('rect')
            .attr('x', (d, i) => legendElementWidth * i)
            .attr('y', (labelsXY.y.length + 0.25) * gridSize)
            .attr('width', legendElementWidth)
            .attr('height', legendSize)
            .style('fill', (d, i) => `${colours[i]}`)
            .on('mouseover', (d) => {
              this.tooltip.style('opacity', 0.9);
              this.tooltip
                .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${d}`)
                .style('left', `${d3.event.pageX}px`)
                .style('top', `${d3.event.pageY - 28}px`);
            })
            .on('mouseout', () => this.tooltip.style('opacity', 0));
          legend_g.append('text')
            .attr('class', 'legend')
            .text((d) => '\uf07e ' + /* '≥ '*/ + (Math.abs(d) > 1 ? Math.round(d) : Math.round(d * 100) / 100))
            .attr('x', (d, i) => legendElementWidth * (i + 0.25))
            .attr('y', (labelsXY.y.length + 0.25) * gridSize + legendSize / 2 + 3);
        }
      };
    heatmapChart(squares ? false : true);
  }
}
