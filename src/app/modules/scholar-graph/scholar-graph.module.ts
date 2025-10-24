import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarGraphComponent } from './scholar-graph.component';

const routes: Routes = [
  {
    path: '',
    component: ScholarGraphComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ScholarGraphComponent
  ]
})
export class ScholarGraphModule { }
