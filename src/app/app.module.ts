import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { DatamoduleModule } from './datamodule/datamodule.module';

@NgModule({
  declarations: [
    AppComponent,
    HeatmapComponent
    ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DatamoduleModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
