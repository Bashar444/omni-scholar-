import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ PrimeNG imports (replace Angular Material)
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

// ✅ Models and services
import {
  Study,
  ReplicationStudy,
  ReproducibilityMetrics,
  ResearchField,
  BadgeType,
  FieldMetrics,
} from './models/study.model';
import { StudyService } from './services/study.service';

@Component({
  selector: 'app-meta-lab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // ✅ PrimeNG Modules
    CardModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    DropdownModule,
    TabViewModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    TooltipModule,
    ToastModule,
    BadgeModule,
    DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './meta-lab.component.html',
  styleUrls: ['./meta-lab.component.scss'],
})
export class MetaLabComponent implements OnInit {
  // Signals (State)
  studies = signal<Study[]>([]);
  replications = signal<ReplicationStudy[]>([]);
  metrics = signal<ReproducibilityMetrics | null>(null);
  isLoading = signal<boolean>(true);

  // Search and filter
  searchQuery: string = '';
  selectedFields: ResearchField[] = [];

  // Available fields
  fields: ResearchField[] = [
    'Psychology',
    'Neuroscience',
    'Medicine',
    'Biology',
    'Chemistry',
    'Physics',
    'Computer Science',
    'Social Sciences',
    'Economics',
    'Other',
  ];

  // Computed - Filter studies
  filteredStudies = computed(() => {
    const allStudies = this.studies();

    if (!this.searchQuery && this.selectedFields.length === 0) {
      return allStudies;
    }

    return allStudies.filter((study) => {
      const matchesSearch =
        !this.searchQuery ||
        study.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        study.authors.some((a) =>
          a.toLowerCase().includes(this.searchQuery.toLowerCase())
        ) ||
        study.abstract.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesField =
        this.selectedFields.length === 0 ||
        this.selectedFields.includes(study.field);

      return matchesSearch && matchesField;
    });
  });

  private studyService = inject(StudyService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    this.studyService.getAllStudies().subscribe((studies) => {
      this.studies.set(studies);
    });

    this.studyService.getAllReplications().subscribe((replications) => {
      this.replications.set(replications);
    });

    this.studyService.getReproducibilityMetrics().subscribe((metrics) => {
      this.metrics.set(metrics);
      this.isLoading.set(false);
    });
  }

  searchStudies() {
    this.isLoading.set(true);
    this.studyService
      .searchStudies(this.searchQuery, {
        fields: this.selectedFields.length > 0 ? this.selectedFields : undefined,
      })
      .subscribe((studies) => {
        this.studies.set(studies);
        this.isLoading.set(false);
      });
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedFields = [];
    this.loadData();
  }

  // ✅ Replaced snackBar.open with PrimeNG Toast
  viewStudyDetails(study: Study) {
    this.messageService.add({
      severity: 'info',
      summary: 'Study Details',
      detail: `Viewing details for: ${study.title}`,
      life: 3000,
    });
  }

  viewReplications(study: Study) {
    this.studyService.getReplicationsForStudy(study.id).subscribe((replications) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Replications Loaded',
        detail: `Found ${replications.length} replications.`,
        life: 3000,
      });
    });
  }

  viewNetwork(study: Study) {
    this.studyService.getValidationNetwork(study.id).subscribe((network) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Validation Network',
        detail: `Network has ${network.nodes.length} nodes with ${network.overallConfidence.toFixed(
          1
        )}% confidence.`,
        life: 3000,
      });
    });
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }

  // ✅ Styling & Helper Methods
  getScoreClass(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      Replicated: 'status-success',
      'Failed Replication': 'status-failed',
      'Partially Replicated': 'status-partial',
      'Pending Replication': 'status-pending',
      Original: 'status-original',
    };
    return classes[status] || '';
  }

  getBadgeClass(badgeType: BadgeType): string {
    const classes: { [key: string]: string } = {
      'Open Data': 'badge-data',
      'Open Materials': 'badge-materials',
      Preregistered: 'badge-prereg',
      Replicated: 'badge-replicated',
      Reproducible: 'badge-reproducible',
      'Open Access': 'badge-access',
    };
    return classes[badgeType] || '';
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 80) return 'confidence-high';
    if (confidence >= 50) return 'confidence-medium';
    return 'confidence-low';
  }

  getReplicationStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      Planned: 'rep-status-planned',
      'In Progress': 'rep-status-progress',
      'Data Collection': 'rep-status-collection',
      Analysis: 'rep-status-analysis',
      Completed: 'rep-status-completed',
      Published: 'rep-status-published',
      Abandoned: 'rep-status-abandoned',
    };
    return classes[status] || '';
  }

  getOutcomeClass(outcome: string): string {
    const classes: { [key: string]: string } = {
      Successful: 'outcome-success',
      Failed: 'outcome-failed',
      Partial: 'outcome-partial',
      Inconclusive: 'outcome-inconclusive',
      Pending: 'outcome-pending',
    };
    return classes[outcome] || '';
  }

  getOutcomeIcon(outcome: string): string {
    const icons: { [key: string]: string } = {
      Successful: 'pi pi-check-circle',
      Failed: 'pi pi-times-circle',
      Partial: 'pi pi-exclamation-circle',
      Inconclusive: 'pi pi-question-circle',
      Pending: 'pi pi-clock',
    };
    return icons[outcome] || 'pi pi-info-circle';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      Replicated: 'pi pi-check',
      'Failed Replication': 'pi pi-times',
      'Partially Replicated': 'pi pi-exclamation-triangle',
      'Pending Replication': 'pi pi-clock',
      Original: 'pi pi-file',
    };
    return icons[status] || 'pi pi-info-circle';
  }

  getBadgeIcon(type: BadgeType): string {
    const icons: { [key: string]: string } = {
      'Open Data': 'pi pi-folder-open',
      'Open Materials': 'pi pi-box',
      'Preregistered': 'pi pi-verified',
      'Replicated': 'pi pi-copy',
      'Reproducible': 'pi pi-check-circle',
      'Open Access': 'pi pi-lock-open'
    };
    return icons[type] || 'pi pi-info-circle';
  }

  getBadgeSeverity(type: BadgeType): 'success' | 'info' | 'warning' | 'danger' {
    const severities: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'Open Data': 'success',
      'Open Materials': 'info',
      'Preregistered': 'info',
      'Replicated': 'success',
      'Reproducible': 'success',
      'Open Access': 'info'
    };
    return severities[type] || 'info';
  }

  getFieldsWithData(): ResearchField[] {
    const metricsData = this.metrics();
    if (!metricsData) return [];
    return this.fields.filter(
      (field) =>
        metricsData.byField[field] && metricsData.byField[field].totalStudies > 0
    );
  }

  getFieldMetrics(field: ResearchField): FieldMetrics | undefined {
    const metricsData = this.metrics();
    return metricsData?.byField[field];
  }
}
