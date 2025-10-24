import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EduForgeComponent } from './edu-forge.component';

const routes: Routes = [{ path: '', component: EduForgeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), EduForgeComponent]
})
export class EduForgeModule { }
