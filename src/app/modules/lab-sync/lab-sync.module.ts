import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabSyncComponent } from './lab-sync.component';

const routes: Routes = [{ path: '', component: LabSyncComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), LabSyncComponent]
})
export class LabSyncModule { }
