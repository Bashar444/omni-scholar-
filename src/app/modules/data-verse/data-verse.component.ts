import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ PrimeNG modules (replacement for Angular Material)
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

// ✅ Models & Services
import {
  Chart,
  Dashboard,
  DataStory,
  ChartType,
  ChartTheme,
  ChartTemplate,
  ChartStatistics,
  ExportOptions,
} from './models/chart.model';
import { ChartService } from './services/chart.service';

@Component({
  selector: 'app-data-verse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // ✅ PrimeNG modules
    CardModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    DropdownModule,
    TabViewModule,
    ProgressSpinnerModule,
    BadgeModule,
    ToastModule,
    MenuModule,
    TooltipModule,
    DividerModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './data-verse.component.html',
  styleUrls: ['./data-verse.component.scss'],
})
export class DataVerseComponent implements OnInit {
  // State signals
  charts = signal<Chart[]>([]);
  dashboards = signal<Dashboard[]>([]);
  stories = signal<DataStory[]>([]);
  templates = signal<ChartTemplate[]>([]);
  statistics = signal<ChartStatistics | null>(null);
  isLoading = signal(false);
  isExporting = signal(false);

  // Search and filters
  searchQuery = '';
  selectedTypes: ChartType[] = [];
  selectedThemes: ChartTheme[] = [];
  selectedCategory = 'all';

  // Chart types and themes
  chartTypes: ChartType[] = [
    'bar',
    'line',
    'scatter',
    'pie',
    'doughnut',
    'radar',
    'polarArea',
    'heatmap',
    'bubble',
    'area',
  ];
  themes: ChartTheme[] = [
    'default',
    'scientific',
    'minimal',
    'dark',
    'colorful',
    'monochrome',
  ];

  // Computed filtered charts
  filteredCharts = computed(() => {
    let result = this.charts();

    // Apply text search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(
        (chart) =>
          chart.title.toLowerCase().includes(query) ||
          chart.description.toLowerCase().includes(query) ||
          chart.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (this.selectedTypes.length > 0) {
      result = result.filter((chart) =>
        this.selectedTypes.includes(chart.type)
      );
    }

    // Apply theme filter
    if (this.selectedThemes.length > 0) {
      result = result.filter((chart) =>
        this.selectedThemes.includes(chart.theme)
      );
    }

    return result;
  });

  // Computed filtered templates
  filteredTemplates = computed(() => {
    if (this.selectedCategory === 'all') {
      return this.templates();
    }
    return this.templates().filter(
      (t) => t.category === this.selectedCategory
    );
  });

  private chartService = inject(ChartService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.loadData();
  }

  // ✅ Data loading
  loadData() {
    this.isLoading.set(true);

    this.chartService.getAllCharts().subscribe((charts) => {
      this.charts.set(charts);
    });

    this.chartService.getAllDashboards().subscribe((dashboards) => {
      this.dashboards.set(dashboards);
    });

    this.chartService.getAllStories().subscribe((stories) => {
      this.stories.set(stories);
    });

    this.chartService.getChartTemplates().subscribe((templates) => {
      this.templates.set(templates);
    });

    this.chartService.getChartStatistics().subscribe((stats) => {
      this.statistics.set(stats);
      this.isLoading.set(false);
    });
  }

