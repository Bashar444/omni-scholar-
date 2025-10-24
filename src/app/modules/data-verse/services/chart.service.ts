import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Chart,
  Dashboard,
  DataStory,
  ChartStatistics,
  ChartTemplate,
  ChartType,
  ExportOptions,
  MOCK_CHARTS,
  CHART_TEMPLATES
} from '../models/chart.model';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private chartsSubject = new BehaviorSubject<Chart[]>(this.loadCharts());
  private dashboardsSubject = new BehaviorSubject<Dashboard[]>(this.loadDashboards());
  private storiesSubject = new BehaviorSubject<DataStory[]>(this.loadStories());

  public charts$ = this.chartsSubject.asObservable();
  public dashboards$ = this.dashboardsSubject.asObservable();
  public stories$ = this.storiesSubject.asObservable();

  private readonly STORAGE_KEY_CHARTS = 'data_verse_charts';
  private readonly STORAGE_KEY_DASHBOARDS = 'data_verse_dashboards';
  private readonly STORAGE_KEY_STORIES = 'data_verse_stories';

  constructor() {}

  // Chart Management
  getAllCharts(): Observable<Chart[]> {
    return of(this.chartsSubject.value).pipe(delay(400));
  }

  getChartById(id: string): Observable<Chart | undefined> {
    const chart = this.chartsSubject.value.find(c => c.id === id);
    return of(chart).pipe(delay(200));
  }

  getChartsByType(type: ChartType): Observable<Chart[]> {
    const charts = this.chartsSubject.value.filter(c => c.type === type);
    return of(charts).pipe(delay(300));
  }

  searchCharts(query: string, filters?: {
    types?: ChartType[];
    tags?: string[];
    author?: string;
  }): Observable<Chart[]> {
    let results = this.chartsSubject.value;

    // Text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(chart =>
        chart.title.toLowerCase().includes(lowerQuery) ||
        chart.description.toLowerCase().includes(lowerQuery) ||
        chart.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.types && filters.types.length > 0) {
        results = results.filter(c => filters.types!.includes(c.type));
      }
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(c => 
          filters.tags!.some(tag => c.tags.includes(tag))
        );
      }
      if (filters.author) {
        results = results.filter(c => 
          c.author.toLowerCase().includes(filters.author!.toLowerCase())
        );
      }
    }

    return of(results).pipe(delay(500));
  }

  createChart(chart: Omit<Chart, 'id' | 'createdAt' | 'updatedAt'>): Observable<Chart> {
    const newChart: Chart = {
      ...chart,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const charts = [...this.chartsSubject.value, newChart];
    this.chartsSubject.next(charts);
    this.saveCharts(charts);
    return of(newChart).pipe(delay(300));
  }

  updateChart(id: string, updates: Partial<Chart>): Observable<Chart> {
    const charts = this.chartsSubject.value.map(chart =>
      chart.id === id
        ? { ...chart, ...updates, updatedAt: new Date() }
        : chart
    );
    this.chartsSubject.next(charts);
    this.saveCharts(charts);
    const updatedChart = charts.find(c => c.id === id)!;
    return of(updatedChart).pipe(delay(300));
  }

  deleteChart(id: string): Observable<void> {
    const charts = this.chartsSubject.value.filter(c => c.id !== id);
    this.chartsSubject.next(charts);
    this.saveCharts(charts);
    return of(void 0).pipe(delay(200));
  }

  duplicateChart(id: string): Observable<Chart> {
    const chart = this.chartsSubject.value.find(c => c.id === id);
    if (chart) {
      const duplicate: Chart = {
        ...chart,
        id: this.generateId(),
        title: `${chart.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const charts = [...this.chartsSubject.value, duplicate];
      this.chartsSubject.next(charts);
      this.saveCharts(charts);
      return of(duplicate).pipe(delay(300));
    }
    throw new Error('Chart not found');
  }

  // Dashboard Management
  getAllDashboards(): Observable<Dashboard[]> {
    return of(this.dashboardsSubject.value).pipe(delay(400));
  }

  getDashboardById(id: string): Observable<Dashboard | undefined> {
    const dashboard = this.dashboardsSubject.value.find(d => d.id === id);
    return of(dashboard).pipe(delay(200));
  }

  createDashboard(dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Observable<Dashboard> {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const dashboards = [...this.dashboardsSubject.value, newDashboard];
    this.dashboardsSubject.next(dashboards);
    this.saveDashboards(dashboards);
    return of(newDashboard).pipe(delay(300));
  }

  updateDashboard(id: string, updates: Partial<Dashboard>): Observable<Dashboard> {
    const dashboards = this.dashboardsSubject.value.map(dashboard =>
      dashboard.id === id
        ? { ...dashboard, ...updates, updatedAt: new Date() }
        : dashboard
    );
    this.dashboardsSubject.next(dashboards);
    this.saveDashboards(dashboards);
    const updatedDashboard = dashboards.find(d => d.id === id)!;
    return of(updatedDashboard).pipe(delay(300));
  }

  deleteDashboard(id: string): Observable<void> {
    const dashboards = this.dashboardsSubject.value.filter(d => d.id !== id);
    this.dashboardsSubject.next(dashboards);
    this.saveDashboards(dashboards);
    return of(void 0).pipe(delay(200));
  }

  // Data Story Management
  getAllStories(): Observable<DataStory[]> {
    return of(this.storiesSubject.value).pipe(delay(400));
  }

  getStoryById(id: string): Observable<DataStory | undefined> {
    const story = this.storiesSubject.value.find(s => s.id === id);
    return of(story).pipe(delay(200));
  }

  createStory(story: Omit<DataStory, 'id' | 'createdAt' | 'updatedAt'>): Observable<DataStory> {
    const newStory: DataStory = {
      ...story,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const stories = [...this.storiesSubject.value, newStory];
    this.storiesSubject.next(stories);
    this.saveStories(stories);
    return of(newStory).pipe(delay(300));
  }

  updateStory(id: string, updates: Partial<DataStory>): Observable<DataStory> {
    const stories = this.storiesSubject.value.map(story =>
      story.id === id
        ? { ...story, ...updates, updatedAt: new Date() }
        : story
    );
    this.storiesSubject.next(stories);
    this.saveStories(stories);
    const updatedStory = stories.find(s => s.id === id)!;
    return of(updatedStory).pipe(delay(300));
  }

  deleteStory(id: string): Observable<void> {
    const stories = this.storiesSubject.value.filter(s => s.id !== id);
    this.storiesSubject.next(stories);
    this.saveStories(stories);
    return of(void 0).pipe(delay(200));
  }

  // Templates
  getChartTemplates(): Observable<ChartTemplate[]> {
    return of(CHART_TEMPLATES).pipe(delay(300));
  }

  getTemplatesByCategory(category: string): Observable<ChartTemplate[]> {
    const templates = CHART_TEMPLATES.filter(t => t.category === category);
    return of(templates).pipe(delay(200));
  }

  createChartFromTemplate(templateId: string, customData?: any): Observable<Chart> {
    const template = CHART_TEMPLATES.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }

    const newChart: Chart = {
      id: this.generateId(),
      title: `New ${template.name}`,
      description: template.description,
      type: template.type,
      data: customData || template.sampleData,
      config: template.config as any,
      theme: 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'Current User',
      tags: [],
      isPublic: false
    };

    const charts = [...this.chartsSubject.value, newChart];
    this.chartsSubject.next(charts);
    this.saveCharts(charts);

    return of(newChart).pipe(delay(500));
  }

  // Statistics
  getChartStatistics(): Observable<ChartStatistics> {
    const charts = this.chartsSubject.value;
    const dashboards = this.dashboardsSubject.value;
    const stories = this.storiesSubject.value;

    const chartsByType: Record<ChartType, number> = {} as any;
    const chartTypes: ChartType[] = [
      'bar', 'line', 'scatter', 'pie', 'doughnut', 
      'radar', 'polarArea', 'heatmap', 'bubble', 'area'
    ];

    chartTypes.forEach(type => {
      chartsByType[type] = charts.filter(c => c.type === type).length;
    });

    const recentCharts = [...charts]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);

    const statistics: ChartStatistics = {
      totalCharts: charts.length,
      chartsByType,
      recentCharts,
      popularTemplates: CHART_TEMPLATES.slice(0, 3),
      totalDashboards: dashboards.length,
      totalStories: stories.length
    };

    return of(statistics).pipe(delay(400));
  }

  // Export
  exportChart(chartId: string, options: ExportOptions): Observable<Blob> {
    // Mock export - in real implementation, would use html2canvas or similar
    const chart = this.chartsSubject.value.find(c => c.id === chartId);
    
    if (!chart) {
      throw new Error('Chart not found');
    }

    // Simulate export delay
    return of(new Blob(['mock export data'], { type: 'image/png' }))
      .pipe(delay(1000));
  }

  exportDashboard(dashboardId: string, options: ExportOptions): Observable<Blob> {
    return of(new Blob(['mock dashboard export'], { type: 'application/pdf' }))
      .pipe(delay(1500));
  }

  // Helper methods
  private generateId(): string {
    return 'id_' + Math.random().toString(36).substring(2, 11);
  }

  private loadCharts(): Chart[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_CHARTS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }));
      } catch (e) {
        console.error('Failed to load charts', e);
      }
    }
    return MOCK_CHARTS;
  }

  private saveCharts(charts: Chart[]): void {
    localStorage.setItem(this.STORAGE_KEY_CHARTS, JSON.stringify(charts));
  }

  private loadDashboards(): Dashboard[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_DASHBOARDS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt)
        }));
      } catch (e) {
        console.error('Failed to load dashboards', e);
      }
    }
    return [];
  }

  private saveDashboards(dashboards: Dashboard[]): void {
    localStorage.setItem(this.STORAGE_KEY_DASHBOARDS, JSON.stringify(dashboards));
  }

  private loadStories(): DataStory[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_STORIES);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt)
        }));
      } catch (e) {
        console.error('Failed to load stories', e);
      }
    }
    return [];
  }

  private saveStories(stories: DataStory[]): void {
    localStorage.setItem(this.STORAGE_KEY_STORIES, JSON.stringify(stories));
  }
}
