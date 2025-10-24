import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataVerseComponent } from './data-verse.component';

const routes: Routes = [{ path: '', component: DataVerseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), DataVerseComponent]
})
export class DataVerseModule { }
