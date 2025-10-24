import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperPilotComponent } from './paper-pilot.component';

const routes: Routes = [
  { path: '', component: PaperPilotComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes), PaperPilotComponent]
})
export class PaperPilotModule { }
