import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalKnowledgeBridgeComponent } from './global-knowledge-bridge.component';

const routes: Routes = [{ path: '', component: GlobalKnowledgeBridgeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), GlobalKnowledgeBridgeComponent]
})
export class GlobalKnowledgeBridgeModule { }
