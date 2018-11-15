import { Component, OnInit, ViewEncapsulation, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { DatamoduleModule } from '../datamodule/datamodule.module';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-heatmap',
  // tslint:disable-next-line:max-line-length
  template: '<select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of plotFigure">{{i}}</option></select><select (change)="chooseShape($event.target.value)"><option *ngFor="let i of shape">{{i}}</option></select> No. colours in Large Map<input  (change)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button>',
  // tslint:disable-next-line:max-line-length
  //  template: '<button  (click)="processDisplay()">RUN</button><select (change)="chooseFigure($event.target.value)"><option *ngFor="let i of plotFigure">{{i}}</option></select> No. colours in Large Map<input  (input)="numColours = $event.target.value" size="1" maxlength="3" value={{numColours}}><input  (input)="colourRange[0] = $event.target.value" size="3" maxlength="16"  value={{colourRange[0]}}><input (input)="colourRange[1] = $event.target.value" size="3" maxlength="16"  value={{colourRange[1]}}><button  (click)="setPad()">{{padButt}}</button><button (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{buttonName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of managerKPIs">{{i}}</option></select>',
  styleUrls: ['./heatmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnInit, OnChanges {
  myData = new DatamoduleModule();
  @Input() whichKPI = -1;
  @Input() setKPI = -1;
  @Input() Names: string[] = [];
  @Input() Offices: string[] = [];
  @Input() KPIs: string[] = [];
  @Input() KPIi = {};
  @Input() Officesi = {};
  @Input() Namesi = {};

  colourSetupRange = ['rgb(0,255,0)', 'red', '1'];
  plotFigure = ['Radar ', '5 Circles', 'Large Map', 'Perf Map', 'Colour Setup', 'Heat Map', 'Heat Map 2'].reverse();
  tooltip = AppComponent.toolTipStatic;
  managerOffices: string[] = [];
  managerGroups: string[] = [];
  totalsX: { ind: number, value: number }[] = [];
  totalsY: { ind: number, value: number }[] = [];
  @Input() numColours = 250;
  @Input() transposeHeatMap = true;
  @Input() shape = ['Circles', 'Squares', 'Doughnuts', 'Cakes'];
  viewbox = false; // Use viewBox attribute for setting width and height (no good on IE)
  @Input() chosenData = '';
  perfData = this.myData.perfMap;
  @Input() chosenFigure = this.plotFigure[0];
  @Input() chosenShape = this.shape[0];
  @Input() pad = false;
  @Input() padButt = !this.pad ? 'Pad with zero' : 'Don\'t pad';
  @Input() colourRangeMaps = ['white', 'red'];
  @Input() gamma = 1;
  colourRange = ['rgba(245,200,105,0.2)', 'rgb(245,200,105)',
    'rgba(245,100,105,0.2)', 'rgba(245,100,105,1)',
    'rgba(245,100,105,0.2)', 'rgba(245,100,105,1)',
    'rgba(105,245,100,0.2)', 'rgba(105,245,100,1)',
    'rgba(105,245,100,0.2)', 'rgba(105,245,100,1)',
    'rgba(105,245,100,0.2)', 'rgba(105,245,100,1)',
    'rgba(175,170,245,0.2)', 'rgba(175,170,245,1)',
    'rgba(175,170,245,0.2)', 'rgba(175,170,245,1)',
    'rgba(175,170,245,0.2)', 'rgba(175,10,245,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,255,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,255,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,255,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,255,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,0,255,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,255,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,255,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,255,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,255,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(0,255,0,1)',
    'rgba(255,255,255,0.2)', 'rgba(150,150,255,1)',
    'rgba(255,255,255,0.2)', 'rgba(150,150,255,1)',
    'rgba(255,255,255,0.2)', 'rgba(150,150,255,1)'
  ];
  squareArc = (ang1: number, ang2: number, rad1: number, rad2: number) => {
    ang1 -= Math.PI * 0.5;
    ang2 -= Math.PI * 0.5;
    const makeZ = (x: number) => Math.abs(x) < 1e-8 ? 0 : x;
    const seg1 = { xx1: 0, xx2: 0, yy1: 0, yy2: 0 };
    const seg2 = { xx1: 0, xx2: 0, yy1: 0, yy2: 0, face: 0 };
    if (rad1 === 0) {
      rad1 = 1e-7;
    }
    if (rad2 === 0) {
      rad2 = 1e-7;
    }
    seg1.xx1 = rad1 * Math.cos(ang1);
    seg1.yy1 = rad1 * Math.sin(ang1);
    if (Math.abs(seg1.xx1) > Math.abs(seg1.yy1)) {
      seg1.yy1 *= Math.abs(rad1 / seg1.xx1);
      seg1.xx1 = seg1.xx1 < 0 ? -rad1 : rad1;
    } else {
      seg1.xx1 *= Math.abs(rad1 / seg1.yy1);
      seg1.yy1 = seg1.yy1 < 0 ? -rad1 : rad1;
    }
    seg1.xx2 = rad2 * Math.cos(ang1);
    seg1.yy2 = rad2 * Math.sin(ang1);
    if (Math.abs(seg1.xx2) > Math.abs(seg1.yy2)) {
      seg1.yy2 *= Math.abs(rad2 / seg1.xx2);
      seg1.xx2 = seg1.xx2 < 0 ? -rad2 : rad2;
    } else {
      seg1.xx2 *= Math.abs(rad2 / seg1.yy2);
      seg1.yy2 = seg1.yy2 < 0 ? -rad2 : rad2;
    }
    seg2.xx1 = rad1 * Math.cos(ang2);
    seg2.yy1 = rad1 * Math.sin(ang2);
    if (Math.abs(seg2.xx1) > Math.abs(seg2.yy1)) {
      seg2.yy1 *= Math.abs(rad1 / seg2.xx1);
      seg2.xx1 = seg2.xx1 < 0 ? -rad1 : rad1;
    } else {
      seg2.xx1 *= Math.abs(rad1 / seg2.yy1);
      seg2.yy1 = seg2.yy1 < 0 ? -rad1 : rad1;
    }
    seg2.xx2 = rad2 * Math.cos(ang2);
    seg2.yy2 = rad2 * Math.sin(ang2);
    if (Math.abs(seg2.xx2) > Math.abs(seg2.yy2)) {
      seg2.yy2 *= Math.abs(rad2 / seg2.xx2);
      seg2.xx2 = seg2.xx2 < 0 ? -rad2 : rad2;
    } else {
      seg2.xx2 *= Math.abs(rad2 / seg2.yy2);
      seg2.yy2 = seg2.yy2 < 0 ? -rad2 : rad2;
    }
    if (seg1.xx1 === -rad1 && seg2.xx1 === -rad1) {
      // both left side
      if (seg2.yy1 <= seg1.yy1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.yy1 === -rad1 && seg2.yy1 === -rad1) {
      // both top side
      if (seg2.xx1 >= seg1.xx1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.xx1 === rad1 && seg2.xx1 === rad1) {
      // both right side
      if (seg2.yy1 >= seg1.yy1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.yy1 === rad1 && seg2.yy1 === rad1) {
      // both bottom side
      if (seg2.xx1 <= seg1.xx1) {
        seg2.face = 0;
      } else {
        seg2.face = 4;
      }
    } else if (seg1.xx1 === -rad1 && seg2.yy1 === -rad1) {
      // left to top
      seg2.face = 1;
    } else if (seg1.xx1 === -rad1 && seg2.xx1 === rad1) {
      // left to right
      seg2.face = 2;
    } else if (seg1.xx1 === -rad1 && seg2.yy1 === rad1) {
      // left to bottom
      seg2.face = 3;
    } else if (seg1.yy1 === -rad1 && seg2.xx1 === rad1) {
      // top to right
      seg2.face = 1;
    } else if (seg1.yy1 === -rad1 && seg2.yy1 === rad1) {
      // top to bottom
      seg2.face = 2;
    } else if (seg1.yy1 === -rad1 && seg2.xx1 === -rad1) {
      // top to left
      seg2.face = 3;
    } else if (seg1.xx1 === rad1 && seg2.yy1 === rad1) {
      // right to bottom
      seg2.face = 1;
    } else if (seg1.xx1 === rad1 && seg2.xx1 === -rad1) {
      // right to left
      seg2.face = 2;
    } else if (seg1.xx1 === rad1 && seg2.yy1 === -rad1) {
      // right to top
      seg2.face = 3;
    } else if (seg1.yy1 === rad1 && seg2.xx1 === -rad1) {
      // bottom to left
      seg2.face = 1;
    } else if (seg1.yy1 === rad1 && seg2.yy1 === -rad1) {
      // bottom to top
      seg2.face = 2;
    } else if (seg1.yy1 === rad1 && seg2.xx1 === rad1) {
      // bottom to right
      seg2.face = 3;
    }
    let quadR = 'M ' + seg1.xx2 + ' ' + seg1.yy2 + ' L ' + seg1.xx1 + ' ' + seg1.yy1;
    seg1.xx1 = makeZ(seg1.xx1);
    seg1.yy1 = makeZ(seg1.yy1);
    seg1.xx2 = makeZ(seg1.xx2);
    seg1.yy2 = makeZ(seg1.yy2);
    seg2.xx1 = makeZ(seg2.xx1);
    seg2.yy1 = makeZ(seg2.yy1);
    seg2.xx2 = makeZ(seg2.xx2);
    seg2.yy2 = makeZ(seg2.yy2);
    if (seg2.face === 0) {
      if (seg1.xx1 === -rad1) {
        quadR += 'L ' + -rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + -rad2 + ' ' + seg2.yy2;
      } else if (seg1.xx1 === rad1) {
        quadR += 'L ' + rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + rad2 + ' ' + seg2.yy2;
      } else if (seg1.yy1 === -rad1) {
        quadR += 'L ' + seg2.xx1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + -rad2;
      } else if (seg1.yy1 === rad1) {
        quadR += 'L ' + seg2.xx1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + rad2;
      }
    } else if (seg2.face === 1) {
      if (seg1.xx1 === -rad1) {
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
      } else if (seg1.xx1 === rad1) {
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
      } else if (seg1.yy1 === -rad1) {
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + rad2 + ' ' + seg2.yy2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
      } else if (seg1.yy1 === rad1) {
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + -rad2 + ' ' + seg2.yy2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
      }
    } else if (seg2.face === 2) {
      if (seg1.xx1 === -rad1) {
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + rad2 + ' ' + seg2.yy2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
      } else if (seg1.xx1 === rad1) {
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + -rad2 + ' ' + seg2.yy2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
      } else if (seg1.yy1 === -rad1) {
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
      } else if (seg1.yy1 === rad1) {
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
      }
    } else if (seg2.face === 3) {
      if (seg1.xx1 === -rad1) {
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
      } else if (seg1.xx1 === rad1) {
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
      } else if (seg1.yy1 === -rad1) {
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + -rad2 + ' ' + seg2.yy2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
      } else if (seg1.yy1 === rad1) {
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + rad2 + ' ' + seg2.yy2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
      }
    } else if (seg2.face === 4) {
      if (seg1.xx1 === -rad1) {
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + -rad2 + ' ' + seg2.yy2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
      } else if (seg1.xx1 === rad1) {
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + seg2.yy1;
        quadR += 'L ' + rad2 + ' ' + seg2.yy2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
      } else if (seg1.yy1 === -rad1) {
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx1 + ' ' + -rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
      } else if (seg1.yy1 === rad1) {
        quadR += 'L ' + -rad1 + ' ' + rad1;
        quadR += 'L ' + -rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + -rad1;
        quadR += 'L ' + rad1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx1 + ' ' + rad1;
        quadR += 'L ' + seg2.xx2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + rad2;
        quadR += 'L ' + rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + -rad2;
        quadR += 'L ' + -rad2 + ' ' + rad2;
      }
    }
    quadR += 'Z'; // Closed curve
    return quadR;
  }
  wrapFunction = (text1, width: number, lineHeight: number) =>  // Adapted from http://bl.ocks.org/mbostock/7555321
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
      .interpolate(d3.interpolateRgb.gamma(2.2))
      .range([d3.rgb('#ff000d'), d3.rgb('#dddddd')]);
    const redwhitegreen2 = d3.scaleLinear<d3.RGBColor>().domain([0, d3.extent(decorate)[1]])
      .interpolate(d3.interpolateRgb.gamma(2.2))
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
      .transition().duration(2000).ease(d3.easeSinIn)
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
          .call(this.wrapFunction, 70 * t, t);
      });
  }
  constructor(private mainScreen: ElementRef) {
    this.myData.managerData.forEach((d) => d.sort((a, b) => (a.x + a.y).localeCompare(b.x + b.y)));
    /*    this.myData.managerData.forEach((d) => { // Remove the numbers from the office group labels (testing)
          d.forEach((dd) => {
            dd.y = dd.y.replace(/[0-9]/g, '');
          });
        }); */
  }
  chooseData(daig: string) {
    this.chosenData = daig;
    this.processDisplay();
  }
  chooseFigure(daig: string) {
    this.chosenFigure = daig;
    this.processDisplay();
  }
  chooseShape(daig: string) {
    this.chosenShape = daig;
    this.processDisplay();
  }
  managerSummary() {
    const totalKPI: { x: number; y: number; value: number; }[] = []; // this.myData.managerData;
    this.totalsX = [];
    this.totalsY = [];
    let sofar = 0, ik = 0;
    for (let ii = 0, ij = 0; ii < this.managerOffices.length; ii++) { // offices
      for (let jj = 0; jj < this.myData.managerData.length; jj++) { // KPI
        totalKPI.push({ x: ii + 1, y: jj + 1, value: 0 });
        ik = sofar;
        for (let kk = 0; kk < this.managerGroups.length; kk++) {
          if (ik < this.myData.managerData[jj].length && this.myData.managerData[jj][ik].x === this.managerOffices[ii] &&
            this.myData.managerData[jj][ik].y.replace(/[0-9]/g, '') === this.managerGroups[kk].replace(/[0-9]/g, '')) {
            totalKPI[ij].value += this.myData.managerData[jj][ik++].value;
          }
        }
        ij++;
      }
      sofar = ik;
    }
    return totalKPI;
  }
  procNewData() {
    const HERE = this;
    d3.selectAll('svg').remove();
    HERE.Names = [];
    HERE.Offices = [];
    HERE.KPIs = [];
    HERE.KPIi = {};
    HERE.Officesi = {};
    HERE.Namesi = {};
    const keys = Object.keys(HERE.myData.newData[0]);
    const mKPIs: string[] = [];
    keys.forEach((d) => {
      if (d !== 'Name' && d !== 'office') {
        HERE.KPIs.push(d);
        if (d.startsWith('port') || d.startsWith('P_all') || d.startsWith('P_fail') || d.endsWith('_all') || d.endsWith('_ALL')
        || d.startsWith('Out1')) {
          mKPIs.push(d);
        }
        HERE.KPIi[d] = HERE.KPIs.length;
      }
    });
    HERE.myData.newData.forEach((d) => {
      HERE.Names.push(d.Name);
      HERE.Namesi[d.Name] = HERE.Names.length;
      if (HERE.Offices.find((k: string) => (k === d.office)) === undefined) {
        HERE.Offices.push(d.office);
        HERE.Officesi[d.office] = HERE.Offices.length;
      }
    });
    //                  office      KPI
    const totalKPI: { x: number; y: number; value: number; }[] = []; // HERE.myData.managerData;
    HERE.totalsX = [];
    HERE.totalsY = [];
    HERE.Offices.forEach((office) => {
      HERE.KPIs.forEach((kpi) => {
        const kk = { x: HERE.Officesi[office], y: HERE.KPIi[kpi], value: 0 };
        HERE.Names.forEach((name, i) => {
          if (HERE.myData.newData[i].office === office) {
            kk.value += +HERE.myData.newData[i][kpi];
          }
        });
        totalKPI.push(kk);
      });
    });
    HERE.heatMaps(HERE.mainScreen.nativeElement, HERE.Offices, HERE.KPIs, totalKPI, HERE.colourRangeMaps,
      HERE.transposeHeatMap, true, false, HERE.gamma, HERE.chosenData, 2);

    if (HERE.setKPI > -1) {
      const kpiHere = HERE.KPIs[HERE.setKPI];
      const plotKPI: { x: number, y: number, value: number }[] = [];
      HERE.totalsX = [];
      HERE.totalsY = [];
      HERE.Names.forEach((d) => HERE.totalsX.push({ ind: 0, value: 0 }));
      HERE.Offices.forEach((d) => HERE.totalsY.push({ ind: 0, value: 0 }));
      HERE.myData.newData.forEach((d) => {
        HERE.totalsY[HERE.Officesi[d.office] - 1].value += +d[kpiHere];
        HERE.totalsY[HERE.Officesi[d.office] - 1].ind = HERE.Officesi[d.office] - 1;
        HERE.totalsX[HERE.Namesi[d.Name] - 1].value += +d[kpiHere];
        HERE.totalsX[HERE.Namesi[d.Name] - 1].ind = HERE.Namesi[d.Name] - 1;
        plotKPI.push({ x: HERE.Officesi[d.office], y: HERE.Namesi[d.Name], value: +d[kpiHere] });
      });
      HERE.totalsX = [];
      HERE.totalsY = [];
      HERE.heatMaps(HERE.mainScreen.nativeElement, HERE.Offices, HERE.Names,
        plotKPI, HERE.colourRangeMaps, HERE.transposeHeatMap, false, true, HERE.gamma, kpiHere, 20);
    }
  }
  managerProcess(dataV: { x: string, y: string, value: number }[]) { // Set up data for individual heatmaps
    const here = this, xmap = {}, ymap = {}, KPI: { x: number, y: number, value: number }[] = [];
    this.managerOffices = [];
    this.managerGroups = [];
    this.totalsX = [];
    this.totalsY = [];
    let nx = 0, ny = 0;
    this.myData.managerData[0].forEach((d) => {
      if (xmap[d.x] === undefined) {
        here.managerOffices.push(d.x); // Office
        xmap[d.x] = nx++;
      }
      if (ymap[d.y.replace(/[0-9]/g, '')] === undefined) {
        here.managerGroups.push(d.y.replace(/[0-9]/g, '')); // Manager group
        ymap[d.y.replace(/[0-9]/g, '')] = ny++;
      }
    });
    this.managerGroups.sort((a, b) => a.localeCompare(b));
    this.heatMaps(this.mainScreen.nativeElement, this.managerOffices, this.myData.managerKPIs, this.managerSummary(), this.colourRangeMaps,
      this.transposeHeatMap, true, false, this.gamma, this.chosenData);
    let ij = 0;
    for (let i = 0; i < nx && dataV.length; ++i) {
      if (here.totalsY[i] === undefined) {
        here.totalsY[i] = { value: 0, ind: i };
      }
      for (let j = 0; j < ny; ++j) {
        if (here.totalsX[j] === undefined) {
          here.totalsX[j] = { value: 0, ind: j };
        }
        if (ij < dataV.length && dataV[ij].x === here.managerOffices[i]
          && dataV[ij].y.replace(/[0-9]/g, '') === here.managerGroups[j].replace(/[0-9]/g, '')) {
          here.totalsY[i].value += dataV[ij].value; // Get total for each manager
          here.totalsX[j].value += dataV[ij].value; // Get total for each office
          KPI.push({ x: i + 1, y: j + 1, value: dataV[ij++].value });
        } else {
          if (here.pad) { KPI.push({ x: i + 1, y: j + 1, value: 0 }); }
        }
      }
    }
    return KPI; // This is the KPI whose data will be plotted
  }
  ngOnInit() {
    this.processDisplayI();
  }
  ngOnChanges(changes: SimpleChanges) { // This never gets called
    console.log('OnChanges' + changes);
    this.processDisplayI();
  }
  processDisplay() { this.processDisplayI(); } // ngOnChanges should be called when this is called ?? But it isn't.
  processDisplayI() { // Decide which figure
    d3.select(this.mainScreen.nativeElement).selectAll('svg').remove();
    d3.select(this.mainScreen.nativeElement).selectAll('div').remove();
    if (this.chosenFigure === 'Heat Map') {
      d3.select(this.mainScreen.nativeElement).append('div').append('g') // div for colour picker
        .style('color', 'black')
        .text('Colour range: ')
        .selectAll()
        .data(this.colourRangeMaps)
        .enter()
        .append('input')
        .style('color', 'blue')
        .attr('type', 'text')
        .attr('value', (d) => d)
        .on('change', (d, i, j) => {
          this.colourRangeMaps[i] = (<HTMLInputElement>(j[i])).value;
          this.processDisplayI();
        });
      d3.select(this.mainScreen.nativeElement).select('div').append('g')
        .style('color', 'black')
        .text('gamma: ')
        .selectAll()
        .data([this.gamma])
        .enter()
        .append('input')
        .attr('style', 'color: blue')
        .attr('type', 'text')
        .attr('value', (d) => d)
        .on('change', (d, i, j) => {
          this.gamma = +(<HTMLInputElement>(j[i])).value;
          this.processDisplay();
        });
      d3.select(this.mainScreen.nativeElement).select('div').append('button')
        .style('background-color', 'lightgrey')
        .style('color', 'blue')
        .text('SUBMIT');
      this.myData.managerKPIs.forEach((d, i) => {
        if (this.chosenData === d) {
          this.heatMaps(this.mainScreen.nativeElement, this.managerOffices, this.managerGroups,
            this.managerProcess(this.myData.managerData[i]), this.colourRangeMaps,
            this.transposeHeatMap, false, true, this.gamma, this.chosenData);
        }
      });
      if (this.chosenData === '') {
        this.managerProcess([]);
      }
    } else if (this.chosenFigure === 'Heat Map 2') {
      this.procNewData();
    } else if (this.chosenFigure === 'Large Map') {
      this.largeMap(this.mainScreen.nativeElement, this.myData.managerKPIs, this.myData.managerData, this.colourRange);
    } else if (this.chosenFigure === 'Perf Map') {
      this.perfMap(this.mainScreen.nativeElement, this.perfData);
    } else if (this.chosenFigure === '5 Circles') {
      this.fiveCircles(this.mainScreen.nativeElement, this.myData.fiveCircles);
    } else if (this.chosenFigure === 'Colour Setup') {
      d3.select(this.mainScreen.nativeElement).append('div') // div for colour picker
        .style('color', 'brown')
        .text('Colour range picker and gamma: ')
        .selectAll()
        .data(this.colourSetupRange)
        .enter()
        .append('input')
        .attr('style', 'color: orange') // same as .style('color', 'orange')
        .attr('type', 'text')
        .attr('value', (d) => d)
        .on('change', (d, i, j) => {
          this.colourSetupRange[i] = (<HTMLInputElement>(j[i])).value;
          page();
        });
      const margin = {
        top: 20,
        right: 130,
        bottom: 100,
        left: 0
      },
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        buckets = 50,
        colours: string[] = [],
        svg = d3.select(this.mainScreen.nativeElement).append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g');
      svg.attr('transform', `translate(${margin.left},${margin.top + 50}) rotate(-3)`);
      const page = () => {
        svg.selectAll('text').remove();
        svg.selectAll('rect').remove();
        const coloursd = d3.scaleLinear<d3.RGBColor>().domain([0, buckets])
          .interpolate(d3.interpolateRgb.gamma(+(this.colourSetupRange[2])))
          .range([d3.rgb(this.colourSetupRange[0]), d3.rgb(this.colourSetupRange[1])]);
        for (let i = 0; i < buckets; ++i) {
          colours[i] = coloursd(buckets / (buckets - 1) * i);
        }
        const colourScale = d3.scaleQuantile<string>().range(colours).domain([0, buckets]);
        const scaleC: number[] = [colourScale.domain()[0]];
        colourScale.quantiles().forEach((d) => scaleC.push(d));
        // Using colourScale(scaleC[i]) gives the same  result as using just colours[i]
        const colourDist = svg.selectAll('dist')
          .data(scaleC);
        const cdg = colourDist.enter();
        cdg.append('rect')
          .attr('x', (d) => width / buckets * d)
          .attr('y', (d) => 10 * Math.sin(d / Math.PI))
          .attr('width', width / buckets)
          .attr('height', 45)
          .style('stroke', 'black')
          .style('stroke-width', '1px')
          .style('fill', (d) => colourScale(d));
        cdg.append('text')
          .attr('y', 20)
          .attr('transform', (d) => `translate(${margin.left + 27 + width / buckets * d},
            ${margin.top + 30 + 10 * Math.sin(d / Math.PI)}) rotate(93)`)
          .style('stroke', 'blue')
          .style('font-size', `${0.7 * width / buckets}px`)
          .style('font-family', 'fontawesome')
          .text((d) => `${colourScale(d)}`);
      };
      page();
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

      this.RadarChart(this.mainScreen.nativeElement, this.myData.radarData, radarChartOptions);
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
        .interpolate(d3.interpolateRgb.gamma(1))
        .domain([0, nCirc])
        .range([d3.rgb(255, 0, 0), d3.rgb(0, 255, 0)]),
      baseRad = Math.min(width, height) * 0.5;
    const cc = [];
    for (let i = 0; i < nCirc; ++i) {
      cc[i] = colours(i * nCirc / (nCirc - 1));
    }
    const groupCirc = (RAD: number, cx: number, cy: number, depth: number, maxdepth: number) => {
      depth++;
      if (depth === 1) {
        svg.append('circle')
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', 3)
          .attr('cx', `${cx}px`)
          .attr('cy', `${cy}px`)
          .attr('r', 0);
      }
      const smallRad = RAD;
      for (let i = 0; i < nCirc; ++i) {
        if (depth < maxdepth) {
          groupCirc(smallRad * radRat, cx + RAD * Math.sin(angle5 * i), cy - RAD * Math.cos(angle5 * i), depth, maxdepth);
        }
        svg.append('circle')
          .style('fill', cc[i])
          .style('stroke', 'black')
          .style('stroke-width', 3)
          .attr('circleDataAttribute', circData[i])
          .attr('cx', `${cx + smallRad * Math.sin(angle5 * i)}px`)
          .attr('cy', `${cy - smallRad * Math.cos(angle5 * i)}px`)
          .attr('r', smallRad * radRat);
      }
    };
    groupCirc(baseRad, 0, 0, 0, 3);
    const largeC: number[] = [];
    svg.selectAll('circle')
      .attr('r', (d, i, HH) => largeC[i] = +d3.select(HH[i]).attr('r').replace('px', ''))
      .on('mouseover', (d, i, HH) => {
        const here = d3.select(HH[i]);
        const radH = +here.attr('r').replace('px', '') / radRat * 0.5;
        const [mX, mY] = d3.mouse(<d3.ContainerElement>HH[i]);
        const [cX, cY] = [+here.attr('cx').replace('px', ''), +here.attr('cy').replace('px', '')];
        const [eX, eY] = [+d3.event.pageX, +d3.event.pageY];
        const bot = Math.sqrt((mX - cX) * (mX - cX) + (mY - cY) * (mY - cY));
        const [unitX, unitY] = [(mX - cX) / bot, (mY - cY) / bot];
        this.tooltip
          .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${here.attr('circleDataAttribute')}`)
          .style('left', `${-unitX * radH + eX}px`)
          .style('top', `${-unitY * radH + eY}px`)
          .transition().duration(1000)
          .styleTween('opacity', () => (t) => `${t * t}`);
      })
      .on('mouseout', (d, i) => this.tooltip
        .transition().duration(1000)
        .styleTween('opacity', () => (t) => `${1 - t * t}`));
    svg.selectAll('circle').transition().duration(1500)
      .tween('', (d, i, kk) => (t) => {
        const here = d3.select(kk[i]);
        here.attr('r', `${largeC[i] >= baseRad * radRat ? largeC[i] : +here.attr('r').replace('px', '') * (1 - t * t)}px`);
      });
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
    const doView = this.viewbox;
    if (doView) {
      svgBase.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    } else {
      svgBase.attr('width', `${width + margin.left + margin.right}`);
      svgBase.attr('height', `${height + margin.top + margin.bottom}`);
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
      this.displayOneLinePerfData(perfPlotDataAsset, yi, perfInd, svg, perfData, height, vSpacer, width,
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
  largeMap(id: string, managerKPIs: string[], managerData: { x: string; y: string; value: number; }[][], colourRange: string[]) {
    const margin = { top: 110, right: 10, bottom: 40, left: 100 },
      width = 2000 - margin.left - margin.right,
      height = 3000 - margin.top - margin.bottom,
      scaleX = d3.scaleLinear().domain([0, managerKPIs.length]).range([0, width]),
      scaleY = d3.scaleLinear().domain([0, managerData[0].length]).range([0, height]),
      svgBase = d3.select(id).append('svg')
        .attr('width', `${width + margin.left + margin.right}`)
        .attr('height', `${height + margin.bottom + margin.top}`);
    svgBase.append('rect').attr('width', `${width + margin.left + margin.right}`)
      .attr('height', `${height + margin.bottom + margin.top}`).attr('x', '0').attr('y', '0').attr('class', 'rim');
    svgBase.append('rect').attr('width', width).attr('height', height)
      .attr('x', `${margin.left}`).attr('y', `${margin.top}`).attr('class', 'rim');
    const magnify = svgBase.append('g'), XLabels = svgBase.selectAll('.xLabel')
      .data(managerKPIs)
      .enter().append('text')
      .text((d) => d)
      .attr('x', 5)
      .attr('y', -20)
      .attr('dy', 1)
      .style('text-anchor', 'right')
      .attr('transform', (d, i) => `translate(${margin.left + scaleX(i + 0.65)},${margin.top - 3}) rotate(280)`)
      .attr('class', 'axis-x')
      .call(this.wrapFunction, 60, 0.8);
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
      .attr('y', -11 * Math.sin(Math.PI / 180 * 40))
      .style('text-anchor', 'end')
      .attr('transform', (d, i) => `translate(${margin.left}, ${margin.top + scaleY(i + 1)}) rotate(-30)`)
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
      const coloursd = d3.scaleLinear<d3.RGBColor, string>()
        .interpolate(d3.interpolateRgb.gamma(1))
        .domain([0, this.numColours])
        .range([d3.rgb(colourRange[ixx]), d3.rgb(colourRange[ixx + 1])]),
        colours: string[] = [];
      for (let i = 0; i < this.numColours; ++i) {
        colours[i] = coloursd(i * (this.numColours) / (this.numColours - 1));
      }
      const colourScale = d3.scaleQuantile<string>()
        .domain([d3.min(di, (d: { x: string, y: string, value: number }) => d.value),
        d3.max(di, (d: { x: string, y: string, value: number }) => d.value)])
        .range(colours);
      colouredRectangles[ix] = svgBase.selectAll('.rect')
        .data(di)
        .enter().append('rect')
        .attr('x', (dd) => margin.left + scaleX(ix) + 1)
        .attr('y', (dd, i) => margin.top + scaleY(i))
        .attr('width', width / managerKPIs.length - 2)
        .attr('height', height / di.length)
        .style('fill', (dd) => `${colourScale(dd.value)}`)
        .on('click', (dd, i) => clicker(di, i))
        .on('mouseover', (dd, ii, jj) => {
          const [tX, tY] = this.toolTipPosition(ii, jj, width, height);
          this.tooltip
            // tslint:disable-next-line:max-line-length
            .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${dd.x} Office<br>${managerKPIs[ix]}<br>${dd.y + iOffice[dd.x]} Team<br>${dd.value}`)
            .style('left', tX)
            .style('top', tY)
            .style('opacity', 1);
        }
        )
        .on('mouseout', () => this.tooltip.style('opacity', 0))
        ;
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
                  .html(`<a class="fa fa-gears leafy"></a>${managerData[idd][i].x}<br>${managerData[idd][i].y}<br>${managerKPIs[idd]}<br>${managerData[idd][i].value}`);
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
              .on('mouseover', (d, idd, jj) => {
                const [tX, tY] = this.toolTipPosition(idd, jj, width, height);
                this.tooltip
                  .style('left', tX)
                  .style('top', tY)
                  .style('opacity', 1)
                  // tslint:disable-next-line:max-line-length
                  .html(`<a class="fa fa-gears leafy"></a>${managerData[idd][i].x}<br>${managerData[idd][i].y}<br>${managerKPIs[idd]}<br>${managerData[idd][i].value}`);
              }
              )
              .on('mouseout', () => this.tooltip.style('opacity', 0))
              .transition().duration(1500)
              .tween('', (d, labIndex, datamagRef) => {
                const nodeI = d3.select(d.nodes()[i]);
                const dt = +nodeI.attr('x').replace('px', '') +
                  +nodeI.attr('width').replace('px', '') / 2;
                return (t: number) => d3.select(datamagRef[labIndex])
                  .attr('transform', `translate(${dt} , ${1.5 * heightHere / 2}) rotate(${-270 * (1 - Math.sqrt(t))})`)
                  .style('opacity', `${Math.sqrt(t)}`);
              });
            magnifyBorder
              .attr('x', margin.left)
              .attr('y', 4)
              .attr('width', width)
              .attr('height', heightHere)
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
    this.processDisplay();
  }
  setTrans() { // Set up data the other way round
    this.transposeHeatMap = !this.transposeHeatMap;
    this.processDisplay();
  }
  heatMaps(id: string, xLabels: string[], yLabels: string[], dataXY: { x: number, y: number, value: number }[],
    colourRange: string[], transpose = false, lineMap = false,
    sortEach = false, gamma = 1, chosenData = '', scalefac = 1) { // "Proper heatmap" if lineMap and sortEach are both false
    const dataHere = lineMap ? 'total' : chosenData,
      totalsX = !lineMap ? this.totalsX : [], totalsY = !lineMap ? this.totalsY : [],
      labelsXY = { x: [' '], y: [' '] };
    if (transpose) {
      labelsXY.x = yLabels;
      labelsXY.y = xLabels;
    } else {
      labelsXY.x = xLabels;
      labelsXY.y = yLabels;
    }
    // Sort both axes according to totals
    /*    totalsX.sort((a1, a2) => { // Managers' group data
          if (a2.value > a1.value) {
            return 1;
          } else if (a2.value === a1.value) {
            return 0;
          } else {
            return -1;
          }
        }); */
    /*    totalsY.sort((a1, a2) => {
          if (a2.value > a1.value) { // Offices' data
            return 1;
          } else if (a2.value === a1.value) {
            return 0;
          } else {
            return -1;
          }
        });*/
    let legendSize = 40;
    const margin = { top: transpose ? 120 : 100, right: 50, bottom: 10, left: transpose ? 100 : 200 },
      buckets = Math.min(xLabels.length, yLabels.length);
    let width = 1200 * scalefac - margin.left - margin.right,
      height = transpose ? 900 * scalefac : 1400 * scalefac - margin.top - margin.bottom - legendSize;
    const gridSize = Math.min(Math.floor(width / labelsXY.x.length), Math.floor(height / labelsXY.y.length)),
      legendElementWidth = gridSize;
    width = gridSize * labelsXY.x.length;
    height = gridSize * labelsXY.y.length;
    legendSize = Math.min(legendSize, legendElementWidth);
    const coloursd = d3.scaleLinear<d3.RGBColor>()
      .interpolate(d3.interpolateRgb.gamma(gamma))
      .domain([0, buckets])
      .range([d3.rgb(colourRange[0]), d3.rgb(colourRange[1])]), colours: string[] = [],
      svgBase = d3.select(id).append('svg');
    for (let i = 0; i < buckets; i++) {
      colours[i] = coloursd(i * buckets / (buckets - 1));
    }
    if (this.viewbox) {
      svgBase.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom + legendSize}`);
    } else {
      svgBase.attr('width', width + margin.left + margin.right);
      svgBase.attr('height', height + margin.top + margin.bottom + legendSize);
    }
    const doBox = false;
    if (doBox) {
      const box = svgBase.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + legendSize)
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 1);
    }
    const svg = svgBase
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
      YLabels = svg.selectAll('.yLabel')
        .data(labelsXY.y)
        .enter().append('text')
        .text((d, i) => {
          return labelsXY.y[transpose ? (totalsY.length ? totalsY[i].ind : i)
            : (sortEach ? '' :   totalsX.length ? totalsX[i].ind : i)];
        }
        )
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'end')
        .attr('transform', (d, i) => `translate(-5,${(i + 0.6) * gridSize})`)
        .attr('class', 'axis-y'),
      XLabels = svg.selectAll('.xLabel')
        .data(labelsXY.x)
        .enter().append('text')
        .text((d, i) => {
          return labelsXY.x[!transpose ? (totalsY.length ? totalsY[i].ind : i)
            : (sortEach ? '' : totalsX.length ? totalsX[i].ind : i)];
        })
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 1)
        .style('text-anchor', 'right')
        .attr('transform', (d, i) => `translate(${(i) * gridSize - 1},-15) rotate(290)`)
        .attr('class', 'axis-xh')
        .call(this.wrapFunction, 60, 0.8),
      tableTranspose = (d: { x: number, y: number, value: number }) => transpose ?
        { y: +d.x, x: +d.y, value: +d.value } :
        { y: +d.y, x: +d.x, value: +d.value },
      heatmapChart = (shape: string) => {
        const nutScale = d3.scaleSqrt().domain([0, 1]).range([0, 1]), slice = 85,
          heatData: { x: number, y: number, value: number, group: string }[] = [];
        const oXinv = [], oYinv = [];
        xLabels.forEach((d, i) => oXinv[i] = i);
        yLabels.forEach((d, i) => oYinv[i] = i);
        if (totalsX.length > 0 && totalsY.length > 0) {
          totalsY.forEach((d, i) => oXinv[d.ind] = i);
          totalsX.forEach((d, i) => oYinv[d.ind] = i);
        }
        if (!sortEach && totalsX.length === 0 && totalsY.length === 0) {
          dataXY.forEach((d) => {
            d = tableTranspose(d);
            const dd = { x: d.x, y: d.y, value: d.value, group: transpose ? yLabels[d.x - 1] : yLabels[d.y - 1] };
            heatData.push(dd);
          });
        } else {
          if (transpose) {
            for (let ii = 0, i, j, ij = 0; ii < xLabels.length; ii++) {
              const tempY: {
                x: number;
                y: number;
                value: number;
                group: string;
              }[] = [];
              for (let jj = 0; jj < yLabels.length && ij < dataXY.length; jj++) {
                i = totalsY.length ? oXinv[dataXY[ij].x - 1] : ii;
                j = totalsX.length ? oYinv[dataXY[ij].y - 1] : jj;
                if (ii === dataXY[ij].x - 1) {
                  tempY.push({
                    x: i + 1, y: j + 1,
                    group: yLabels[j],
                    value: dataXY[ij++].value
                  });
                }
              }
              if (sortEach) {
                tempY.sort((a1, a2) => {
                  if (a2.value > a1.value) {
                    return 1;
                  } else if (a2.value === a1.value) {
                    return 0;
                  } else {
                    return -1;
                  }
                });
              }
              for (let jj = 0; jj < tempY.length; jj++) {
                heatData.push({ y: tempY[jj].x, x: sortEach ? jj + 1 : tempY[jj].y, value: tempY[jj].value, group: tempY[jj].group });
              }
            }
          } else {
            for (let ii = 0, i, j, ij = 0; ii < xLabels.length; ii++) {
              const tempY: {
                x: number;
                y: number;
                value: number;
                group: string;
              }[] = [];
              for (let jj = 0; jj < yLabels.length && ij < dataXY.length; jj++) {
                j = totalsX.length ? oYinv[dataXY[ij].y - 1] : jj;
                i = totalsY.length ? oXinv[dataXY[ij].x - 1] : ii;
                if (ii === dataXY[ij].x - 1) {
                  tempY.push({
                    x: i + 1, y: j + 1,
                    group: yLabels[j],
                    value: dataXY[ij++].value
                  });
                }
              }
              if (sortEach) {
                tempY.sort((a1, a2) => {
                  if (a2.value > a1.value) {
                    return 1;
                  } else if (a2.value === a1.value) {
                    return 0;
                  } else {
                    return -1;
                  }
                });
              }
              //          }
              //          for (let ii = 0, i, j, ij = 0; ii < xLabels.length; ii++) {
              for (let jj = 0; jj < yLabels.length && jj < tempY.length; jj++) {
                heatData.push({ x: tempY[jj].x, y: sortEach ? jj + 1 : tempY[jj].y, value: tempY[jj].value, group: tempY[jj].group });
              }
            }
          }
        }
        const colourScales: d3.ScaleQuantile<string>[] = [], colourScale = d3.scaleQuantile<string>()
          .domain([d3.min(heatData, (d: { x: number, y: number, value: number, group: string }) => d.value),
          d3.max(heatData, (d: { x: number, y: number, value: number, group: string }) => d.value)])
          .range(colours);
        if (colourScale.domain()[0] === colourScale.domain()[1]) {
          colourScale.domain([d3.max(heatData, (d: { x: number, y: number, value: number, group: string }) => d.value),
          d3.max(heatData, (d: { x: number, y: number, value: number, group: string }) => d.value) + 1]);
        }
        if (lineMap) {
          for (let jj = 0; jj < yLabels.length; jj++) {
            let x1 = 1e9, x2 = -1e9;
            for (let ii = 0; ii < xLabels.length; ii++) {
              x1 = Math.min(x1, heatData[ii * yLabels.length + jj].value);
              x2 = Math.max(x2, heatData[ii * yLabels.length + jj].value);
            }
            colourScales[jj] = d3.scaleQuantile<string>().range(colours).domain([x1, x2]);
            if (colourScales[jj].domain()[0] === colourScales[jj].domain()[1]) {
              colourScales[jj].domain([d3.max(heatData, (d: { x: number, y: number, value: number, group: string }) => d.value),
              d3.max(heatData, (d: { x: number, y: number, value: number, group: string }) => d.value) + 1]);
            }
          }
        }
        const gridDistribution = svg.selectAll('.values')
          .data(heatData);
        let painKiller: d3.Selection<d3.BaseType, { x: number; y: number; value: number; group: string }, d3.BaseType, {}>;
        if (shape === 'Circles') {
          painKiller = gridDistribution.enter().append('circle')
            .attr('cx', width * 0.5)
            .attr('cy', height * 0.5)
            .attr('r', gridSize / 8);
        } else if (shape === 'Squares') {
          painKiller = gridDistribution.enter().append('rect')
            .attr('x', (d) => Math.min(d.y * gridSize, Math.random() * width))
            .attr('y', (d) => Math.min(d.x * gridSize, Math.random() * height))
            .attr('rx', 20)
            .attr('ry', 20)
            .attr('width', gridSize)
            .attr('height', gridSize);
        } else if (shape === 'Doughnuts') {
          painKiller = gridDistribution.enter().append('path')
            .attr('transform', (d) => `translate(${Math.min(d.y * gridSize, Math.random() * width)},
          ${Math.min(d.x * gridSize, Math.random() * height)})`)
            .attr('d', () => d3.arc()
              ({ startAngle: 0, endAngle: Math.PI * 2, outerRadius: gridSize / 2, innerRadius: nutScale(slice / 360) * gridSize / 2 }));
        } else if (shape === 'Cakes') {
          painKiller = gridDistribution.enter().append('path')
            .attr('transform', (d) => `translate(${Math.min(d.y * gridSize, Math.random() * width)},
          ${Math.min(d.x * gridSize, Math.random() * height)})`)
            .attr('d', () => d3.arc()
              ({
                startAngle: slice * Math.PI / 180, endAngle: 2 * Math.PI,
                outerRadius: gridSize / 2, innerRadius: 0
              }));
        }
        painKiller
          .attr('class', 'bordered')
          .on('click', (dd) => {
            if (!lineMap) {
              return;
            }
            this.whichKPI = (transpose ? dd.x : dd.y) - 1;
            d3.selectAll('svg').remove();
            if (this.chosenFigure === 'Heat Map') {
              this.chosenData = this.myData.managerKPIs[this.whichKPI];
              this.heatMaps(this.mainScreen.nativeElement, xLabels, this.managerGroups,
                this.managerProcess(this.myData.managerData[this.whichKPI]), colourRange,
                transpose, false, true, gamma, this.chosenData);
              this.whichKPI = -1;
            } else if (this.chosenFigure === 'Heat Map 2') {
              this.setKPI = this.whichKPI;
              this.whichKPI = -1;
              this.procNewData();
            }
          })
          .on('mouseover', (d, idd, jj) => {
            const [tX, tY] = this.toolTipPosition(idd, jj, width, height);
            this.tooltip
              // tslint:disable-next-line:max-line-length
              .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa></app-icon>${transpose ? d.group : xLabels[totalsY.length ? totalsY[d.x - 1].ind : d.x - 1]}<br>${transpose ? xLabels[totalsY.length ? totalsY[d.y - 1].ind : d.y - 1] : d.group}<br>${dataHere}<br>${d3.format('0.2f')(d.value)}`)
              .style('opacity', 0.9)
              .style('left', tX)
              .style('top', tY);
          })
          .on('mouseout', () => this.tooltip.style('opacity', 0))
          .transition()
          .duration(1000)
          .attr('x', (d) => (d.x - 1) * gridSize)
          .attr('y', (d) => (d.y - 1) * gridSize)
          .attr('cx', (d) => (d.x - 1 + 0.45) * gridSize)
          .attr('cy', (d) => (d.y - 1 + 0.45) * gridSize)
          .attr('transform', (d) => shape === 'Cakes' || shape === 'Doughnuts' ?
            `translate(${(d.x - 1 + 0.45) * gridSize},${(d.y - 1 + 0.45) * gridSize}) rotate(${90})` : 'translate(0,0)')
          .attr('rx', 0)
          .attr('ry', 0)
          .attr('r', gridSize / 2)
          .style('fill', (d) => {
            return lineMap ? `${colourScales[(transpose ? d.x : d.y) - 1](d.value)}` : `${colourScale(d.value)}`;
          });
        if (shape === 'Cakes' || shape === 'Doughnuts') { // The fill-ins for these shapes which will have variable slice
          const shapeFiller = slice;
          gridDistribution.enter().append('path')
            .attr('transform', (d) => `translate(${Math.random() * 10 * gridSize},${Math.random() * 10 * gridSize})
          rotate(${-90})`)
            .attr('d', () => shape === 'Cakes' ?
              d3.arc()
                ({
                  startAngle: 0, endAngle: 0,
                  outerRadius: gridSize / 2, innerRadius: 0
                }) :
              d3.arc()
                ({
                  startAngle: 0, endAngle: Math.PI * 2,
                  innerRadius: 0, outerRadius: 0
                })
            )
            .style('fill', 'green')
            .transition().duration(1000)
            .attr('transform', (d) => `translate(${(d.x - 1 + 0.45) * gridSize},${(d.y - 1 + 0.45) * gridSize})
          rotate(${90})`)
            .attr('d', () => shape === 'Cakes' ?
              d3.arc()
                ({
                  startAngle: 0, endAngle: shapeFiller * Math.PI / 180,
                  outerRadius: gridSize / 2, innerRadius: 0
                }) :
              d3.arc()
                ({
                  startAngle: 0, endAngle: Math.PI * 2,
                  innerRadius: 0, outerRadius: nutScale(shapeFiller / 360) * gridSize / 2
                })
            )
            .style('fill', (d, i) => {
              const uName = `cakeCol${i}`, cakeGradient = svg.append('linearGradient')
                .attr('id', uName)
                .attr('x2', '0%')
                .attr('y2', '50%')
                .attr('x1', '50%')
                .attr('y1', '0%');
              cakeGradient.append('stop').
                attr('offset', '0%').attr('class', 'top').style('stop-color', `${colourScale(d.value)}`);
              cakeGradient.append('stop')
                .attr('offset', '100%').attr('class', 'bottom').style('stop-color', `${colourScale(d.value)}`);
              return `url(#${uName})`;
            });
        }
        gridDistribution.enter().append('text')
          .attr('transform', (d) => `translate(${(d.x - 1) * gridSize}, ${(d.y - 1) * gridSize}) rotate(135)`)
          .attr('dy', 3)
          .attr('class', 'datavals')
          .text((d) => `${d3.format('0.3f')(d.value)}`)
          .transition().duration(1000)
          .attr('transform', (d) => `translate(${(d.x - 1 + 0.45) * gridSize}, ${(d.y - 1 + 0.45) * gridSize}) rotate(-45)`);
        const totalsOnMap = false;
        if (totalsOnMap && this.totalsX.length && this.totalsY.length) {
          const totsy = svg.selectAll('.totalsY')
            .data(transpose ? this.totalsX : this.totalsY).enter().append('g').append('text');
          totsy.attr('class', 'totalsY')
            .attr('transform', (d, i) => `translate(${(i + 0.45) * gridSize},${labelsXY.y.length * gridSize}) rotate(30)`)
            .text((d) => transpose && sortEach ? '' : d3.format('0.2f')(d.value));
          const totsx = svg.selectAll('.totalsX')
            .data(transpose ? this.totalsY : this.totalsX).enter().append('g').append('text');
          totsx.attr('transform', (d, i) => `translate(${labelsXY.x.length * gridSize + 10},${(i + 0.45) * gridSize + 3}) rotate(30)`)
            .attr('class', 'totalsX')
            .text((d) => !transpose && sortEach ? '' : d3.format('0.2f')(d.value));
        }
        const doLegend = false && !lineMap;
        if (doLegend) {
          const scaleC: number[] = [];
          colourScale.quantiles().forEach((d) => scaleC.push(d));
          const legend = svg.selectAll('.legend')
            .data(scaleC);
          const legend_g = legend.enter().append('g')
            .attr('class', 'legend');
          legend_g.append('rect')
            .attr('x', (d, i) => legendElementWidth * i)
            .attr('y', (labelsXY.y.length + 0.5) * gridSize)
            .attr('width', legendElementWidth)
            .attr('height', legendSize / 2)
            .style('fill', (d, i) => `${colourScale(d)}`)
            .on('mouseover', (d, idd, jj) => {
              this.tooltip.style('opacity', 0.9);
              const [tX, tY] = this.toolTipPosition(idd, jj, width, height);
              this.tooltip
                .html(`<app-icon><fa><i class="fa fa-envira leafy"></i></fa>
                </app-icon>${d3.format('0.2f')(d)}`)
                .style('left', tX)
                .style('top', tY);
            })
            .on('mouseout', () => this.tooltip.style('opacity', 0));
          legend_g.append('text')
            .attr('class', 'legend')
            .text((d) => '\uf07e ' + /* '≥ '*/ + d3.format('0.2f')(d))
            .attr('x', (d, i) => legendElementWidth * (i + 0.25))
            .attr('y', (labelsXY.y.length + 0.5) * gridSize + legendSize / 4 + 3);
        }
      };
    heatmapChart(lineMap ? 'Circles' : this.chosenShape);
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
      .call(this.wrapFunction, cfg.wrapWidth, cfg.lineHeight);

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