  // ✅ Chart operations
  searchCharts() {
    const filters: any = {};
    if (this.selectedTypes.length > 0) filters.types = this.selectedTypes;
    if (this.selectedThemes.length > 0) filters.themes = this.selectedThemes;

    if (this.searchQuery.trim() || Object.keys(filters).length > 0) {
      this.chartService
        .searchCharts(this.searchQuery, filters)
        .subscribe((charts) => this.charts.set(charts));
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedTypes = [];
    this.selectedThemes = [];
    this.loadData();
  }

  viewChart(chart: Chart) {
    this.messageService.add({
      severity: 'info',
      summary: 'View Chart',
      detail: `Viewing chart: ${chart.title}`,
      life: 3000,
    });
  }

  editChart(chart: Chart) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Edit Chart',
      detail: `Editing chart: ${chart.title}`,
      life: 3000,
    });
  }

  duplicateChart(chartId: string) {
    this.chartService.duplicateChart(chartId).subscribe((newChart) => {
      this.charts.set([...this.charts(), newChart]);
      this.messageService.add({
        severity: 'success',
        summary: 'Chart Duplicated',
        detail: 'Chart duplicated successfully',
        life: 3000,
      });
    });
  }

  deleteChart(chartId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this chart?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.chartService.deleteChart(chartId).subscribe(() => {
          this.charts.set(this.charts().filter((c) => c.id !== chartId));
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Chart deleted successfully',
            life: 3000,
          });
        });
      },
    });
  }

  exportChart(chart: Chart) {
    this.isExporting.set(true);
    const options: ExportOptions = {
      format: 'png',
      width: 800,
      height: 600,
      quality: 1,
      includeTitle: true,
      includeDescription: false,
    };

    this.chartService.exportChart(chart.id, options).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chart.title}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
      this.isExporting.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Exported',
        detail: 'Chart exported successfully',
        life: 3000,
      });
    });
  }

  // ✅ Template operations
  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

  selectTemplate(template: ChartTemplate) {
    this.messageService.add({
      severity: 'info',
      summary: 'New Chart',
      detail: `Creating chart from template: ${template.name}`,
      life: 3000,
    });
    this.chartService
      .createChartFromTemplate(template.id)
      .subscribe((newChart) => {
        this.charts.set([...this.charts(), newChart]);
        this.messageService.add({
          severity: 'success',
          summary: 'Chart Created',
          detail: 'Chart created successfully',
          life: 3000,
        });
      });
  }

  openTemplateGallery() {
    this.messageService.add({
      severity: 'info',
      summary: 'Templates',
      detail: 'Opening template gallery...',
      life: 2000,
    });
  }

  // ✅ Dashboard operations
  createDashboard() {
    const newDashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'New Dashboard',
      description: 'My custom dashboard',
      layout: { rows: 4, columns: 4, gap: 16 },
      widgets: [],
      theme: 'default',
      isPublic: false,
      author: 'Current User',
    };

    this.chartService.createDashboard(newDashboard).subscribe((dashboard) => {
      this.dashboards.set([...this.dashboards(), dashboard]);
      this.messageService.add({
        severity: 'success',
        summary: 'Dashboard Created',
        detail: 'Dashboard created successfully',
        life: 3000,
      });
    });
  }

  viewDashboard(dashboard: Dashboard) {
    this.messageService.add({
      severity: 'info',
      summary: 'Dashboard View',
      detail: `Viewing dashboard: ${dashboard.title}`,
      life: 3000,
    });
  }

  editDashboard(dashboard: Dashboard) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Edit Dashboard',
      detail: `Editing dashboard: ${dashboard.title}`,
      life: 3000,
    });
  }

  deleteDashboard(dashboardId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this dashboard?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.chartService.deleteDashboard(dashboardId).subscribe(() => {
          this.dashboards.set(
            this.dashboards().filter((d) => d.id !== dashboardId)
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Dashboard deleted successfully',
            life: 3000,
          });
        });
      },
    });
  }

  // ✅ Story operations
  createStory() {
    const newStory: Omit<DataStory, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'New Data Story',
      subtitle: 'An engaging narrative with data',
      author: 'Current User',
      sections: [],
      theme: 'default',
      tags: [],
      isPublished: false,
    };

    this.chartService.createStory(newStory).subscribe((story) => {
      this.stories.set([...this.stories(), story]);
      this.messageService.add({
        severity: 'success',
        summary: 'Story Created',
        detail: 'Data story created successfully',
        life: 3000,
      });
    });
  }

  viewStory(story: DataStory) {
    this.messageService.add({
      severity: 'info',
      summary: 'Story View',
      detail: `Viewing story: ${story.title}`,
      life: 3000,
    });
  }

  editStory(story: DataStory) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Edit Story',
      detail: `Editing story: ${story.title}`,
      life: 3000,
    });
  }

  publishStory(storyId: string) {
    const story = this.stories().find((s) => s.id === storyId);
    if (story) {
      this.chartService
        .updateStory(storyId, { isPublished: true })
        .subscribe((updated) => {
          this.stories.set(
            this.stories().map((s) => (s.id === storyId ? updated : s))
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Published',
            detail: 'Story published successfully',
            life: 3000,
          });
        });
    }
  }

  deleteStory(storyId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this data story?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.chartService.deleteStory(storyId).subscribe(() => {
          this.stories.set(this.stories().filter((s) => s.id !== storyId));
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Data story deleted successfully',
            life: 3000,
          });
        });
      },
    });
  }

  // ✅ Utility methods
  getChartIcon(type: ChartType): string {
    const iconMap: Record<ChartType, string> = {
      bar: 'pi pi-chart-bar',
      line: 'pi pi-chart-line',
      scatter: 'pi pi-chart-scatter',
      pie: 'pi pi-chart-pie',
      doughnut: 'pi pi-chart-pie',
      radar: 'pi pi-bullseye',
      polarArea: 'pi pi-circle',
      heatmap: 'pi pi-th-large',
      bubble: 'pi pi-circle-fill',
      area: 'pi pi-chart-line',
    };
    return iconMap[type] || 'pi pi-chart-line';
  }

  getThemeClass(theme: ChartTheme): string {
    return `theme-${theme}`;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
}
