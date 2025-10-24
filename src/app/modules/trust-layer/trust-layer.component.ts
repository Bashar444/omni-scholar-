import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrustService } from './services/trust.service';
import {
  VerificationRecord,
  PeerVerification,
  ReputationProfile,
  FraudAlert,
  VerificationStatus,
  VerificationType,
  VerificationMethod,
  STATUS_COLORS,
  SEVERITY_COLORS
} from './models/trust.model';

// ✅ PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-trust-layer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // ✅ PrimeNG replacements for Angular Material
    CardModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TabViewModule,
    BadgeModule,
    ProgressSpinnerModule,
    TooltipModule,
    MenuModule,
    TagModule,
    DividerModule,
    SplitButtonModule,
    TableModule,
    DialogModule
  ],
  templateUrl: './trust-layer.component.html',
  styleUrls: ['./trust-layer.component.scss']
})
export class TrustLayerComponent implements OnInit {
  // State signals
  verifications = signal<VerificationRecord[]>([]);
  peerVerifications = signal<PeerVerification[]>([]);
  reputationProfiles = signal<ReputationProfile[]>([]);
  fraudAlerts = signal<FraudAlert[]>([]);
  isLoading = signal(false);

  // Statistics signals
  verificationStats = signal({
    totalVerifications: 0,
    verifiedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    averageIntegrity: 0,
    byEntityType: {} as Record<string, number>,
    byMethod: {} as Record<string, number>
  });

  peerVerificationStats = signal({
    totalReviews: 0,
    verifiedCount: 0,
    averageConfidence: 0,
    averageReviewDuration: 0,
    bySubjectType: {} as Record<string, number>,
    byResult: {} as Record<string, number>
  });

  fraudStats = signal({
    totalAlerts: 0,
    openAlerts: 0,
    confirmedFraudCount: 0,
    dismissedCount: 0,
    averageConfidence: 0,
    byAlertType: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>
  });

  // Search and filter
  searchQuery = signal('');
  selectedStatuses = signal<VerificationStatus[]>([]);
  selectedEntityTypes = signal<VerificationType[]>([]);
  selectedMethods = signal<VerificationMethod[]>([]);

  // Computed filtered data
  filteredVerifications = computed(() => {
    let results = this.verifications();
    const query = this.searchQuery().toLowerCase();

    if (query) {
      results = results.filter(v =>
        v.entityId.toLowerCase().includes(query) ||
        v.verifier.toLowerCase().includes(query) ||
        v.verifierOrganization?.toLowerCase().includes(query)
      );
    }

    const statuses = this.selectedStatuses();
    if (statuses.length > 0) {
      results = results.filter(v => statuses.includes(v.status));
    }

    const types = this.selectedEntityTypes();
    if (types.length > 0) {
      results = results.filter(v => types.includes(v.entityType));
    }

    const methods = this.selectedMethods();
    if (methods.length > 0) {
      results = results.filter(v => methods.includes(v.verificationMethod));
    }

    return results;
  });

  filteredFraudAlerts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.fraudAlerts();

    return this.fraudAlerts().filter(a =>
      a.entityTitle.toLowerCase().includes(query) ||
      a.detectionMethod.toLowerCase().includes(query)
    );
  });

  // Constants
  readonly statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Verified', value: 'verified' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Expired', value: 'expired' },
    { label: 'Under Review', value: 'under-review' }
  ];

  readonly entityTypeOptions = [
    { label: 'Paper', value: 'paper' },
    { label: 'Dataset', value: 'dataset' },
    { label: 'Code', value: 'code' },
    { label: 'Methodology', value: 'methodology' },
    { label: 'Result', value: 'result' },
    { label: 'Claim', value: 'claim' }
  ];

  readonly methodOptions = [
    { label: 'Blockchain', value: 'blockchain' },
    { label: 'Peer Review', value: 'peer-review' },
    { label: 'Automated', value: 'automated' },
    { label: 'Manual', value: 'manual' },
    { label: 'Hybrid', value: 'hybrid' }
  ];

  constructor(private trustService: TrustService) {}

  // Helper functions for icons
  getEntityTypeIcon(type: VerificationType): string {
    const iconMap: Record<VerificationType, string> = {
      'paper': 'file',
      'dataset': 'database',
      'code': 'code',
      'methodology': 'sitemap',
      'result': 'chart-bar',
      'claim': 'comment'
    };
    return iconMap[type] || 'circle';
  }

  getStatusIcon(status: VerificationStatus): string {
    const iconMap: Record<VerificationStatus, string> = {
      'pending': 'clock',
      'in-progress': 'sync',
      'verified': 'check-circle',
      'rejected': 'times-circle',
      'expired': 'calendar-times',
      'under-review': 'search'
    };
    return iconMap[status] || 'circle';
  }

  getMethodIcon(method: VerificationMethod): string {
    const iconMap: Record<VerificationMethod, string> = {
      'blockchain': 'link',
      'peer-review': 'users',
      'automated': 'robot',
      'manual': 'user',
      'hybrid': 'cog'
    };
    return iconMap[method] || 'circle';
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    this.trustService.getAllVerifications().subscribe(verifications => {
      this.verifications.set(verifications);
    });

    this.trustService.getAllPeerVerifications().subscribe(reviews => {
      this.peerVerifications.set(reviews);
    });

    this.trustService.getTopReputationProfiles(10).subscribe(profiles => {
      this.reputationProfiles.set(profiles);
    });

    this.trustService.getActiveFraudAlerts().subscribe(alerts => {
      this.fraudAlerts.set(alerts);
    });

    this.trustService.getVerificationStatistics().subscribe(stats => {
      this.verificationStats.set(stats);
    });

    this.trustService.getPeerVerificationStatistics().subscribe(stats => {
      this.peerVerificationStats.set(stats);
    });

    this.trustService.getFraudStatistics().subscribe(stats => {
      this.fraudStats.set(stats);
      this.isLoading.set(false);
    });
  }

  // Search and filter methods
  searchVerifications(): void {
    const filters = {
      query: this.searchQuery(),
      status: this.selectedStatuses().length === 1 ? this.selectedStatuses()[0] : undefined,
      entityType: this.selectedEntityTypes().length === 1 ? this.selectedEntityTypes()[0] : undefined,
      method: this.selectedMethods().length === 1 ? this.selectedMethods()[0] : undefined
    };

    this.trustService.searchVerifications(filters).subscribe(results => {
      this.verifications.set(results);
    });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.selectedStatuses.set([]);
    this.selectedEntityTypes.set([]);
    this.selectedMethods.set([]);
    this.loadData();
  }

  // Verification actions
  viewVerification(verification: VerificationRecord): void {
    console.log('Viewing verification:', verification);
  }

  verifyEntity(entityId: string, entityType: VerificationType): void {
    console.log('Starting verification for:', entityId, entityType);
  }

  viewPeerVerification(verification: PeerVerification): void {
    console.log('Viewing peer verification:', verification);
  }

  submitPeerReview(): void {
    console.log('Opening peer review submission form');
  }

  viewReputationProfile(profile: ReputationProfile): void {
    console.log('Viewing reputation profile:', profile);
  }

  viewFraudAlert(alert: FraudAlert): void {
    console.log('Viewing fraud alert:', alert);
  }

  reportFraud(): void {
    console.log('Opening fraud report form');
  }

  // UI helpers
  getStatusColor(status: VerificationStatus): string {
    return STATUS_COLORS[status] || '#9e9e9e';
  }

  getSeverityColor(severity: string): string {
    return SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || '#9e9e9e';
  }

  formatHash(hash: string): string {
    if (!hash || hash.length < 16) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
