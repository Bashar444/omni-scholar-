import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrustLayerComponent } from './trust-layer.component';

const routes: Routes = [{ path: '', component: TrustLayerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), TrustLayerComponent]
})
export class TrustLayerModule { }
