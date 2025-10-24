import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleDashboardComponent } from './sample-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    SampleDashboardComponent
  ],
  exports: [SampleDashboardComponent]
})
export class ThemeModule {}
