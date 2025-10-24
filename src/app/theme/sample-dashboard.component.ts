// sample-dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';

// PrimeNG Imports
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-sample-dashboard',
  templateUrl: './sample-dashboard.component.html',
  styleUrls: ['./sample-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TableModule,
    DialogModule,
    InputSwitchModule,
    DividerModule
  ]
})
export class SampleDashboardComponent {
  activeTab = 0;
  modalOpen = false;
  kpis = [
    { label: 'Users', value: 1240, icon: 'person', color: 'primary' },
    { label: 'Revenue', value: '$8,400', icon: 'attach_money', color: 'accent' },
    { label: 'Success Rate', value: '98%', icon: 'check_circle', color: 'success' },
    { label: 'Warnings', value: 3, icon: 'warning', color: 'warning' }
  ];
  tableData = [
    { name: 'Alpha', status: 'Active', score: 92 },
    { name: 'Beta', status: 'Pending', score: 78 },
    { name: 'Gamma', status: 'Inactive', score: 65 }
  ];
  constructor(public theme: ThemeService) {}
  setTab(idx: number) { this.activeTab = idx; }
  openModal() { this.modalOpen = true; }
  closeModal() { this.modalOpen = false; }
  toggleTheme() { this.theme.toggleMode(); }
  toggleContrast(e: any) { this.theme.setHighContrast(e.target.checked); }
}
