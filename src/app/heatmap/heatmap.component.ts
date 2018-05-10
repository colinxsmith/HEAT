import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import { RGBColor } from 'd3';
@Component({
  selector: 'app-heatmap',
  template: '<button  (click)="setPad()"> {{padButt}}</button><button  (click)="setTrans()"> Transpose</button><button (click)="setSquares()">{{butName}}</button><select (change)="chooseData($event.target.value)"><option *ngFor="let i of diags">{{i}}</option></select>',
  styleUrls: ['./heatmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapComponent implements OnInit {
  diags = ['Clients', 'BMIDs'];
  managerX: string[] = [];
  managerY: string[] = [];
  managerPlot: {x: number, y: number, value: number}[] = [];
  managerData = [
    { x: 'London', y: 'A', value: 155.000000 },
    { x: 'London', y: 'B', value: 45.000000 },
    { x: 'London', y: 'C', value: 143.000000 },
    { x: 'London', y: 'D', value: 329.000000 },
    { x: 'London', y: 'E', value: 135.000000 },
    { x: 'London', y: 'F', value: 41.000000 },
    { x: 'London', y: 'G', value: 99.000000 },
    { x: 'London', y: 'H', value: 233.000000 },
    { x: 'London', y: 'I', value: 358.000000 },
    { x: 'London', y: 'J', value: 45.000000 },
    { x: 'London', y: 'K', value: 117.000000 },
    { x: 'London', y: 'L', value: 58.000000 },
    { x: 'London', y: 'M', value: 385.000000 },
    { x: 'London', y: 'N', value: 389.000000 },
    { x: 'London', y: 'O', value: 17.000000 },
    { x: 'London', y: 'P', value: 131.000000 },
    { x: 'London', y: 'R', value: 81.000000 },
    { x: 'London', y: 'S', value: 269.000000 },
    { x: 'London', y: 'T', value: 187.000000 },
    { x: 'London', y: 'U', value: 3.000000 },
    { x: 'London', y: 'V', value: 151.000000 },
    { x: 'London', y: 'W', value: 7.000000 },
    { x: 'London', y: 'X', value: 11.000000 },
    { x: 'London', y: 'Y', value: 6.000000 },
    { x: 'London', y: 'Z', value: 24.000000 },
    { x: 'New York', y: 'A', value: 285.000000 },
    { x: 'New York', y: 'B', value: 359.000000 },
    { x: 'New York', y: 'C', value: 436.000000 },
    { x: 'New York', y: 'D', value: 240.000000 },
    { x: 'New York', y: 'E', value: 126.000000 },
    { x: 'New York', y: 'F', value: 46.000000 },
    { x: 'New York', y: 'G', value: 168.000000 },
    { x: 'New York', y: 'H', value: 1.000000 },
    { x: 'New York', y: 'I', value: 121.000000 },
    { x: 'New York', y: 'J', value: 7.000000 },
    { x: 'New York', y: 'K', value: 3.000000 },
    { x: 'New York', y: 'L', value: 42.000000 },
    { x: 'New York', y: 'M', value: 55.000000 },
    { x: 'New York', y: 'N', value: 49.000000 },
    { x: 'New York', y: 'O', value: 22.000000 },
    { x: 'New York', y: 'P', value: 404.000000 },
    { x: 'New York', y: 'R', value: 1.000000 },
    { x: 'New York', y: 'S', value: 22.000000 },
    { x: 'New York', y: 'T', value: 518.000000 },
    { x: 'New York', y: 'U', value: 93.000000 },
    { x: 'New York', y: 'V', value: 4.000000 },
    { x: 'New York', y: 'W', value: 76.000000 },
    { x: 'New York', y: 'X', value: 1.000000 },
    { x: 'New York', y: 'Y', value: 83.000000 },
    { x: 'New York', y: 'Z', value: 23.000000 },
    { x: 'Paris', y: 'A', value: 89.000000 },
    { x: 'Paris', y: 'B', value: 240.000000 },
    { x: 'Paris', y: 'C', value: 31.000000 },
    { x: 'Paris', y: 'D', value: 26.000000 },
    { x: 'Paris', y: 'E', value: 75.000000 },
    { x: 'Paris', y: 'F', value: 50.000000 },
    { x: 'Paris', y: 'G', value: 290.000000 },
    { x: 'Paris', y: 'H', value: 196.000000 },
    { x: 'Paris', y: 'I', value: 86.000000 },
    { x: 'Paris', y: 'J', value: 25.000000 },
    { x: 'Paris', y: 'K', value: 11.000000 },
    { x: 'Paris', y: 'L', value: 161.000000 },
    { x: 'Paris', y: 'M', value: 2.000000 },
    { x: 'Paris', y: 'N', value: 108.000000 },
    { x: 'Paris', y: 'O', value: 122.000000 },
    { x: 'Paris', y: 'P', value: 232.000000 },
    { x: 'Paris', y: 'R', value: 586.000000 },
    { x: 'Paris', y: 'S', value: 2.000000 },
    { x: 'Paris', y: 'T', value: 141.000000 },
    { x: 'Paris', y: 'U', value: 7.000000 },
    { x: 'Paris', y: 'V', value: 21.000000 },
    { x: 'Paris', y: 'W', value: 219.000000 },
    { x: 'Paris', y: 'X', value: 27.000000 },
    { x: 'Paris', y: 'Y', value: 10.000000 },
    { x: 'Frankfurt', y: 'A', value: 4.000000 },
    { x: 'Frankfurt', y: 'B', value: 43.000000 },
    { x: 'Frankfurt', y: 'C', value: 2.000000 },
    { x: 'Frankfurt', y: 'D', value: 5.000000 },
    { x: 'Frankfurt', y: 'E', value: 99.000000 },
    { x: 'Frankfurt', y: 'F', value: 33.000000 },
    { x: 'Frankfurt', y: 'G', value: 280.000000 },
    { x: 'Frankfurt', y: 'H', value: 127.000000 },
    { x: 'Frankfurt', y: 'I', value: 16.000000 },
    { x: 'Frankfurt', y: 'J', value: 320.000000 },
    { x: 'Frankfurt', y: 'K', value: 1.000000 },
    { x: 'Frankfurt', y: 'L', value: 73.000000 },
    { x: 'Frankfurt', y: 'M', value: 150.000000 },
    { x: 'Frankfurt', y: 'N', value: 154.000000 },
    { x: 'Frankfurt', y: 'O', value: 50.000000 },
    { x: 'Frankfurt', y: 'P', value: 1.000000 },
    { x: 'Frankfurt', y: 'R', value: 230.000000 },
    { x: 'Frankfurt', y: 'S', value: 586.000000 },
    { x: 'Frankfurt', y: 'T', value: 149.000000 },
    { x: 'Frankfurt', y: 'U', value: 157.000000 },
    { x: 'Frankfurt', y: 'V', value: 227.000000 },
    { x: 'Frankfurt', y: 'W', value: 2.000000 },
    { x: 'Frankfurt', y: 'X', value: 70.000000 },
    { x: 'Frankfurt', y: 'Y', value: 12.000000 },
    { x: 'Tokyo', y: 'A', value: 207.000000 },
    { x: 'Tokyo', y: 'B', value: 61.000000 },
    { x: 'Tokyo', y: 'C', value: 174.000000 },
    { x: 'Tokyo', y: 'D', value: 258.000000 },
    { x: 'Tokyo', y: 'E', value: 217.000000 },
    { x: 'Tokyo', y: 'F', value: 127.000000 },
    { x: 'Tokyo', y: 'G', value: 161.000000 },
    { x: 'Tokyo', y: 'H', value: 3.000000 },
    { x: 'Tokyo', y: 'I', value: 52.000000 },
    { x: 'Tokyo', y: 'J', value: 79.000000 },
    { x: 'Tokyo', y: 'K', value: 34.000000 },
    { x: 'Tokyo', y: 'L', value: 45.000000 },
    { x: 'Tokyo', y: 'M', value: 2.000000 },
    { x: 'Tokyo', y: 'N', value: 260.000000 },
    { x: 'Tokyo', y: 'O', value: 156.000000 },
    { x: 'Tokyo', y: 'P', value: 128.000000 },
    { x: 'Tokyo', y: 'R', value: 7.000000 },
    { x: 'Tokyo', y: 'S', value: 4.000000 },
    { x: 'Tokyo', y: 'T', value: 9.000000 },
    { x: 'Tokyo', y: 'U', value: 39.000000 },
    { x: 'Tokyo', y: 'V', value: 278.000000 },
    { x: 'Tokyo', y: 'W', value: 135.000000 },
    { x: 'Tokyo', y: 'X', value: 14.000000 },
    { x: 'Tokyo', y: 'Y', value: 69.000000 },
    { x: 'Sydney', y: 'A', value: 175.000000 },
    { x: 'Sydney', y: 'B', value: 7.000000 },
    { x: 'Sydney', y: 'C', value: 328.000000 },
    { x: 'Sydney', y: 'D', value: 559.000000 },
    { x: 'Sydney', y: 'E', value: 186.000000 },
    { x: 'Sydney', y: 'F', value: 5.000000 },
    { x: 'Sydney', y: 'G', value: 113.000000 },
    { x: 'Sydney', y: 'H', value: 141.000000 },
    { x: 'Sydney', y: 'I', value: 32.000000 },
    { x: 'Sydney', y: 'J', value: 557.000000 },
    { x: 'Sydney', y: 'L', value: 1.000000 },
    { x: 'Sydney', y: 'M', value: 192.000000 },
    { x: 'Sydney', y: 'N', value: 1.000000 },
    { x: 'Sydney', y: 'R', value: 18.000000 },
    { x: 'Sydney', y: 'S', value: 9.000000 },
    { x: 'Sydney', y: 'T', value: 239.000000 },
    { x: 'Sydney', y: 'U', value: 5.000000 },
    { x: 'Sydney', y: 'W', value: 340.000000 },
    { x: 'Sydney', y: 'X', value: 3.000000 },
    { x: 'Hong Kong', y: 'A', value: 39.000000 },
    { x: 'Hong Kong', y: 'B', value: 32.000000 },
    { x: 'Hong Kong', y: 'C', value: 8.000000 },
    { x: 'Hong Kong', y: 'D', value: 5.000000 },
    { x: 'Hong Kong', y: 'E', value: 108.000000 },
    { x: 'Hong Kong', y: 'F', value: 179.000000 },
    { x: 'Hong Kong', y: 'G', value: 217.000000 },
    { x: 'Hong Kong', y: 'H', value: 5.000000 },
    { x: 'Hong Kong', y: 'I', value: 8.000000 },
    { x: 'Hong Kong', y: 'J', value: 21.000000 },
    { x: 'Hong Kong', y: 'M', value: 275.000000 },
    { x: 'Hong Kong', y: 'N', value: 113.000000 },
    { x: 'Hong Kong', y: 'R', value: 57.000000 },
    { x: 'Hong Kong', y: 'S', value: 155.000000 },
    { x: 'Hong Kong', y: 'T', value: 49.000000 },
    { x: 'Hong Kong', y: 'U', value: 12.000000 },
    { x: 'Hong Kong', y: 'W', value: 70.000000 },
    { x: 'Hong Kong', y: 'X', value: 213.000000 },
    { x: 'Geneva', y: 'A', value: 38.000000 },
    { x: 'Geneva', y: 'B', value: 1.000000 },
    { x: 'Geneva', y: 'C', value: 369.000000 },
    { x: 'Geneva', y: 'D', value: 12.000000 },
    { x: 'Geneva', y: 'E', value: 30.000000 },
    { x: 'Geneva', y: 'G', value: 365.000000 },
    { x: 'Geneva', y: 'H', value: 227.000000 },
    { x: 'Geneva', y: 'I', value: 1.000000 },
    { x: 'Geneva', y: 'J', value: 392.000000 },
    { x: 'Geneva', y: 'M', value: 1.000000 },
    { x: 'Geneva', y: 'N', value: 1.000000 },
    { x: 'Geneva', y: 'R', value: 29.000000 },
    { x: 'Geneva', y: 'S', value: 341.000000 },
    { x: 'Geneva', y: 'T', value: 1.000000 },
    { x: 'Geneva', y: 'U', value: 160.000000 },
    { x: 'Geneva', y: 'W', value: 286.000000 },
    { x: 'Geneva', y: 'X', value: 57.000000 },
    { x: 'Toronto', y: 'A', value: 176.000000 },
    { x: 'Toronto', y: 'B', value: 222.000000 },
    { x: 'Toronto', y: 'C', value: 7.000000 },
    { x: 'Toronto', y: 'D', value: 135.000000 },
    { x: 'Toronto', y: 'G', value: 138.000000 },
    { x: 'Toronto', y: 'H', value: 288.000000 },
    { x: 'Toronto', y: 'J', value: 1.000000 },
    { x: 'Toronto', y: 'M', value: 26.000000 },
    { x: 'Toronto', y: 'N', value: 1.000000 },
    { x: 'Toronto', y: 'R', value: 22.000000 },
    { x: 'Toronto', y: 'S', value: 1.000000 },
    { x: 'Toronto', y: 'T', value: 76.000000 },
    { x: 'Toronto', y: 'U', value: 128.000000 },
    { x: 'Toronto', y: 'W', value: 96.000000 },
    { x: 'Dubai', y: 'A', value: 96.000000 },
    { x: 'Dubai', y: 'C', value: 1.000000 },
    { x: 'Dubai', y: 'D', value: 279.000000 },
    { x: 'Dubai', y: 'G', value: 66.000000 },
    { x: 'Dubai', y: 'J', value: 158.000000 },
    { x: 'Dubai', y: 'M', value: 52.000000 },
    { x: 'Dubai', y: 'N', value: 183.000000 },
    { x: 'Dubai', y: 'R', value: 7.000000 },
    { x: 'Dubai', y: 'S', value: 24.000000 },
    { x: 'Dubai', y: 'T', value: 234.000000 },
    { x: 'Dubai', y: 'U', value: 5.000000 },
    { x: 'Luxembourg', y: 'A', value: 25.000000 },
    { x: 'Luxembourg', y: 'C', value: 172.000000 },
    { x: 'Luxembourg', y: 'D', value: 58.000000 },
    { x: 'Luxembourg', y: 'G', value: 45.000000 },
    { x: 'Luxembourg', y: 'J', value: 3.000000 },
    { x: 'Luxembourg', y: 'M', value: 162.000000 },
    { x: 'Luxembourg', y: 'N', value: 1.000000 },
    { x: 'Luxembourg', y: 'R', value: 130.000000 },
    { x: 'Luxembourg', y: 'S', value: 175.000000 },
    { x: 'Luxembourg', y: 'T', value: 24.000000 },
    { x: 'Luxembourg', y: 'U', value: 1.000000 },
    { x: 'Madrid', y: 'A', value: 229.000000 },
    { x: 'Madrid', y: 'D', value: 66.000000 },
    { x: 'Madrid', y: 'G', value: 561.000000 },
    { x: 'Madrid', y: 'J', value: 53.000000 },
    { x: 'Madrid', y: 'M', value: 6.000000 },
    { x: 'Madrid', y: 'R', value: 73.000000 },
    { x: 'Oslo', y: 'G', value: 8.000000 },
    { x: 'Oslo', y: 'J', value: 7.000000 },
    { x: 'Oslo', y: 'M', value: 112.000000 },
    { x: 'Oslo', y: 'R', value: 2.000000 },
    { x: 'Moscow', y: 'G', value: 5.000000 },
    { x: 'Moscow', y: 'J', value: 126.000000 },
    { x: 'Moscow', y: 'M', value: 3.000000 },
    { x: 'Edinburgh', y: 'G', value: 22.000000 },
  ];
  managerData1 = [
    {x: 'London', y: 'A', value: 166.000000 },
{x: 'London', y: 'B', value: 47.000000 },
{x: 'London', y: 'C', value: 159.000000 },
{x: 'London', y: 'D', value: 389.000000 },
{x: 'London', y: 'E', value: 155.000000 },
{x: 'London', y: 'F', value: 50.000000 },
{x: 'London', y: 'G', value: 150.000000 },
{x: 'London', y: 'H', value: 264.000000 },
{x: 'London', y: 'I', value: 467.000000 },
{x: 'London', y: 'J', value: 47.000000 },
{x: 'London', y: 'K', value: 123.000000 },
{x: 'London', y: 'L', value: 74.000000 },
{x: 'London', y: 'M', value: 509.000000 },
{x: 'London', y: 'N', value: 404.000000 },
{x: 'London', y: 'O', value: 22.000000 },
{x: 'London', y: 'P', value: 162.000000 },
{x: 'London', y: 'R', value: 98.000000 },
{x: 'London', y: 'S', value: 328.000000 },
{x: 'London', y: 'T', value: 222.000000 },
{x: 'London', y: 'U', value: 3.000000 },
{x: 'London', y: 'V', value: 157.000000 },
{x: 'London', y: 'W', value: 7.000000 },
{x: 'London', y: 'X', value: 12.000000 },
{x: 'London', y: 'Y', value: 7.000000 },
{x: 'London', y: 'Z', value: 24.000000 },
{x: 'New York', y: 'A', value: 433.000000 },
{x: 'New York', y: 'B', value: 388.000000 },
{x: 'New York', y: 'C', value: 540.000000 },
{x: 'New York', y: 'D', value: 258.000000 },
{x: 'New York', y: 'E', value: 157.000000 },
{x: 'New York', y: 'F', value: 50.000000 },
{x: 'New York', y: 'G', value: 191.000000 },
{x: 'New York', y: 'H', value: 1.000000 },
{x: 'New York', y: 'I', value: 136.000000 },
{x: 'New York', y: 'J', value: 23.000000 },
{x: 'New York', y: 'K', value: 4.000000 },
{x: 'New York', y: 'L', value: 49.000000 },
{x: 'New York', y: 'M', value: 58.000000 },
{x: 'New York', y: 'N', value: 49.000000 },
{x: 'New York', y: 'O', value: 25.000000 },
{x: 'New York', y: 'P', value: 438.000000 },
{x: 'New York', y: 'R', value: 1.000000 },
{x: 'New York', y: 'S', value: 26.000000 },
{x: 'New York', y: 'T', value: 582.000000 },
{x: 'New York', y: 'U', value: 116.000000 },
{x: 'New York', y: 'V', value: 4.000000 },
{x: 'New York', y: 'W', value: 98.000000 },
{x: 'New York', y: 'X', value: 1.000000 },
{x: 'New York', y: 'Y', value: 95.000000 },
{x: 'New York', y: 'Z', value: 24.000000 },
{x: 'Paris', y: 'A', value: 113.000000 },
{x: 'Paris', y: 'B', value: 316.000000 },
{x: 'Paris', y: 'C', value: 43.000000 },
{x: 'Paris', y: 'D', value: 30.000000 },
{x: 'Paris', y: 'E', value: 87.000000 },
{x: 'Paris', y: 'F', value: 62.000000 },
{x: 'Paris', y: 'G', value: 340.000000 },
{x: 'Paris', y: 'H', value: 284.000000 },
{x: 'Paris', y: 'I', value: 102.000000 },
{x: 'Paris', y: 'J', value: 34.000000 },
{x: 'Paris', y: 'K', value: 12.000000 },
{x: 'Paris', y: 'L', value: 188.000000 },
{x: 'Paris', y: 'M', value: 2.000000 },
{x: 'Paris', y: 'N', value: 125.000000 },
{x: 'Paris', y: 'O', value: 127.000000 },
{x: 'Paris', y: 'P', value: 282.000000 },
{x: 'Paris', y: 'R', value: 772.000000 },
{x: 'Paris', y: 'S', value: 5.000000 },
{x: 'Paris', y: 'T', value: 168.000000 },
{x: 'Paris', y: 'U', value: 15.000000 },
{x: 'Paris', y: 'V', value: 31.000000 },
{x: 'Paris', y: 'W', value: 298.000000 },
{x: 'Paris', y: 'X', value: 27.000000 },
{x: 'Paris', y: 'Y', value: 10.000000 },
{x: 'Frankfurt', y: 'A', value: 5.000000 },
{x: 'Frankfurt', y: 'B', value: 44.000000 },
{x: 'Frankfurt', y: 'C', value: 2.000000 },
{x: 'Frankfurt', y: 'D', value: 5.000000 },
{x: 'Frankfurt', y: 'E', value: 114.000000 },
{x: 'Frankfurt', y: 'F', value: 36.000000 },
{x: 'Frankfurt', y: 'G', value: 319.000000 },
{x: 'Frankfurt', y: 'H', value: 154.000000 },
{x: 'Frankfurt', y: 'I', value: 21.000000 },
{x: 'Frankfurt', y: 'J', value: 375.000000 },
{x: 'Frankfurt', y: 'K', value: 1.000000 },
{x: 'Frankfurt', y: 'L', value: 81.000000 },
{x: 'Frankfurt', y: 'M', value: 177.000000 },
{x: 'Frankfurt', y: 'N', value: 166.000000 },
{x: 'Frankfurt', y: 'O', value: 62.000000 },
{x: 'Frankfurt', y: 'P', value: 1.000000 },
{x: 'Frankfurt', y: 'R', value: 260.000000 },
{x: 'Frankfurt', y: 'S', value: 674.000000 },
{x: 'Frankfurt', y: 'T', value: 177.000000 },
{x: 'Frankfurt', y: 'U', value: 200.000000 },
{x: 'Frankfurt', y: 'V', value: 354.000000 },
{x: 'Frankfurt', y: 'W', value: 2.000000 },
{x: 'Frankfurt', y: 'X', value: 74.000000 },
{x: 'Frankfurt', y: 'Y', value: 12.000000 },
{x: 'Tokyo', y: 'A', value: 229.000000 },
{x: 'Tokyo', y: 'B', value: 68.000000 },
{x: 'Tokyo', y: 'C', value: 226.000000 },
{x: 'Tokyo', y: 'D', value: 316.000000 },
{x: 'Tokyo', y: 'E', value: 233.000000 },
{x: 'Tokyo', y: 'F', value: 147.000000 },
{x: 'Tokyo', y: 'G', value: 190.000000 },
{x: 'Tokyo', y: 'H', value: 3.000000 },
{x: 'Tokyo', y: 'I', value: 56.000000 },
{x: 'Tokyo', y: 'J', value: 87.000000 },
{x: 'Tokyo', y: 'K', value: 54.000000 },
{x: 'Tokyo', y: 'L', value: 46.000000 },
{x: 'Tokyo', y: 'M', value: 3.000000 },
{x: 'Tokyo', y: 'N', value: 292.000000 },
{x: 'Tokyo', y: 'O', value: 250.000000 },
{x: 'Tokyo', y: 'P', value: 151.000000 },
{x: 'Tokyo', y: 'R', value: 8.000000 },
{x: 'Tokyo', y: 'S', value: 4.000000 },
{x: 'Tokyo', y: 'T', value: 15.000000 },
{x: 'Tokyo', y: 'U', value: 41.000000 },
{x: 'Tokyo', y: 'V', value: 346.000000 },
{x: 'Tokyo', y: 'W', value: 151.000000 },
{x: 'Tokyo', y: 'X', value: 14.000000 },
{x: 'Tokyo', y: 'Y', value: 79.000000 },
{x: 'Sydney', y: 'A', value: 234.000000 },
{x: 'Sydney', y: 'B', value: 7.000000 },
{x: 'Sydney', y: 'C', value: 406.000000 },
{x: 'Sydney', y: 'D', value: 634.000000 },
{x: 'Sydney', y: 'E', value: 239.000000 },
{x: 'Sydney', y: 'F', value: 5.000000 },
{x: 'Sydney', y: 'G', value: 134.000000 },
{x: 'Sydney', y: 'H', value: 149.000000 },
{x: 'Sydney', y: 'I', value: 41.000000 },
{x: 'Sydney', y: 'J', value: 651.000000 },
{x: 'Sydney', y: 'L', value: 1.000000 },
{x: 'Sydney', y: 'M', value: 235.000000 },
{x: 'Sydney', y: 'N', value: 1.000000 },
{x: 'Sydney', y: 'R', value: 18.000000 },
{x: 'Sydney', y: 'S', value: 9.000000 },
{x: 'Sydney', y: 'T', value: 274.000000 },
{x: 'Sydney', y: 'U', value: 6.000000 },
{x: 'Sydney', y: 'W', value: 440.000000 },
{x: 'Sydney', y: 'X', value: 3.000000 },
{x: 'Hong Kong', y: 'A', value: 40.000000 },
{x: 'Hong Kong', y: 'B', value: 47.000000 },
{x: 'Hong Kong', y: 'C', value: 9.000000 },
{x: 'Hong Kong', y: 'D', value: 5.000000 },
{x: 'Hong Kong', y: 'E', value: 126.000000 },
{x: 'Hong Kong', y: 'F', value: 205.000000 },
{x: 'Hong Kong', y: 'G', value: 247.000000 },
{x: 'Hong Kong', y: 'H', value: 5.000000 },
{x: 'Hong Kong', y: 'I', value: 9.000000 },
{x: 'Hong Kong', y: 'J', value: 24.000000 },
{x: 'Hong Kong', y: 'M', value: 312.000000 },
{x: 'Hong Kong', y: 'N', value: 121.000000 },
{x: 'Hong Kong', y: 'R', value: 75.000000 },
{x: 'Hong Kong', y: 'S', value: 212.000000 },
{x: 'Hong Kong', y: 'T', value: 60.000000 },
{x: 'Hong Kong', y: 'U', value: 13.000000 },
{x: 'Hong Kong', y: 'W', value: 82.000000 },
{x: 'Hong Kong', y: 'X', value: 250.000000 },
{x: 'Geneva', y: 'A', value: 40.000000 },
{x: 'Geneva', y: 'B', value: 14.000000 },
{x: 'Geneva', y: 'C', value: 385.000000 },
{x: 'Geneva', y: 'D', value: 16.000000 },
{x: 'Geneva', y: 'E', value: 40.000000 },
{x: 'Geneva', y: 'G', value: 404.000000 },
{x: 'Geneva', y: 'H', value: 243.000000 },
{x: 'Geneva', y: 'I', value: 1.000000 },
{x: 'Geneva', y: 'J', value: 499.000000 },
{x: 'Geneva', y: 'M', value: 1.000000 },
{x: 'Geneva', y: 'N', value: 1.000000 },
{x: 'Geneva', y: 'R', value: 36.000000 },
{x: 'Geneva', y: 'S', value: 440.000000 },
{x: 'Geneva', y: 'T', value: 1.000000 },
{x: 'Geneva', y: 'U', value: 175.000000 },
{x: 'Geneva', y: 'W', value: 363.000000 },
{x: 'Geneva', y: 'X', value: 63.000000 },
{x: 'Toronto', y: 'A', value: 222.000000 },
{x: 'Toronto', y: 'B', value: 275.000000 },
{x: 'Toronto', y: 'C', value: 12.000000 },
{x: 'Toronto', y: 'D', value: 162.000000 },
{x: 'Toronto', y: 'G', value: 182.000000 },
{x: 'Toronto', y: 'H', value: 332.000000 },
{x: 'Toronto', y: 'J', value: 2.000000 },
{x: 'Toronto', y: 'M', value: 28.000000 },
{x: 'Toronto', y: 'N', value: 1.000000 },
{x: 'Toronto', y: 'R', value: 25.000000 },
{x: 'Toronto', y: 'S', value: 1.000000 },
{x: 'Toronto', y: 'T', value: 84.000000 },
{x: 'Toronto', y: 'U', value: 143.000000 },
{x: 'Toronto', y: 'W', value: 109.000000 },
{x: 'Dubai', y: 'A', value: 113.000000 },
{x: 'Dubai', y: 'C', value: 1.000000 },
{x: 'Dubai', y: 'D', value: 337.000000 },
{x: 'Dubai', y: 'G', value: 96.000000 },
{x: 'Dubai', y: 'J', value: 210.000000 },
{x: 'Dubai', y: 'M', value: 52.000000 },
{x: 'Dubai', y: 'N', value: 192.000000 },
{x: 'Dubai', y: 'R', value: 8.000000 },
{x: 'Dubai', y: 'S', value: 31.000000 },
{x: 'Dubai', y: 'T', value: 271.000000 },
{x: 'Dubai', y: 'U', value: 5.000000 },
{x: 'Luxembourg', y: 'A', value: 42.000000 },
{x: 'Luxembourg', y: 'C', value: 215.000000 },
{x: 'Luxembourg', y: 'D', value: 75.000000 },
{x: 'Luxembourg', y: 'G', value: 49.000000 },
{x: 'Luxembourg', y: 'J', value: 3.000000 },
{x: 'Luxembourg', y: 'M', value: 191.000000 },
{x: 'Luxembourg', y: 'N', value: 1.000000 },
{x: 'Luxembourg', y: 'R', value: 189.000000 },
{x: 'Luxembourg', y: 'S', value: 201.000000 },
{x: 'Luxembourg', y: 'T', value: 25.000000 },
{x: 'Luxembourg', y: 'U', value: 1.000000 },
{x: 'Madrid', y: 'A', value: 300.000000 },
{x: 'Madrid', y: 'D', value: 73.000000 },
{x: 'Madrid', y: 'G', value: 615.000000 },
{x: 'Madrid', y: 'J', value: 73.000000 },
{x: 'Madrid', y: 'M', value: 7.000000 },
{x: 'Madrid', y: 'R', value: 75.000000 },
{x: 'Oslo', y: 'G', value: 9.000000 },
{x: 'Oslo', y: 'J', value: 7.000000 },
{x: 'Oslo', y: 'M', value: 121.000000 },
{x: 'Oslo', y: 'R', value: 2.000000 },
{x: 'Moscow', y: 'G', value: 6.000000 },
{x: 'Moscow', y: 'J', value: 142.000000 },
{x: 'Moscow', y: 'M', value: 3.000000 },
{x: 'Edinburgh', y: 'G', value: 26.000000 }
  ];
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
  xLabels = ['CGT', 'Consol Port', 'JHP OEIC 100%', 'JHP OEIC sig', 'New Port', 'Other deferal', 'Transitioning'];
  yLabels = ['Risk', 'Concentration', 'Max hld wgt', 'Buy-list', 'Sector', 'AA EQ UK KE', 'AA EQ INT KE', 'AA SV BD KE',
      'AA CP BD KE', 'AA CA KE', 'AA AB RT KE', 'AA COMM KE', 'AA HEDGE KE', 'AA PROP KE', 'Total'];
  butName = 'Squares';
  transpose = true;
  squares = true;
  chosenData = this.diags[0];
  pad = true;
  padButt = 'Don\'t pad';
  colourrange = ['lightgreen', 'cyan'];

  constructor() { }
  chooseData(daig) {
    this.chosenData = daig;
    this.ngOnInit();
  }
  managerProcess(dataV: {x: string, y: string, value: number}[]) {
    console.log(this.chosenData);
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
    if (this.chosenData === this.diags[0]) {
      this.managerProcess(this.managerData);
    }    else if (this.chosenData === this.diags[1]) {
      this.managerProcess(this.managerData1);
    }
    this.butName = this.squares ? 'Circles' : 'Squares';
//    this.setUp(this.xLabels, this.yLabels, this.heatData);
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
      console.log('transpose= ' + transpose);
    if (transpose) {
      labelsXY.x = yLabels;
      labelsXY.y = xLabels;
    } else {
      labelsXY.x = xLabels;
      labelsXY.y = yLabels;
    }
    let buckets = labelsXY.x.length;
    console.log(buckets);
    const margin = { top: 120, right: 0, bottom: 100, left: 130 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom,
      gridSize = Math.min(Math.floor(width / labelsXY.x.length), Math.floor(height / labelsXY.y.length)),
      legendElementWidth = gridSize;
      if (labelsXY.x[buckets - 1] === 'Total') { buckets--; }

      const coloursd = d3.scaleLinear<RGBColor>()
      .domain([0, buckets])
      .range([d3.rgb(this.colourrange[0]), d3.rgb(this.colourrange[1])]),
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
            .style('fill', ' ' + colors[0])
            .merge(cards)
            .transition()
            .duration(100)
            .style('fill', (d) => ' ' + colorScale(d.value));
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
            return height + ((buckets === labelsXY.x.length) ? 0 : 10);
          })
          .attr('width', legendElementWidth)
          .attr('height', gridSize / 2)
          .style('fill', (d, i) => ' ' + colors[i]);

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

