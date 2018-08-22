import { Component, OnInit, ViewEncapsulation, SystemJsNgModuleLoader } from '@angular/core';
import * as d3 from 'd3';
import { DatamoduleModule } from '../datamodule/datamodule.module';
import { AppComponent } from '../app.component';
import { PrefixNot } from '@angular/compiler';
@Component({
  selector: 'app-heatmap',
  // tslint:disable-next-line:max-line-length
  template: '<select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of plotFigure">{{i}}</option></select> No. colours in Large Map<input  (input)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><input  (input)="colourrange[0] = $event.target.value" size="3" maxlength="16"  value={{colourrange[0]}}><input (input)="colourrange[1] = $event.target.value" size="3" maxlength="16"  value={{colourrange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{buttonName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of this.myData.managerDataTypes">{{i}}</option></select>',
  // tslint:disable-next-line:max-line-length
  //  template: '<button  (click)="ngOnInit()">RUN</button><select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of plotFigure">{{i}}</option></select> No. colours in Large Map<input  (input)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><input  (input)="colourrange[0] = $event.target.value" size="3" maxlength="16"  value={{colourrange[0]}}><input (input)="colourrange[1] = $event.target.value" size="3" maxlength="16"  value={{colourrange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{buttonName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of managerDataTypes">{{i}}</option></select>',
  styleUrls: ['./heatmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnInit {
  myData = new DatamoduleModule();
  plotFigure = ['Heat Map', 'Large Map', 'Radar ', 'Perf Map'].reverse();
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
  perfData = this.myData.perfMap;
  chosenFigure = this.plotFigure[0];
  pad = true;
  padButt = !this.pad ? 'Pad with zero' : 'Don\'t pad';
  colourrange = ['rgb(234,235,236)', 'rgb(245,10,5)'];
  wrap = (text1, width, lineHeight) =>
    text1.each((kk, i, j) => {
      const text = d3.select(j[i]),
        words = text.text().split(/\s+/).reverse(),
        y = text.attr('y'),
        x = text.attr('x'),
        dy = parseFloat(text.attr('dy'));
      let word, line = [],
        lineNumber = 0,
        tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if ((<SVGTSpanElement>tspan.node()).getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
      }
    })

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
  managerProcess(dataV: { x: string, y: string, value: number }[]) { // Set up data for individual heatmaps
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
  ngOnInit() { // Decide whether large map or smaller heatmap
    d3.selectAll('svg').remove();
    if (this.chosenFigure === 'Heat Map') {
      this.myData.managerDataTypes.forEach((d, i) => {
        if (this.chosenData === d) {
          this.managerProcess(this.myData.managerData[i]);
        }
      });
      this.buttonName = this.squares ? 'Circles' : 'Squares';
      this.heatMaps(this.managerX, this.managerY, this.managerPlot, this.colourrange, this.squares);
    } else if (this.chosenFigure === 'Large Map') {
      this.largeMap(this.myData.managerDataTypes, this.myData.managerData, this.colourrange);
    } else if (this.chosenFigure === 'Perf Map') {
      this.perfMap(this.perfData);
    } else if (this.chosenFigure === 'Radar') {
      const margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
      }
        , width = Math.min(700, 950 - 10) - margin.left - margin.right
        , height = Math.min(width, 950 - margin.top - margin.bottom - 20);

      const colour = d3.scaleOrdinal<number, string>().range(['orange', 'blue']).domain([0, 1]);

      const radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: colour
      };

      this.RadarChart('app-heatmap', this.myData.radarData, radarChartOptions);
    }
  }
  perfMap(perfData: { name: string; performance: number[]; hold: boolean[]; }[]) {
    // Performance data visual display
    const margin = { top: 30, right: 90, bottom: 30, left: 90 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      svgbase = d3.select('app-heatmap').append('svg'), vspacer = 15, textspace = 15,
      gradientG = svgbase.append('linearGradient')
        .attr('id', 'gradG')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%'),
      gradientR = svgbase.append('linearGradient')
        .attr('id', 'gradR')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
    gradientG.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'green')
      .attr('stop-opacity', 1);
    gradientG.append('stop')
      .attr('offset', '40%')
      .attr('stop-color', 'lightgreen')
      .attr('stop-opacity', 0.95);
    gradientG.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'green')
      .attr('stop-opacity', 1);
    gradientR.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgb(255,16,8)')
      .attr('stop-opacity', 1);
    gradientR.append('stop')
      .attr('offset', '30%')
      .attr('stop-color', 'rgb(238,144,144)')
      .attr('stop-opacity', 1);
    gradientR.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgb(255,16,8)')
      .attr('stop-opacity', 1);
    if (this.viewbox) {
      svgbase.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    } else {
      svgbase.attr('width', width + margin.left + margin.right);
      svgbase.attr('height', height + margin.top + margin.bottom);
    }
    const svg = svgbase.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    perfData.forEach((d, iperf) => {
      const perfInd = d3.scaleLinear().domain(d3.extent(d.performance)).range([height * 0.015, -height * 0.015]);
      const perf: { name: string; performance: number; hold: boolean }[] = [];
      d.hold.forEach((dd, i) => perf.push({ name: d.name, hold: d.hold[i], performance: d.performance[i]}));
      const perfS = svg.selectAll('perfs').data(perf).enter(), numberPerfs = Math.max(10, perfData.length);
      perfS.append('text')
        .attr('class', 'perfM')
        .attr('x', 0)
        .attr('y', () => (height - vspacer * numberPerfs) * iperf / numberPerfs + vspacer * (iperf - 1))
        .attr('dy', 1.5)
        .text((perfi) => perfi.name)
        .call(this.wrap, 60, 0.9);
      perfS.append('rect')
        .attr('height', (height - vspacer * numberPerfs) / numberPerfs)
        .attr('width', width / perf.length)
        .attr('class', (perfi) => perfi.performance > 0 ? 'perfG' : 'perfB')
        .on('mouseover', (perfi, ii) => this.tooltip
          .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon><br>
        Period: ${ii + 1}<br>${perfi.hold ? 'held<br>' : ''}Performance: ${perfi.performance}`)
          .style('left', `${d3.event.pageX + 10}px`)
          .style('top', `${d3.event.pageY - 28}px`)
          .style('opacity', 1)
        )
        .on('mouseout', () => this.tooltip.style('opacity', 0))
        .transition().duration(2000)
        .attrTween('x', (perfi, i) => (t) => '' + (width * (i * t + textspace) / (perf.length + textspace)))
        .attrTween('y', (perfi) => (t) => '' + (perfInd(perfi.performance) * t * t
          + (height - vspacer * numberPerfs) * iperf / numberPerfs + vspacer * (iperf - 1))
        );
      perfS.append('rect')
        .attr('class', (perfi) => perfi.hold ? 'perfM' : 'perfS')
        .attr('rx', (perfi) => perfi.hold ? '2' : '0')
        .attr('ry', (perfi) => perfi.hold ? '2' : '0')
        .attr('x', (perfi, i) => width * (i + textspace) / (perf.length + textspace))
        .attr('width', width / perf.length)
        .style('fill', 'none')
        .transition().duration(2000)
        .attrTween('height', () => (t) => '' + t * (height - vspacer * numberPerfs) / numberPerfs)
        .attrTween('y', (perfi) => (t) => '' + (perfInd(perfi.performance) * t
          + (height - vspacer * numberPerfs) * iperf / numberPerfs + vspacer * (iperf - 1))
        );
    });
  }
  largeMap(managerDataTypes: string[], managerData: { x: string; y: string; value: number; }[][], colourrange: string[]) {
    const margin = { top: 110, right: 10, bottom: 40, left: 90 },
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
      .attr('x', 5)
      .attr('y', -20)
      .attr('dy', 1)
      .style('text-anchor', 'right')
      .attr('transform', (d, i) => `translate(${margin.left + scaleX(i + 0.65)},${margin.top - 3}) rotate(280)`)
      .attr('class', 'axis-x')
      .call(this.wrap, 60, 0.8);
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
      const ixx = ix % (colourrange.length - 1);
      const coloursd = d3.scaleLinear<d3.RGBColor, d3.RGBColor>()
        .domain([0, this.numColours - 1])
        .range([d3.rgb(colourrange[(ixx > 0 ? ixx + 1 : ixx) % colourrange.length]), d3.rgb(colourrange[1])]),
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
  setPad() { // Set up the small heatmap data for zeros or no zeros
    this.pad = !this.pad;
    this.padButt = !this.pad ? 'Pad with zero' : 'Don\'t pad';
    this.ngOnInit();
  }
  setTrans() { // Set up data the other way round
    this.transpose = !this.transpose;
    this.ngOnInit();
  }
  setSquares() {
    this.squares = !this.squares;
    this.buttonName = this.squares ? 'Circles' : 'Squares';
    this.ngOnInit();
  }
  heatMaps(xLabels: string[], yLabels: string[], dataXY: { x: number, y: number, value: number }[],
    colourrange: string[], squares: boolean) {
    const transpose = this.transpose,
      labelsXY = { x: [' '], y: [' '] }, heatData: { x: number, y: number, value: number }[] = [];
    if (transpose) {
      labelsXY.x = yLabels;
      labelsXY.y = xLabels;
    } else {
      labelsXY.x = xLabels;
      labelsXY.y = yLabels;
    }
    let buckets = labelsXY.x.length, legendSize = 50;
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
      .range([d3.rgb(colourrange[0]), d3.rgb(colourrange[1])]), colours: d3.RGBColor[] = [],
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
            .attr('rx', 20)
            .attr('ry', 20)
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
          .attr('rx', 0)
          .attr('ry', 0)
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
  RadarChart(id: string, data: { axis: string; value: number; }[][], options: {
    w: number; h: number;
    margin: { top: number; right: number; bottom: number; left: number; };
    maxValue: number; levels: number; roundStrokes: boolean; color: d3.ScaleOrdinal<number, string>;
  }) {
    const cfg = {
      w: 600,				// Width of the circle
      h: 600,				// Height of the circle
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
      levels: 3,				// How many levels or inner circles should there be drawn
      maxValue: 0, 			// What is the value that the biggest circle will represent
      labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
      lineHeight: 1.4, 		// Height for wrapped lines
      opacityArea: 0.35, 	// The opacity of the area of the blob
      dotRadius: 3, 			// The size of the colored circles of each blog
      opacityCircles: 0.1, 	// The opacity of the circles of each blob
      strokeWidth: 2, 		// The width of the stroke around each blob
      roundStrokes: false,	// If true the area and stroke will follow a round path (cardinal-closed)
      //    color: d3.schemeCategory10	// Color function
      color: d3.scaleOrdinal<number, string>(d3.schemeCategory10).domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    };
    if ('undefined' !== typeof options) {
      for (const i in options) {
        if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
      }
    }

    const maxValue = Math.max(cfg.maxValue, +d3.max(data, (i) => d3.max(i.map((o) => o.value))));

    const allAxis = (data[0].map((i) => i.axis)),	// Names of each axis
      total = allAxis.length,					// The number of different axes
      radius = Math.min(cfg.w / 2, cfg.h / 2), 	// Radius of the outermost circle
      Format = d3.format('.0%'),			 	// Percentage formatting
      angleSlice = Math.PI * 2 / total;		// The width in radians of each "slice"

    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    d3.select(id).select('svg').remove();
    const svg = d3.select(id).append('svg');

    if (this.viewbox) {
      svg.attr('viewBox', `0 0 ${cfg.w + cfg.margin.left + cfg.margin.right} ${cfg.h + cfg.margin.top + cfg.margin.bottom}`)
        .attr('class', 'radar' + id);
    } else {
      svg
        .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
        .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr('class', 'radar' + id);
    }
    const g = svg.append('g')
      .attr('transform', 'translate(' + (cfg.w / 2 + cfg.margin.left) + ',' + (cfg.h / 2 + cfg.margin.top) + ')'),
      filter = g.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic'),
      axisGrid = g.append('g').attr('class', 'axisWrapper');

    axisGrid.selectAll('.levels')
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d, i) => radius / cfg.levels * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', cfg.opacityCircles)
      .style('filter', 'url(#glow)');

    axisGrid.selectAll('.axisLabel')
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append('text')
      .attr('class', 'axisRadar')
      .attr('x', 4)
      .attr('y', (d) => -d * radius / cfg.levels)
      .attr('dy', '0.4em')
      .text((d, i) => Format(maxValue * d / cfg.levels));


    const axis = axisGrid.selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .transition()
      .ease(d3.easeBounce)
      .duration(2000)
      .attr('x2', (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('class', 'line')
      .style('stroke', 'white')
      .style('stroke-width', '2px');

    axis.append('text')
      .attr('class', 'legendRadar')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d)
      .call(this.wrap, cfg.wrapWidth, cfg.lineHeight);

    const radarLine = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d: any) => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    if (cfg.roundStrokes) {
      radarLine.curve(d3.curveCardinalClosed);
    }
    const blobWrapper = g.selectAll('.radarWrapper')
      .data(data)
      .enter().append('g')
      .attr('data-index', (d, i) => i)
      .attr('class', 'radarWrapper');

    blobWrapper
      .append('path')
      .attr('class', 'radarArea')
      .attr('d', (d: any, i) => radarLine(d))
      .style('fill', (d, i) => cfg.color(i))
      .style('fill-opacity', cfg.opacityArea)
      .on('mouseover', (d, i, jj) => {
        // Dim all blobs
        d3.selectAll('.radarArea')
          .transition().duration(200)
          .style('fill-opacity', 0.1);
        // Bring back the hovered over blob
        d3.select(jj[i])
          .transition().duration(200)
          .style('fill-opacity', 0.7);
      })
      .on('mouseout', () => d3.selectAll('.radarArea')
        .transition().duration(200)
        .style('fill-opacity', cfg.opacityArea)
      );

    blobWrapper.append('path')
      .attr('class', 'radarStroke')
      .style('stroke-width', cfg.strokeWidth + 'px')
      .style('stroke', 'white')
      .transition()
      .ease(d3.easeBounce)
      .duration(2000)
      .attr('d', (d: any, i) => radarLine(d))
      .style('stroke', (d, i) => cfg.color(i))
      .style('fill', 'none')
      .style('filter', 'url(#glow)');

    blobWrapper.selectAll('.radarCircle')
      .data((d) => d)
      .enter().append('circle')
      .attr('class', 'radarCircle')
      .attr('r', cfg.dotRadius)
      .attr('cx', (d, i) => rScale(+d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(+d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.color(+(d3.select(<HTMLInputElement>(<HTMLInputElement>j[i]).parentNode).attr('data-index'))))
      .style('fill-opacity', 0.8);
    const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
      .data(data)
      .enter().append('g')
      .attr('data-index', (d, i) => i)
      .attr('class', 'radarCircleWrapper');

    blobCircleWrapper.selectAll('.radarInvisibleCircle')
      .data((d) => d)
      .enter().append('circle')
      .attr('class', 'radarInvisibleCircle')
      .attr('r', cfg.dotRadius * 1.1)
      .attr('cx', (d, i) => rScale(+d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(+d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', (d, i, j) => cfg.color(+(d3.select(<HTMLInputElement>(<HTMLInputElement>j[i]).parentNode).attr('data-index'))))
      .style('pointer-events', 'all')
      .on('mouseover', (d, i, j) => {
        const newX = parseFloat(d3.select(j[i]).attr('cx')) - 10,
          newY = parseFloat(d3.select(j[i]).attr('cy')) - 10,
          fill = d3.select(j[i]).style('fill');
        localTiptool
          .attr('x', newX)
          .attr('y', newY)
          .style('fill', 'none')
          .style('opacity', 1)
          .text(Format(+d.value))
          .transition().duration(200)
          .style('fill', fill);
      })
      .on('mouseout', () => localTiptool.transition().duration(200).style('fill', 'none'));
    const localTiptool = g.append('text')
      .attr('class', 'tooltipRadar')
      .style('opacity', 0);
  }
}
