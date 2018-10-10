import { Component, OnInit, ViewEncapsulation, SystemJsNgModuleLoader } from '@angular/core';
import * as d3 from 'd3';
import { DatamoduleModule } from '../datamodule/datamodule.module';
import { AppComponent } from '../app.component';
import { PrefixNot } from '@angular/compiler';
@Component({
  selector: 'app-heatmap',
  // tslint:disable-next-line:max-line-length
  template: '<select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of plotFigure">{{i}}</option></select> No. colours in Large Map<input  (input)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{buttonName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of this.myData.managerDataTypes">{{i}}</option></select>',
  // tslint:disable-next-line:max-line-length
  //  template: '<button  (click)="ngOnInit()">RUN</button><select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of plotFigure">{{i}}</option></select> No. colours in Large Map<input  (input)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><input  (input)="colourRange[0] = $event.target.value" size="3" maxlength="16"  value={{colourRange[0]}}><input (input)="colourRange[1] = $event.target.value" size="3" maxlength="16"  value={{colourRange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{buttonName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of managerDataTypes">{{i}}</option></select>',
  styleUrls: ['./heatmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnInit {
  myData = new DatamoduleModule();
  plotFigure = ['Heat Map', 'Radar ', '5 Circles', 'Large Map', 'Perf Map'].reverse();
  tooltip = AppComponent.toolTipStatic;
  managerX: string[] = [];
  managerY: string[] = [];
  managerPlot: { x: number, y: number, value: number }[] = [];
  numColours = 250;
  buttonName = 'Squares';
  transpose = true;
  squares = true;
  viewbox = true; // Use viewBox attribute for setting width and height (no good on IE)
  chosenData = this.myData.managerDataTypes[0];
  perfData = this.myData.perfMap;
  chosenFigure = this.plotFigure[0];
  pad = true;
  padButt = !this.pad ? 'Pad with zero' : 'Don\'t pad';
  colourRangeMaps = ['rgb(234,235,236)', 'rgb(245,10,5)'];
  colourRange = ['white', 'rgb(245,200,105)',
    'white', 'rgb(245,100,105)',
    'white', 'rgb(245,100,105)',
    'white', 'rgb(105,245,100)',
    'white', 'rgb(105,245,100)',
    'white', 'rgb(105,245,100)',
    'white', 'rgb(175,170,245)',
    'white', 'rgb(175,170,245)',
    'white', 'rgb(175,10,245)',
    'white', 'black',
    'white', 'black',
    'white', 'black',
    'white', 'black',
    'white', 'black',
    'white', 'blue',
    'white', 'blue',
    'white', 'blue',
    'white', 'blue',
    'white', 'blue',
    'white', 'green',
    'white', 'green',
    'white', 'green',
    'white', 'green',
    'white', 'green',
    'white', 'rgb(150,150,255)',
    'white', 'rgb(150,150,255)',
    'white', 'rgb(150,150,255)'
  ];
  wrap = (text1, width, lineHeight) =>  // Adapted from http://bl.ocks.org/mbostock/7555321
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
  toolTipPosition = (ii: number, jj: d3.BaseType[] | d3.ArrayLike<d3.BaseType>, figWidth: number, figHeight: number) => {
    const [mX, mY] = d3.mouse(<d3.ContainerElement>jj[ii]), [tX, tY]: [number, number] = [d3.event.pageX, d3.event.pageY];
    return [mX > figWidth * 0.8 ? `${tX - 200}px` : `${tX + 10}px`, mY < figHeight * 0.8 ? `${tY}px` : `${tY - 100}px`];
  }
  displayOneLinePerfData = (performanceLine: { name: string; performance: number; hold: boolean; }[], assetIndex: number,
    performanceHeightIndicator: d3.ScaleLinear<number, number>, svgPerf: d3.Selection<d3.BaseType, {}, HTMLElement, {}>,
    perfData: { name: string; dates: string[]; performance: number[]; hold: boolean[]; }[], height: number, vSpacer: number, width: number,
    textSpacer: number, numberPerfs: number) => {
    const decorate: number[] = [];
    performanceLine.forEach((d, i) => decorate[i] = d.performance);
    const redwhitegreen1 = d3.scaleLinear<d3.RGBColor>().domain([d3.extent(decorate)[0], 0])
      .range([d3.rgb('#ff000d'), d3.rgb('#dddddd')]);
    const redwhitegreen2 = d3.scaleLinear<d3.RGBColor>().domain([0, d3.extent(decorate)[1]])
      .range([d3.rgb('#dddddd'), d3.rgb('#01ff07')]);
    const rwg = [];
    console.log(d3.extent(decorate));
    performanceLine.forEach((d, i) => rwg[i] = d.performance < 0 ? redwhitegreen1(d.performance) : redwhitegreen2(d.performance));
    const perfS = svgPerf.selectAll('performanceData').data(performanceLine).enter();
    perfS.append('rect') // Coloured rectangles
      .attr('height', (height - vSpacer * numberPerfs) / numberPerfs)
      .attr('width', width / performanceLine.length)
      .style('fill', (perfi, i) => rwg[i])
      .style('stroke-width', 0)
      .on('mouseover', (perfi, ii, jj) => {
        const [pX, pY] = this.toolTipPosition(ii, jj, width, (height - vSpacer * numberPerfs));
        this.tooltip
        .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon><br>
        Date: ${perfData[0].dates[ii]}<br>${perfi.hold ? 'held<br>' : ''}Performance: ${perfi.performance}`)
        .style('left', pX)
        .style('top', pY)
        .style('opacity', 1);
      })
      .on('mouseout', () => this.tooltip.style('opacity', 0))
      .transition().duration(2000)
      .attrTween('x', (perfi, i) => (t) => '' + (width * (i * t + textSpacer) / (performanceLine.length + textSpacer)))
      .attrTween('y', (perfi) => (t) => '' + (performanceHeightIndicator(perfi.performance) * (t + 100 * (1 - t))
        + (height - vSpacer * numberPerfs) * assetIndex / numberPerfs + vSpacer * (assetIndex - 1))
      );
    const openBox = true;
    perfS.append('path') // Open rectangles
      .attr('class', (perfi) => perfi.hold ? 'perfM' : 'perfS')
      .transition().duration(2000)
      .tween('held', (perfi, i, kk) => {
        const here = d3.select(kk[i]);
        if (!openBox) {
          here.style('stroke-width', (+here.style('stroke-width').replace('px', '') * 0.75) + 'px');
        }
        const last = i > 0 ? d3.select(kk[i - 1]).attr('class') : ' ';
        const next = i < (performanceLine.length - 1) ? d3.select(kk[i + 1]).attr('class') : ' ';
        const cl = here.attr('class');
        const sw = +here.style('stroke-width').replace('px', '') / 2;
        const heldLeft = (i === 0) || (last !== cl);
        const heldRight = (i === (performanceLine.length - 1)) || (next !== cl);
        return (t) => {
          here.attr('d', () => {
            const x = t * width * (i + textSpacer) / (performanceLine.length + textSpacer);
            const w = t * width / performanceLine.length;
            const h = t * (height - vSpacer * numberPerfs) / numberPerfs;
            const y = (performanceHeightIndicator(perfi.performance) * t
              + (height - vSpacer * numberPerfs) * assetIndex / numberPerfs + vSpacer * (assetIndex - 1));
            let back = '';
            if (openBox) {
              back += `M ${x} ${y} l ${w} 0 m 0 ${h} l ${-w} 0 `;
              if (heldLeft) {
                back += `M ${x} ${y - sw} l 0 ${h + 2 * sw} `;
              } else if (heldRight) {
                back += `M ${x + w} ${y - sw} l 0 ${h + 2 * sw} `;
              }
            } else {
              back += `M ${x} ${y} l ${w} 0l 0 ${h} l ${-w} 0 z`;
            }
            return back;
          });
        };
      })
      ;
    const perfI = svgPerf.selectAll('performanceNames').data([performanceLine[0]]).enter(); // Only need the text data once
    perfI.append('text') // Asset names
      .transition().duration(2000)
      .tween('', (perfi, i, j) => (t) => {
        d3.select(j[i])
          .text(perfi.name)
          .attr('class', 'perfM')
          .attr('x', 0)
          .attr('y', t * (height - vSpacer * numberPerfs) * assetIndex / numberPerfs + vSpacer * (assetIndex - 1) - 5)
          .attr('dy', 1.5 * t)
          .call(this.wrap, 70 * t, t);
      });
  }
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
      this.heatMaps('app-heatmap', this.managerX, this.managerY, this.managerPlot, this.colourRangeMaps, this.squares);
    } else if (this.chosenFigure === 'Large Map') {
      this.largeMap('app-heatmap', this.myData.managerDataTypes, this.myData.managerData, this.colourRange);
    } else if (this.chosenFigure === 'Perf Map') {
      this.perfMap('app-heatmap', this.perfData);
    } else if (this.chosenFigure === '5 Circles') {
      this.fiveCircles('app-heatmap', this.myData.fiveCircles);
    } else if (this.chosenFigure === 'Radar') {
      const margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
      }
        , width = Math.min(700, 950 - 10) - margin.left - margin.right
        , height = Math.min(width, 950 - margin.top - margin.bottom - 20);

      const radarBlobColour = d3.scaleOrdinal<number, string>().range(['rgb(255,50,50)', 'rgb(50,255,50)', 'rgb(50,50,255)']);

      const radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: radarBlobColour
      };

      this.RadarChart('app-heatmap', this.myData.radarData, radarChartOptions);
    }
  }
  fiveCircles(id: string, circData: number[]) {
    const nCirc = circData.length, angle5 = Math.PI * 2 / nCirc, radRat = Math.sin(angle5 * 0.5),
      margin = { top: 120, right: 90, bottom: 120, left: 90 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      svgBase: d3.Selection<d3.BaseType, {}, HTMLElement, {}> = d3.select(id).append('svg');
    if (this.viewbox) {
      svgBase.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    } else {
      svgBase.attr('width', width + margin.left + margin.right);
      svgBase.attr('height', height + margin.top + margin.bottom);
    }
    const svg = svgBase.append('g').attr('transform', `translate(${margin.left + width / 2},${margin.top + height / 2})`),
      colours = d3.scaleLinear<d3.RGBColor>()
        .domain([0, nCirc])
        .range([d3.rgb(255, 0, 0), d3.rgb(0, 255, 0)]),
      baseRad = Math.min(width, height) * 0.5;
    const cc = [];
    for (let i = 0; i < nCirc; ++i) {
      cc[i] = colours(i);
    }
    const groupCirc = (RAD: number, cx: number, cy: number, depth: number, maxdepth: number) => {
      depth++;
      if (depth === 1) {
        svg.append('circle')
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', 3)
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 0);
      }
      const smallRad = RAD;
      for (let i = 0; i < nCirc; ++i) {
        if (depth < maxdepth) {
          groupCirc(smallRad * radRat, cx + RAD * Math.sin(angle5 * i), cy - RAD * Math.cos(angle5 * i), depth, maxdepth);
        }
        svg.append('circle')
          .style('fill', () => cc[i])
          .style('stroke', 'black')
          .style('stroke-width', 3)
          .attr('ddd', circData[i])
          .attr('cx', cx + smallRad * Math.sin(angle5 * i))
          .attr('cy', cy - smallRad * Math.cos(angle5 * i))
          .attr('r', smallRad * radRat);
      }

    };
    groupCirc(baseRad, 0, 0, 0, 4);
    const largeC: number[] = [];
    svg.selectAll('circle').attr('r', (d, i, HH) =>
      largeC[i] = +d3.select(HH[i]).attr('r').replace('px', ''))
      .on('mouseover', (d, i, HH) => {
        const [tX, tY] = this.toolTipPosition(i, HH, baseRad, baseRad);
        this.tooltip
        .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${d3.select(HH[i]).attr('ddd')}`)
        .style('left', tX)
        .style('top', tY)
        .style('opacity', 1);
      }
      )
      .on('mouseout', (d, i) => this.tooltip
        .style('opacity', 0)
      )
      ;
    svg.selectAll('circle').transition().duration(1500)
      .tween('', (d, i, kk) => {
        return (t: number) => {
          const here = d3.select(kk[i]), newRad = (+here.attr('r').replace('px', '') * (1 - t * t));
          if (largeC[i] >= baseRad * radRat) {
            here.attr('r', largeC[i]);
          } else {
            here.attr('r', newRad);
          }
        };
      })
      ;
  }
  perfMap(id: string, perfData: { name: string; dates: string[]; performance: number[]; hold: boolean[]; }[]) {
    // Performance data visual display
    const margin = { top: 30, right: 90, bottom: 30, left: 90 }, numberPerfs = Math.max(20, perfData.length),
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      svgBase: d3.Selection<d3.BaseType, {}, HTMLElement, {}> = d3.select(id).append('svg'),
      vSpacer = 3, textSpacer = 15,
      gradientG = svgBase.append('linearGradient')
        .attr('id', 'gradG')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%'),
      gradientGr = svgBase.append('linearGradient')
        .attr('id', 'gradGr')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%'),
      gradientR = svgBase.append('linearGradient')
        .attr('id', 'gradR')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
    gradientG.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgb(10,241,10)')
      .attr('stop-opacity', 1);
    gradientG.append('stop')
      .attr('offset', '40%')
      .attr('stop-color', 'lightgreen')
      .attr('stop-opacity', 0.95);
    gradientG.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'green')
      .attr('stop-opacity', 1);
    gradientGr.append('stop')
      .attr('offset', '10%')
      .attr('stop-color', '#748b97')
      .attr('stop-opacity', 1);
    gradientGr.append('stop')
      .attr('offset', '30%')
      .attr('stop-color', '#9bb53c')
      .attr('stop-opacity', 0.95);
    gradientGr.append('stop')
      .attr('offset', '80%')
      .attr('stop-color', '#85a3b2')
      .attr('stop-opacity', 1);
    gradientR.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgb(241,10,10)')
      .attr('stop-opacity', 1);
    gradientR.append('stop')
      .attr('offset', '40%')
      .attr('stop-color', 'rgb(238,144,144)')
      .attr('stop-opacity', 1);
    gradientR.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgb(255,16,8)')
      .attr('stop-opacity', 1);
    const doView = true;
    if (doView) {
      svgBase.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    } else {
      svgBase.attr('width', width + margin.left + margin.right);
      svgBase.attr('height', height + margin.top + margin.bottom);
    }
    const svg = svgBase.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    perfData.forEach((ydata, yi) => {
      const wiggle = 0, // each rectangle is positioned vertically according to performance if wiggle > 0
        perfInd = d3.scaleLinear().domain(d3.extent(ydata.performance)).range([height * 0.015 * wiggle, -height * 0.015 * wiggle]);
      const perfPlotDataAsset: { name: string; performance: number; hold: boolean }[] = [];
      // perfPlotDataAsset[] is the true data plotted
      ydata.performance.forEach((perform, xi) => {
        perfPlotDataAsset.push({ name: ydata.name, hold: ydata.hold[xi], performance: ydata.performance[xi] });
      });
      this.displayOneLinePerfData(perfPlotDataAsset, yi, perfInd, svg, this.perfData, height, vSpacer, width,
        textSpacer, numberPerfs);
    });
    svg.append('rect')
      .attr('height', (height - vSpacer * numberPerfs) / numberPerfs * perfData.length + vSpacer * (perfData.length - 1))
      .attr('y', -vSpacer)
      .attr('x', width * (textSpacer) / (perfData[0].performance.length + textSpacer))
      .attr('width', (width * perfData[0].performance.length / (perfData[0].performance.length + textSpacer)))
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 2)
      ;
    let yearChange = 0, okInt = 0;
    svg.selectAll('toptitles').data(perfData[0].dates).enter()
      .append('rect')
      .attr('x', (d, i) => width * (textSpacer + i) / (perfData[0].performance.length + textSpacer))
      .attr('y', -vSpacer * 5)
      .attr('width', width / (perfData[0].performance.length + textSpacer))
      .attr('height', 10)
      .attr('class', (d, i) => {
        okInt++;
        if (+d.split('/')[0] > yearChange) {
          yearChange = +d.split('/')[0];
          okInt = 0;
        }
        return okInt <= 5 ? 'grey' : 'none'; // Counts 5 "spaces" for the rectangle shading around year label
      });
    yearChange = 0;
    svg.selectAll('toptitles').append('g').data(perfData[0].dates).enter()
      .append('text')
      .attr('class', 'topdates')
      .text((d, i) => {
        let changeY = false;
        if (+d.split('/')[0] > yearChange) {
          yearChange = +d.split('/')[0];
          changeY = true;
        }
        return changeY && (i === 0 || i > 10) ? yearChange : '';
      })
      .attr('x', (d, i) => width * (textSpacer + i) / (perfData[0].performance.length + textSpacer))
      .attr('y', -vSpacer * 2);


  }
  largeMap(id: string, managerDataTypes: string[], managerData: { x: string; y: string; value: number; }[][], colourRange: string[]) {
    const margin = { top: 110, right: 10, bottom: 40, left: 90 },
      width = 800 - margin.left - margin.right,
      height = 1500 - margin.top - margin.bottom,
      scaleX = d3.scaleLinear().domain([0, managerDataTypes.length]).range([0, width]),
      scaleY = d3.scaleLinear().domain([0, managerData[0].length]).range([0, height]),
      svgBase = d3.select(id).append('svg')
        .attr('width', `${width + margin.left + margin.right}`)
        .attr('height', `${height + margin.bottom + margin.top}`);
    svgBase.append('rect').attr('width', `${width + margin.left + margin.right}`)
      .attr('height', `${height + margin.bottom + margin.top}`).attr('x', '0').attr('y', '0').attr('class', 'rim');
    svgBase.append('rect').attr('width', width).attr('height', height)
      .attr('x', `${margin.left}`).attr('y', `${margin.top}`).attr('class', 'rim');
    const magnify = svgBase.append('g'), XLabels = svgBase.selectAll('.xLabel')
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
    const YOffice = svgBase.selectAll('.yLabel0')
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
    const YOfficeGroups = svgBase.selectAll('.yLabel1')
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
      const ixx = (ix % (colourRange.length / 2)) * 2;
      const coloursd = d3.scaleLinear<d3.RGBColor, d3.RGBColor>()
        .domain([0, this.numColours])
        .range([d3.rgb(colourRange[ixx]), d3.rgb(colourRange[ixx + 1])]),
        colours: d3.RGBColor[] = [];
      for (let i = 0; i < this.numColours; ++i) {
        colours[i] = coloursd(i);
      }
      const colourScale = d3.scaleQuantile<d3.RGBColor>()
        .domain([d3.min(di, (d: { x: string, y: string, value: number }) => d.value),
        d3.max(di, (d: { x: string, y: string, value: number }) => d.value)])
        .range(colours);
      colouredRectangles[ix] = svgBase.selectAll('.rect')
        .data(di)
        .enter().append('rect')
        .attr('x', (dd) => margin.left + scaleX(ix) + 1)
        .attr('y', (dd, i) => margin.top + scaleY(i))
        .attr('width', width / managerDataTypes.length - 2)
        .attr('height', height / di.length)
        .style('fill', (dd) => `${colourScale(dd.value)}`)
        .on('mouseover', (dd, ii, jj) => {
          const [tX, tY] = this.toolTipPosition(ii, jj, width, height);
          this.tooltip
          // tslint:disable-next-line:max-line-length
          .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${dd.x} Office<br>${managerDataTypes[ix]}<br>${dd.y + iOffice[dd.x]} Team<br>${dd.value}`)
          .style('left', tX)
          .style('top', tY)
          .style('opacity', 1);
        }
        )
        .on('click', (dd, i) => clicker(di, i))
        .on('mouseout', () => this.tooltip.style('opacity', 0));
    });
    const highlite = svgBase.append('g').append('rect'),
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
          const heightHere = 40;
          if (doBig) {
            datamag
              .attr('class', 'mag')
              .attr('y', 4)
              .style('fill', 'rgb(5, 247, 236)')
              .on('mouseover', (d, idd, jj) => {
                const [tX, tY] = this.toolTipPosition(idd, jj, width, height);
                this.tooltip
                  .style('left', tX)
                  .style('top', tY)
                  .style('opacity', 1)
                  // tslint:disable-next-line:max-line-length
                  .html(`<a class="fa fa-gears leafy"></a>${managerData[idd][i].x}<br>${managerData[idd][i].y}<br>${managerDataTypes[idd]}<br>${managerData[idd][i].value}`);
              }
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
                const nodeI = d3.select(d.nodes()[i]);
                const dt = +nodeI.attr('x').replace('px', '') +
                  +nodeI.attr('width').replace('px', '') / 2;
                return (t: number) => d3.select(datamagRef[labIndex])
                  .attr('transform', `translate(${dt} , ${1.5 * heightHere / 2}) rotate(${-270 * (1 - Math.sqrt(t))})`)
                  .style('opacity', `${Math.sqrt(t)}`);
              }).on('mouseover', (d, idd, jj) => {
                const [tX, tY] = this.toolTipPosition(idd, jj, width, height);
                this.tooltip
                  .style('left', tX)
                  .style('top', tY)
                  .style('opacity', 1)
                  // tslint:disable-next-line:max-line-length
                  .html(`<a class="fa fa-gears leafy"></a>${managerData[idd][i].x}<br>${managerData[idd][i].y}<br>${managerDataTypes[idd]}<br>${managerData[idd][i].value}`);
              }
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
      }, rectH = svgBase.append('rect')
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
  heatMaps(id: string, xLabels: string[], yLabels: string[], dataXY: { x: number, y: number, value: number }[],
    colourRange: string[], squares: boolean) {
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
      .range([d3.rgb(colourRange[0]), d3.rgb(colourRange[1])]), colours: d3.RGBColor[] = [],
      svgBase = d3.select(id).append('svg');
    for (let i = 0; i < buckets; i++) {
      colours[i] = coloursd(i);
    }
    if (this.viewbox) {
      svgBase.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom + legendSize}`);
    } else {
      svgBase.attr('width', width + margin.left + margin.right);
      svgBase.attr('height', height + margin.top + margin.bottom + legendSize);
    }
    const svg = svgBase
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
          .on('mouseover', (d, idd, jj) => {
            const [tX, tY] = this.toolTipPosition(idd, jj, width, height);
            this.tooltip
              // tslint:disable-next-line:max-line-length
              .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${labelsXY.x[d.x - 1]}<br>${labelsXY.y[d.y - 1]}<br>${d.value}`)
              .style('opacity', 0.9)
              .style('left', tX)
              .style('top', tY);
          }
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
            .on('mouseover', (d, idd, jj) => {
              this.tooltip.style('opacity', 0.9);
              const [tX, tY] = this.toolTipPosition(idd, jj, width, height);
              this.tooltip
                .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${d}`)
                .style('left', tX)
                .style('top', tY);
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
      percentFormat = d3.format('.0%'),			 	// Percentage formatting
      angleSlice = Math.PI * 2 / total;		// The width in radians of each "slice"

    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    d3.select(id).select('svg').remove();
    const svg = d3.select(id).append('svg'), doView = false;

    if (doView) {
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
      .text((d, i) => percentFormat(maxValue * d / cfg.levels));


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
          .text(percentFormat(+d.value))
          .transition().duration(200)
          .style('fill', fill);
      })
      .on('mouseout', () => localTiptool.transition().duration(200).style('fill', 'none'));
    const localTiptool = g.append('text')
      .attr('class', 'tooltipRadar')
      .style('opacity', 0);
  }
}
