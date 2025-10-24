import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OmniAiComponent } from './omni-ai.component';

const routes: Routes = [{ path: '', component: OmniAiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), OmniAiComponent]
})
export class OmniAiModule { }
