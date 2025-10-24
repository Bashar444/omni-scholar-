import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetaLabComponent } from './meta-lab.component';

const routes: Routes = [{ path: '', component: MetaLabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), MetaLabComponent]
})
export class MetaLabModule { }
