// Chart and visualization models
export interface Chart {
  id: string;
  title: string;
  description: string;
  type: ChartType;
  data: ChartData;
  config: ChartConfig;
  theme: ChartTheme;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
  isPublic: boolean;
}

export type ChartType = 
  | 'bar'
  | 'line'
  | 'scatter'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polarArea'
  | 'heatmap'
  | 'bubble'
  | 'area';

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
}

export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  aspectRatio: number;
  plugins: {
    legend: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    title: {
      display: boolean;
      text: string;
    };
    tooltip: {
      enabled: boolean;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
      beginAtZero?: boolean;
    };
    y?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
      beginAtZero?: boolean;
    };
  };
}

export type ChartTheme = 
  | 'default'
  | 'scientific'
  | 'minimal'
  | 'dark'
  | 'colorful'
  | 'monochrome';

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  theme: ChartTheme;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
}

export interface DashboardWidget {
  id: string;
  chartId: string;
  chart?: Chart;
  position: {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
  };
  title: string;
}

export interface DataStory {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  sections: StorySection[];
  theme: ChartTheme;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorySection {
  id: string;
  type: 'text' | 'chart' | 'image' | 'table';
  content: string | Chart | TableData;
  order: number;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  data: any[];
  columns: DataColumn[];
  rowCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type DataSourceType = 
  | 'csv'
  | 'json'
  | 'excel'
  | 'api'
  | 'manual';

export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  nullable: boolean;
}

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  type: ChartType;
  category: TemplateCategory;
  config: Partial<ChartConfig>;
  sampleData: ChartData;
  thumbnail: string;
}

export type TemplateCategory = 
  | 'comparison'
  | 'distribution'
  | 'relationship'
  | 'composition'
  | 'trend';

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'json';
  width: number;
  height: number;
  quality: number;
  includeTitle: boolean;
  includeDescription: boolean;
}

export interface ChartStatistics {
  totalCharts: number;
  chartsByType: Record<ChartType, number>;
  recentCharts: Chart[];
  popularTemplates: ChartTemplate[];
  totalDashboards: number;
  totalStories: number;
}

