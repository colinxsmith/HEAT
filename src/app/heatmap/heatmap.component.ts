import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-heatmap',
  template: ' ',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.setUp();
  }

  setUp() {
    let squares: boolean;
    const temp = d3.select('body').append('g').attr('class', 'heatcolours'),
      colourrange: any[] = [];
    colourrange[0] = temp.style('fill');
    colourrange[1] = temp.style('stroke');
    temp.remove();
    const labelsXY: { x: string[], y: string[] } = { x: [' '], y: [' '] };
    let transpose = true, x: string[], y: string[];
    x = ['CGT', 'Consol Port', 'JHP OEIC 100%', 'JHP OEIC sig', 'New Port', 'Other deferal', 'Transitioning'],
      y = ['Risk', 'Concentration', 'Max hld wgt', 'Buy-list', 'Sector', 'AA EQ UK KE', 'AA EQ INT KE', 'AA SV BD KE',
        'AA CP BD KE', 'AA CA KE', 'AA AB RT KE', 'AA COMM KE', 'AA HEDGE KE', 'AA PROP KE', 'Total'];
    if (transpose) {
      labelsXY.x = y;
      labelsXY.y = x;
    } else {
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
    const coloursd = d3.scaleLinear()
      .domain([0, buckets])
      .range([
        +d3.rgb(colourrange[0]),
        +d3.rgb(colourrange[1])
      ]),
      datasets = ['data3.tsv', 'data3.tsv'],
      colors: number[] = [];
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
        .attr('transform', (d, i) => `translate(-5,${(i + 0.6) * gridSize})` )
        .attr('class', 'yLabel mono axis-y' ),

   timeLabels = svg.selectAll('.xLabel')
      .data(labelsXY.x)
      .enter().append('text')
        .text((d) => d)
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'right')
        .attr('transform', (d, i) => `translate(${(i + 0.55) * gridSize},-5) rotate(270)`)
        .attr('class', 'xLabel mono axis-x');

    const  type = function (d: {x: number, y: number, value: number}) {
      if (transpose) {
          return {
              y: d.x,
              x: d.y,
              value: d.value
          };
      } else {
          return {
              y: d.y,
              x: d.x,
              value: d.value
          };
      }
}, totalsX = [], totalsY = [],
      heatmapChart = function (tsvFile, circ) {
        console.log(colourrange);
        coloursd.range([+d3.rgb(colourrange[0]), +d3.rgb(colourrange[1])]);
        labelsXY.x.forEach(function (d, ii) {
          colors[ii] = coloursd(ii);
        });
        d3.tsv(tsvFile,  (error, data: { x: number, y: number, value: number }[]) => {
          if (error) { throw error; }
          const datan = [], totalsXX = [], totalsYY = [];
          data.forEach(function (d) {
            if (labelsXY.y[d.y - 1] === 'Total') {
              totalsYY.push(d.value);
            } else if (labelsXY.x[d.x - 1] === 'Total') {
              totalsXX.push(d.value);
            } else {
              datan.push(d);
            }
          });
          data = datan;
          const colorScale: d3.ScaleQuantile<number> = d3.scaleQuantile()
            .domain([0, buckets, d3.max(data, (d: { x: number, y: number, value: number }) => d.value)])
            .range(colors);

          const cards = svg.selectAll('.values')
            .data(data, (d: { x: number, y: number, value: number }) => d.y + ':' + d.x);


          if (circ) {
            cards.enter().append('circle')
              .attr('cx', (d) => (d.x - 1 + 0.45) * gridSize)
              .attr('cy', (d) => (d.y - 1 + 0.45) * gridSize)
              .attr('class', 'values circle bordered')
              .attr('r', gridSize / 2.5)
              .style('fill', colors[0])
              .merge(cards)
              .transition()
              .duration(100)
              .style('fill', (d) => colorScale(d.value));
          } else {
            cards.enter().append('rect')
              .attr('x', (d) => (d.x - 1) * gridSize)
              .attr('y', (d) => (d.y - 1) * gridSize)
              .attr('rx', 0)
              .attr('ry', 0)
              .attr('class', 'values rect bordered')
              .attr('width', gridSize)
              .attr('height', gridSize)
              .style('fill', colors[0])
              .merge(cards)
              .transition()
              .duration(100)
              .style('fill', (d) => colorScale(d.value));
          }
          cards.exit().remove();

       cards.enter().append('text')
          .attr('x', (d) => (d.x - 1 + 0.45) * gridSize)
          .attr('y', (d) => (d.y - 1 + 0.45) * gridSize)
          .attr('dy', 3)
    .attr('class', 'text datavals')
          .html((d) => ' ' + d.value);

   const totsy = svg.selectAll('.totalsY')
  .data(totalsY).enter().append('g').append('text');

          totsy.attr('x', (d, i) => (i + 0.45) * gridSize)
          .attr('y', labelsXY.y.length * gridSize - 6)
    .attr('class', 'text totalsY')
         .html((d) => d);
      totsy.exit().remove();
   const totsx = svg.selectAll('.totalsX')
  .data(totalsX).enter().append('g').append('text');

          totsx.attr('y', (d, i) => (i + 0.45) * gridSize + 3)
          .attr('x', labelsXY.x.length * gridSize - 25)
    .attr('class', 'text totalsX')
         .html((d) => d);
      totsx.exit().remove();
colorScale.quantiles();
     const legend = svg.selectAll('.legend')
          .data([].concat(colorScale.quantiles()), (d) => d);

      const legend_g = legend.enter().append('g')
          .attr('class', 'legend');

      legend_g.append('rect')
        .attr('x', (d, i) => legendElementWidth * i)
        .attr('y', function() {
    console.log(height + ((buckets === labelsXY.x.length) ? 0 : 10));
    return height + ((buckets === labelsXY.x.length) ? 0 : 10);
    })
        .attr('width', legendElementWidth)
        .attr('height', gridSize / 2)
        .style('fill', (d, i) => colors[i]);

      legend_g.append('text')
        .attr('class', 'mono')
        .text((d) => '≥ ' + Math.round(d))
        .attr('x', (d, i) => legendElementWidth * i)
        .attr('y', height + gridSize * 1.5);

      legend.exit().remove();
    });
  };

  heatmapChart(datasets[1], squares  ? 0 : 1);

  const datasetpicker = d3.select('#dataset-picker')
    .selectAll('.dataset-button')
    .data(datasets);

  datasetpicker.enter()
    .append('input')
    .attr('value', (d, i) => `Data ${d} with ${(i % 2 === 0 ? 'circles.' : 'squares.')}`)
    .attr('type', 'button')
    .attr('class', 'dataset-button')
    .on('click', function(d, i) {
  d3.selectAll('.values').remove();
  d3.selectAll('.legend').remove();
  d3.selectAll('.totalsY').remove();
  squares = (i === 1 ? true : false);
  heatmapChart(d, (i % 2 === 0 ? 1 : 0));
  });
const colourpick = d3.select('#colour-picker')
.selectAll('text')
.data(colourrange);

colourpick.enter()
.append('input')
.attr('type', 'text')
.attr('name', (d, i) => `Choose ${i === 0 ? 'lower' : 'upper'} colour`)
.attr('value', (d) => d)
.on('change', function(d, i, obb) {
  colourrange[i] = obb[i].value;
  console.log(colourrange);
  });

    const transposer = d3.select('#transpose')
    .selectAll('button').data([transpose])
    .enter()
    .append('input')
    .attr('type', 'button')
    .attr('value', 'Transpose')
    .on('click', function(d) {
    location.reload();
  });
}
}

