import { Component } from '@angular/core';
import { select } from 'd3';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  static toolTipStatic = select('body').append('g').attr('class', 'toolTip');
  title = 'app';
}
