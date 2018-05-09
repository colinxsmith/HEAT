import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import { RGBColor } from 'd3';
@Component({
  selector: 'app-heatmap',
  template: '<button  (click)="setTrans()"> Transpose</button><button (click)="setSquares()">Squares</button>',
  styleUrls: ['./heatmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnInit {
  heatData = [{ y: 1, x: 1, value: 21 }, { y: 1, x: 2, value: 12 }, { y: 1, x: 3, value: 65 },
  { y: 1, x: 4, value: 3 }, { y: 1, x: 5, value: 1 }, { y: 1, x: 6, value: 57 }, { y: 1, x: 7, value: 1 }, { y: 2, x: 1, value: 7 },
  { y: 2, x: 2, value: 1 }, { y: 2, x: 3, value: 5 }, { y: 2, x: 4, value: 1 }, { y: 2, x: 5, value: 0 }, { y: 2, x: 6, value: 1 },
  { y: 2, x: 7, value: 0 }, { y: 3, x: 1, value: 31 }, { y: 3, x: 2, value: 1 }, { y: 3, x: 3, value: 4 }, { y: 3, x: 4, value: 19 },
  { y: 3, x: 5, value: 0 }, { y: 3, x: 6, value: 9 }, { y: 3, x: 7, value: 0 }, { y: 4, x: 1, value: 58 }, { y: 4, x: 2, value: 0 },
  { y: 4, x: 3, value: 4 }, { y: 4, x: 4, value: 19 }, { y: 4, x: 5, value: 0 }, { y: 4, x: 6, value: 18 }, { y: 4, x: 7, value: 0 },
  { y: 5, x: 1, value: 48 }, { y: 5, x: 2, value: 3 }, { y: 5, x: 3, value: 29 }, { y: 5, x: 4, value: 23 },
  { y: 5, x: 5, value: 0 },
  { y: 5, x: 6, value: 28 }, { y: 5, x: 7, value: 1 }, { y: 6, x: 1, value: 26 }, { y: 6, x: 2, value: 0 }, { y: 6, x: 3, value: 5 },
  { y: 6, x: 4, value: 18 }, { y: 6, x: 5, value: 0 }, { y: 6, x: 6, value: 7 }, { y: 6, x: 7, value: 1 }, { y: 7, x: 1, value: 23 },
  { y: 7, x: 2, value: 2 }, { y: 7, x: 3, value: 4 }, { y: 7, x: 4, value: 21 }, { y: 7, x: 5, value: 0 }, { y: 7, x: 6, value: 9 },
  { y: 7, x: 7, value: 1 }, { y: 8, x: 1, value: 16 }, { y: 8, x: 2, value: 2 }, { y: 8, x: 3, value: 7 }, { y: 8, x: 4, value: 9 },
  { y: 8, x: 5, value: 0 }, { y: 8, x: 6, value: 3 }, { y: 8, x: 7, value: 0 }, { y: 9, x: 1, value: 6 },
  { y: 9, x: 2, value: 0 }, { y: 9, x: 3, value: 0 }, { y: 9, x: 4, value: 1 }, { y: 9, x: 5, value: 0 },
  { y: 9, x: 6, value: 5 }, { y: 9, x: 7, value: 0 }, { y: 10, x: 1, value: 12 }, { y: 10, x: 2, value: 1 },
  { y: 10, x: 3, value: 13 }, { y: 10, x: 4, value: 11 }, { y: 10, x: 5, value: 0 }, { y: 10, x: 6, value: 6 },
  { y: 10, x: 7, value: 1 }, { y: 11, x: 1, value: 18 }, { y: 11, x: 2, value: 1 }, { y: 11, x: 3, value: 21 },
  { y: 11, x: 4, value: 18 }, { y: 11, x: 5, value: 0 }, { y: 11, x: 6, value: 11 }, { y: 11, x: 7, value: 0 },
  { y: 12, x: 1, value: 0 }, { y: 12, x: 2, value: 0 }, { y: 12, x: 3, value: 0 }, { y: 12, x: 4, value: 0 },
  { y: 12, x: 5, value: 0 }, { y: 12, x: 6, value: 1 }, { y: 12, x: 7, value: 0 }, { y: 13, x: 1, value: 9 },
  { y: 13, x: 2, value: 0 }, { y: 13, x: 3, value: 0 }, { y: 13, x: 4, value: 0 }, { y: 13, x: 5, value: 0 },
  { y: 13, x: 6, value: 4 }, { y: 13, x: 7, value: 0 }, { y: 14, x: 1, value: 1 }, { y: 14, x: 2, value: 0 },
  { y: 14, x: 3, value: 0 }, { y: 14, x: 4, value: 0 }, { y: 14, x: 5, value: 0 }, { y: 14, x: 6, value: 0 },
  { y: 14, x: 7, value: 0 }, { y: 15, x: 1, value: 276 }, { y: 15, x: 2, value: 23 },
  { y: 15, x: 3, value: 157 }, { y: 15, x: 4, value: 143 }, { y: 15, x: 5, value: 1 },
  { y: 15, x: 6, value: 159 }, { y: 15, x: 7, value: 5 }];
  transpose = false;
  squares = false;
  constructor() { }

  ngOnInit() {
    this.setUp();
  }

  setTrans() {
    this.transpose = !this.transpose;
    d3.select('app-heatmap').select('svg').remove();
    this.setUp();
  }
  setSquares() {
    this.squares = !this.squares;
    d3.select('app-heatmap').select('svg').remove();
    this.setUp();
  }

  setUp() {
    const squares = this.squares,
      transpose = this.transpose,
      colourrange = ['red', 'blue'],
      labelsXY = { x: [' '], y: [' '] }, heatData: {x: number, y: number, value: number}[] = [];
      console.log('transpose' + transpose);
      let x: string[], y: string[];
    x = ['CGT', 'Consol Port', 'JHP OEIC 100%', 'JHP OEIC sig', 'New Port', 'Other deferal', 'Transitioning'],
      y = ['Risk', 'Concentration', 'Max hld wgt', 'Buy-list', 'Sector', 'AA EQ UK KE', 'AA EQ INT KE', 'AA SV BD KE',
        'AA CP BD KE', 'AA CA KE', 'AA AB RT KE', 'AA COMM KE', 'AA HEDGE KE', 'AA PROP KE', 'Total'];
    if (transpose) {
      console.log('labels XY');
      labelsXY.x = y;
      labelsXY.y = x;
    } else {
      console.log('labels XX');
      labelsXY.x = x;
      labelsXY.y = y;
    }
    let buckets = labelsXY.x.length;
    const margin = { top: 120, right: 0, bottom: 100, left: 130 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      gridSize = Math.min(Math.floor(width / labelsXY.x.length), Math.floor(height / labelsXY.y.length)),
      legendElementWidth = gridSize;
    if (labelsXY.x[buckets - 1] === 'Total') { buckets--; }
    const coloursd = d3.scaleLinear<RGBColor>()
      .domain([0, buckets])
      .range([d3.rgb(colourrange[0]), d3.rgb(colourrange[1])]),
      colors: RGBColor[] = [];
    labelsXY.x.forEach(function (d, ii) {
      colors[ii] = coloursd(ii);
    });

    const svg = d3.select('app-heatmap').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),

      dayLabels = svg.selectAll('.yLabel')
        .data(labelsXY.y)
        .enter().append('text')
        .text((d) => d)
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'end')
        .attr('transform', (d, i) => `translate(-5,${(i + 0.6) * gridSize})`)
        .attr('class', 'yLabel mono axis-y'),

      timeLabels = svg.selectAll('.xLabel')
        .data(labelsXY.x)
        .enter().append('text')
        .text((d) => d)
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'right')
        .attr('transform', (d, i) => `translate(${(i + 0.55) * gridSize},-5) rotate(270)`)
        .attr('class', 'xLabel mono axis-x'),

      type = function (d: { x: number, y: number, value: number }) {
        if (transpose) {
          console.log('value XY');
          return {
            y: d.x,
            x: d.y,
            value: d.value
          };
        } else {
          console.log('values XX');
          return {
            y: d.y,
            x: d.x,
            value: d.value
          };
        }
      }, totalsX = [], totalsY = [], THIS = this,
      heatmapChart = function (circ: boolean) {
        THIS.heatData.forEach(function (d) {
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
          .domain([0, buckets, d3.max(heatData, (d: { x: number, y: number, value: number }) => d.value)])
          .range(colors);

        const cards = svg.selectAll('.values')
          .data(heatData, (d: { x: number, y: number, value: number }) => d.y + ':' + d.x);


        if (circ) {
          cards.enter().append('circle')
            .attr('cx', (d) => (d.x - 1 + 0.45) * gridSize)
            .attr('cy', (d) => (d.y - 1 + 0.45) * gridSize)
            .attr('class', 'values circle bordered')
            .attr('r', gridSize / 2.5)
            .style('fill', ' ' +colors[0])
            .merge(cards)
            .transition()
            .duration(100)
            .style('fill', (d) => ' '+ colorScale(d.value));
        } else {
          cards.enter().append('rect')
            .attr('x', (d) => (d.x - 1) * gridSize)
            .attr('y', (d) => (d.y - 1) * gridSize)
            .attr('rx', 0)
            .attr('ry', 0)
            .attr('class', 'values rect bordered')
            .attr('width', gridSize)
            .attr('height', gridSize)
            .style('fill', ' ' + colors[0])
            .merge(cards)
            .transition()
            .duration(100)
            .style('fill', (d) => ' ' + colorScale(d.value));
        }
        cards.exit().remove();

        cards.enter().append('text')
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
        colorScale.quantiles();
        const legend = svg.selectAll('.legend')
          .data([].concat(colorScale.quantiles()), (d) => d);

        const legend_g = legend.enter().append('g')
          .attr('class', 'legend');

        legend_g.append('rect')
          .attr('x', (d, i) => legendElementWidth * i)
          .attr('y', function () {
            console.log(height + ((buckets === labelsXY.x.length) ? 0 : 10));
            return height + ((buckets === labelsXY.x.length) ? 0 : 10);
          })
          .attr('width', legendElementWidth)
          .attr('height', gridSize / 2)
          .style('fill', (d, i) => ' '+colors[i]);

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

