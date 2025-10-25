import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ PrimeNG UI Imports
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
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';

// Models and services
import {
  Grant,
  GrantMatch,
  GrantApplication,
  GrantStatistics,
  UserProfile,
  GrantCategory,
  FundingType
} from './models/grant.model';
import { GrantService } from './services/grant.service';

@Component({
  selector: 'app-grant-ai',
  standalone: true,
  providers: [GrantService, MessageService, ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,

    // ✅ PrimeNG Modules
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
    DividerModule,
    ToastModule,
    ConfirmDialogModule,
    AccordionModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './grant-ai.component.html',
  styleUrls: ['./grant-ai.component.scss']
})
export class GrantAiComponent implements OnInit {
  // ===== State signals =====
  allGrants = signal<Grant[]>([]);
  matchedGrants = signal<GrantMatch[]>([]);
  applications = signal<GrantApplication[]>([]);
  statistics = signal<GrantStatistics>({
    totalGrants: 0,
    openGrants: 0,
    closingSoonGrants: 0,
    averageAmount: 0,
    byCategory: {} as Record<GrantCategory, number>,
    byAgency: {},
    byFundingType: {} as Record<FundingType, number>
  });
  userProfile = signal<UserProfile | null>(null);
  isLoading = signal<boolean>(true);
  isGeneratingProposal = signal<boolean>(false);

  // Search and filter
  searchQuery: string = '';
  selectedCategories: GrantCategory[] = [];

  // Categories for filter
  categories: GrantCategory[] = [
    'Basic Research',
    'Applied Research',
    'Clinical Trials',
    'Education',
    'Infrastructure',
    'Collaboration',
    'Early Career',
    'Innovation'
  ];

  // ===== Computed properties =====
  filteredGrants = computed(() => {
    const grants = this.allGrants();
    if (!this.searchQuery && this.selectedCategories.length === 0) return grants;

    return grants.filter(grant => {
      const matchesSearch =
        !this.searchQuery ||
        grant.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        grant.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        grant.agency.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.selectedCategories.length === 0 || this.selectedCategories.includes(grant.category);

      return matchesSearch && matchesCategory;
    });
  });

  draftApplications = computed(() =>
    this.applications().filter(app => app.status === 'Draft' || app.status === 'In Progress')
  );

  submittedApplications = computed(() =>
    this.applications().filter(app => app.status !== 'Draft' && app.status !== 'In Progress')
  );

  constructor(
    private grantService: GrantService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // ===== Load Data =====
  loadData() {
    this.isLoading.set(true);
    this.userProfile.set(this.grantService.getUserProfile());

    this.grantService.getAllGrants().subscribe(grants => {
      this.allGrants.set(grants);

      const closingSoon = grants.filter(g => this.isClosingSoon(g.deadline)).length;
      const open = grants.filter(g => g.status === 'Open').length;
      this.statistics.set({
        totalGrants: grants.length,
        openGrants: open,
        closingSoonGrants: closingSoon,
        averageAmount:
          grants.reduce((sum, g) => sum + (g.amount.min + g.amount.max) / 2, 0) / grants.length,
        byCategory: {} as Record<GrantCategory, number>,
        byAgency: {},
        byFundingType: {} as Record<FundingType, number>
      });
    });

    const profile = this.userProfile();
    if (profile) {
      this.grantService.getMatchedGrants(profile).subscribe(matches => {
        this.matchedGrants.set(matches);
        this.statistics.update(stats => ({ ...stats, matchedGrants: matches.length }));
        this.isLoading.set(false);
      });
    } else {
      this.isLoading.set(false);
    }

    this.grantService.applications$.subscribe(apps => {
      this.applications.set(apps);
      this.statistics.update(stats => ({ ...stats, totalApplications: apps.length }));
    });
  }

  // ===== Search =====
  searchGrants() {
    this.isLoading.set(true);
    this.grantService
      .searchGrants(this.searchQuery, {
        categories:
          this.selectedCategories.length > 0 ? this.selectedCategories : undefined
      })
      .subscribe(grants => {
        this.allGrants.set(grants);
        this.isLoading.set(false);
      });
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.loadData();
  }

  // ===== Applications =====
  startApplication(grant: Grant) {
    const profile = this.userProfile();
    if (!profile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Profile Incomplete',
        detail: 'Please complete your profile first.'
      });
      return;
    }

    this.grantService.createApplication(grant);
    this.messageService.add({
      severity: 'success',
      summary: 'Draft Created',
      detail: 'Application draft created successfully.'
    });
  }

  generateProposal(application: GrantApplication) {
    const profile = this.userProfile();
    if (!profile) return;

    this.isGeneratingProposal.set(true);
    this.grantService.generateProposalDraft(application.grant, profile).subscribe(
      draft => {
        this.grantService.updateApplication(application.id, { proposalDraft: draft });
        this.isGeneratingProposal.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'AI Draft Ready',
          detail: 'Proposal draft generated successfully.'
        });
      },
      () => {
        this.isGeneratingProposal.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Generation Failed',
          detail: 'Could not generate proposal draft.'
        });
      }
    );
  }

  deleteApplication(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this application?',
      accept: () => {
        this.grantService.deleteApplication(id);
        this.messageService.add({
          severity: 'warn',
          summary: 'Deleted',
          detail: 'Application deleted successfully.'
        });
      }
    });
  }

  // ===== Formatters =====
  formatAmount(grant: Grant): string {
    const min = grant.amount.min.toLocaleString();
    const max = grant.amount.max.toLocaleString();
    const currency = grant.amount.currency;

    return grant.amount.min === grant.amount.max
      ? `${currency}${min}`
      : `${currency}${min} - ${currency}${max}`;
  }

  formatDeadline(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isClosingSoon(deadline: Date): boolean {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.floor(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil <= 30 && daysUntil >= 0;
  }

  getMatchScoreColor(score: number): string {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'danger';
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      'Draft': 'secondary',
      'In Progress': 'info',
      'Ready to Submit': 'warning',
      'Submitted': 'success',
      'Under Review': 'info',
      'Awarded': 'success',
      'Rejected': 'danger',
      'Withdrawn': 'secondary'
    };
    return map[status] || 'secondary';
  }
}
