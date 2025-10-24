import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrantAiComponent } from './grant-ai.component';

const routes: Routes = [{ path: '', component: GrantAiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), GrantAiComponent]
})
export class GrantAiModule { }