// Mock data
export const MOCK_CHARTS: Chart[] = [
  {
    id: 'c1',
    title: 'Publication Trends (2019-2024)',
    description: 'Yearly publication count across major journals',
    type: 'line',
    data: {
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: 'Nature',
          data: [1250, 1320, 1450, 1580, 1720, 1650],
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Science',
          data: [1180, 1240, 1380, 1520, 1680, 1590],
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Cell',
          data: [980, 1050, 1180, 1290, 1420, 1380],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    config: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Publication Trends' },
        tooltip: { enabled: true }
      },
      scales: {
        x: { display: true, title: { display: true, text: 'Year' } },
        y: { display: true, title: { display: true, text: 'Publications' }, beginAtZero: true }
      }
    },
    theme: 'scientific',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-20'),
    author: 'Research Team',
    tags: ['publications', 'trends', 'journals'],
    isPublic: true
  },
  {
    id: 'c2',
    title: 'Citation Distribution by Field',
    description: 'Average citations per paper by research field',
    type: 'bar',
    data: {
      labels: ['Biology', 'Physics', 'Chemistry', 'Medicine', 'CS', 'Psychology'],
      datasets: [
        {
          label: 'Average Citations',
          data: [42, 38, 35, 45, 28, 32],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }
      ]
    },
    config: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: { display: false, position: 'top' },
        title: { display: true, text: 'Citations by Field' },
        tooltip: { enabled: true }
      },
      scales: {
        x: { display: true, title: { display: true, text: 'Research Field' } },
        y: { display: true, title: { display: true, text: 'Citations' }, beginAtZero: true }
      }
    },
    theme: 'colorful',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-09-05'),
    author: 'Analytics Team',
    tags: ['citations', 'fields', 'analytics'],
    isPublic: true
  },
  {
    id: 'c3',
    title: 'Research Collaboration Network',
    description: 'Size vs Impact of research collaborations',
    type: 'scatter',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Collaborations',
          data: [
            { x: 3, y: 25 },
            { x: 5, y: 42 },
            { x: 7, y: 58 },
            { x: 4, y: 35 },
            { x: 8, y: 72 },
            { x: 6, y: 48 },
            { x: 9, y: 85 },
            { x: 10, y: 95 },
            { x: 12, y: 110 }
          ] as any,
          backgroundColor: '#9C27B0',
          borderColor: '#9C27B0',
          pointRadius: 8,
          pointHoverRadius: 12
        }
      ]
    },
    config: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: { display: false, position: 'top' },
        title: { display: true, text: 'Team Size vs Impact' },
        tooltip: { enabled: true }
      },
      scales: {
        x: { display: true, title: { display: true, text: 'Team Size' }, beginAtZero: true },
        y: { display: true, title: { display: true, text: 'Citation Count' }, beginAtZero: true }
      }
    },
    theme: 'minimal',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-10-01'),
    author: 'Network Analysis',
    tags: ['collaboration', 'network', 'impact'],
    isPublic: true
  },
  {
    id: 'c4',
    title: 'Funding Distribution',
    description: 'Research funding by source',
    type: 'pie',
    data: {
      labels: ['Government', 'Industry', 'Foundations', 'Universities', 'Other'],
      datasets: [
        {
          label: 'Funding',
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }
      ]
    },
    config: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: { display: true, position: 'right' },
        title: { display: true, text: 'Funding Sources' },
        tooltip: { enabled: true }
      }
    },
    theme: 'colorful',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-09-15'),
    author: 'Finance Team',
    tags: ['funding', 'grants', 'finance'],
    isPublic: true
  },
  {
    id: 'c5',
    title: 'Research Impact Radar',
    description: 'Multi-dimensional impact assessment',
    type: 'radar',
    data: {
      labels: ['Citations', 'Downloads', 'Media', 'Policy', 'Patents', 'Teaching'],
      datasets: [
        {
          label: '2023',
          data: [85, 75, 60, 45, 70, 80],
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          borderColor: '#2196F3',
          borderWidth: 2
        },
        {
          label: '2024',
          data: [92, 82, 68, 52, 78, 85],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4CAF50',
          borderWidth: 2
        }
      ]
    },
    config: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Impact Dimensions' },
        tooltip: { enabled: true }
      },
      scales: {
        y: { display: true, beginAtZero: true }
      }
    },
    theme: 'scientific',
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-10-10'),
    author: 'Impact Team',
    tags: ['impact', 'assessment', 'metrics'],
    isPublic: true
  }
];

export const CHART_TEMPLATES: ChartTemplate[] = [
  {
    id: 't1',
    name: 'Simple Bar Chart',
    description: 'Compare values across categories',
    type: 'bar',
    category: 'comparison',
    config: {
      responsive: true,
      plugins: {
        legend: { display: false, position: 'top' },
        title: { display: true, text: 'Bar Chart' },
        tooltip: { enabled: true }
      }
    },
    sampleData: {
      labels: ['A', 'B', 'C', 'D'],
      datasets: [{ label: 'Values', data: [10, 20, 15, 25], backgroundColor: '#2196F3' }]
    },
    thumbnail: 'bar-chart.svg'
  },
  {
    id: 't2',
    name: 'Line Chart',
    description: 'Show trends over time',
    type: 'line',
    category: 'trend',
    config: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Line Chart' },
        tooltip: { enabled: true }
      }
    },
    sampleData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{ 
        label: 'Series', 
        data: [10, 15, 12, 18], 
        borderColor: '#4CAF50',
        tension: 0.4
      }]
    },
    thumbnail: 'line-chart.svg'
  },
  {
    id: 't3',
    name: 'Scatter Plot',
    description: 'Show relationships between variables',
    type: 'scatter',
    category: 'relationship',
    config: {
      responsive: true,
      plugins: {
        legend: { display: false, position: 'top' },
        title: { display: true, text: 'Scatter Plot' },
        tooltip: { enabled: true }
      }
    },
    sampleData: {
      labels: [],
      datasets: [{ 
        label: 'Points', 
        data: [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 3 }] as any,
        backgroundColor: '#9C27B0'
      }]
    },
    thumbnail: 'scatter-chart.svg'
  }
];

export const COLOR_PALETTES = {
  default: ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'],
  scientific: ['#1976D2', '#388E3C', '#F57C00', '#C2185B', '#7B1FA2', '#0097A7'],
  minimal: ['#424242', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0', '#EEEEEE'],
  colorful: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
  monochrome: ['#212121', '#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD']
};
