import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Grant,
  GrantApplication,
  GrantMatch,
  GrantAlert,
  GrantStatistics,
  UserProfile,
  MOCK_GRANTS,
  ApplicationStatus,
  GrantCategory,
  ProposalSection
} from '../models/grant.model';

@Injectable({
  providedIn: 'root'
})
export class GrantService {
  private readonly STORAGE_KEY_APPLICATIONS = 'grant_applications';
  private readonly STORAGE_KEY_ALERTS = 'grant_alerts';
  private readonly STORAGE_KEY_PROFILE = 'user_profile';

  private applicationsSubject = new BehaviorSubject<GrantApplication[]>(this.loadApplications());
  private alertsSubject = new BehaviorSubject<GrantAlert[]>(this.loadAlerts());

  applications$ = this.applicationsSubject.asObservable();
  alerts$ = this.alertsSubject.asObservable();

  /**
   * Get all available grants
   */
  getAllGrants(): Observable<Grant[]> {
    return of(MOCK_GRANTS).pipe(delay(300));
  }

  /**
   * Search grants by keywords
   */
  searchGrants(query: string, filters?: {
    categories?: GrantCategory[];
    minAmount?: number;
    maxAmount?: number;
    deadline?: Date;
  }): Observable<Grant[]> {
    return of(MOCK_GRANTS).pipe(
      delay(400),
      map(grants => {
        let filtered = grants;

        // Text search
        if (query) {
          const lowerQuery = query.toLowerCase();
          filtered = filtered.filter(grant =>
            grant.title.toLowerCase().includes(lowerQuery) ||
            grant.description.toLowerCase().includes(lowerQuery) ||
            grant.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
            grant.agency.toLowerCase().includes(lowerQuery)
          );
        }

        // Category filter
        if (filters?.categories && filters.categories.length > 0) {
          filtered = filtered.filter(grant =>
            filters.categories!.includes(grant.category)
          );
        }

        // Amount filter
        if (filters?.minAmount !== undefined) {
          filtered = filtered.filter(grant => grant.amount.max >= filters.minAmount!);
        }
        if (filters?.maxAmount !== undefined) {
          filtered = filtered.filter(grant => grant.amount.min <= filters.maxAmount!);
        }

        // Deadline filter
        if (filters?.deadline) {
          filtered = filtered.filter(grant => grant.deadline <= filters.deadline!);
        }

        return filtered;
      })
    );
  }

  /**
   * Get AI-powered grant matches for user
   */
  getMatchedGrants(userProfile: UserProfile): Observable<GrantMatch[]> {
    return of(MOCK_GRANTS).pipe(
      delay(800),
      map(grants => {
        const matches: GrantMatch[] = grants.map(grant => {
          const match = this.calculateMatch(grant, userProfile);
          return match;
        });

        // Sort by match score
        return matches
          .filter(m => m.matchScore >= 40)
          .sort((a, b) => b.matchScore - a.matchScore);
      })
    );
  }

  /**
   * Calculate match score between grant and user profile
   */
  private calculateMatch(grant: Grant, profile: UserProfile): GrantMatch {
    let score = 0;
    const reasons: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Keyword matching (40 points)
    const keywordMatches = grant.keywords.filter(k =>
      profile.researchAreas.some(area =>
        area.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(area.toLowerCase())
      )
    );
    const keywordScore = Math.min((keywordMatches.length / grant.keywords.length) * 40, 40);
    score += keywordScore;

    if (keywordMatches.length > 0) {
      reasons.push(`${keywordMatches.length} keyword matches with your research areas`);
      strengths.push(`Strong alignment with ${keywordMatches.join(', ')}`);
    } else {
      weaknesses.push('Limited keyword overlap with your research areas');
      recommendations.push('Consider broadening your research focus or look for related grants');
    }

    // Eligibility matching (30 points)
    let eligibilityScore = 0;
    if (grant.eligibility.countries.includes(profile.country) || grant.eligibility.countries.includes('All Countries')) {
      eligibilityScore += 10;
      reasons.push('Geographic eligibility met');
    } else {
      weaknesses.push(`Not eligible: Grant limited to ${grant.eligibility.countries.join(', ')}`);
    }

    if (grant.eligibility.careerStage.includes(profile.careerStage) || grant.eligibility.careerStage.includes('All Levels')) {
      eligibilityScore += 10;
      reasons.push('Career stage requirement met');
    } else {
      weaknesses.push(`Career stage mismatch: Grant for ${grant.eligibility.careerStage.join(', ')}`);
    }

    if (grant.eligibility.institutions.some(i => i.toLowerCase().includes(profile.institution.toLowerCase()))) {
      eligibilityScore += 10;
      reasons.push('Institution type eligible');
    }

    score += eligibilityScore;

    // Track record (20 points)
    if (profile.previousGrants.length > 0) {
      const trackRecordScore = Math.min(profile.previousGrants.length * 5, 15);
      score += trackRecordScore;
      strengths.push(`${profile.previousGrants.length} previous grants demonstrate funding success`);
    } else {
      weaknesses.push('No previous grant history');
      if (grant.category === 'Early Career') {
        recommendations.push('This early career grant is well-suited for first-time applicants');
      }
    }

    if (profile.publications >= 10) {
      score += 5;
      strengths.push(`Strong publication record (${profile.publications} publications)`);
    }

    // Collaboration (10 points)
    if (profile.collaborators.length >= 3 && grant.category === 'Collaboration') {
      score += 10;
      strengths.push('Established collaboration network matches grant focus');
    }

    // Add general recommendations
    if (score >= 70) {
      recommendations.push('Highly recommended - start application immediately');
      recommendations.push('Gather letters of support from collaborators');
    } else if (score >= 50) {
      recommendations.push('Good potential match - review requirements carefully');
      recommendations.push('Consider reaching out to program officer for feedback');
    } else if (score >= 40) {
      recommendations.push('Moderate match - may require additional preparation');
    }

    return {
      grant: { ...grant, matchScore: Math.round(score) },
      matchScore: Math.round(score),
      reasons,
      strengths,
      weaknesses,
      recommendations
    };
  }

  /**
   * Get grant statistics
   */
  getStatistics(): Observable<GrantStatistics> {
    return of(MOCK_GRANTS).pipe(
      delay(200),
      map(grants => {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const stats: GrantStatistics = {
          totalGrants: grants.length,
          openGrants: grants.filter(g => g.status === 'Open').length,
          closingSoonGrants: grants.filter(g => g.deadline <= thirtyDaysFromNow).length,
          averageAmount: grants.reduce((sum, g) => sum + (g.amount.min + g.amount.max) / 2, 0) / grants.length,
          byCategory: {} as Record<GrantCategory, number>,
          byAgency: {},
          byFundingType: {} as any
        };

        // Count by category
        grants.forEach(grant => {
          stats.byCategory[grant.category] = (stats.byCategory[grant.category] || 0) + 1;
          stats.byAgency[grant.agency] = (stats.byAgency[grant.agency] || 0) + 1;
          stats.byFundingType[grant.fundingType] = (stats.byFundingType[grant.fundingType] || 0) + 1;
        });

        return stats;
      })
    );
  }

  /**
   * Get user applications
   */
  getApplications(): GrantApplication[] {
    return this.applicationsSubject.value;
  }

  /**
   * Create new application
   */
  createApplication(grant: Grant): GrantApplication {
    const application: GrantApplication = {
      id: this.generateId(),
      userId: 'demo-user',
      grantId: grant.id,
      grant: grant,
      status: 'Draft',
      proposalDraft: '',
      sections: this.createDefaultSections(),
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: ''
    };

    const applications = [...this.applicationsSubject.value, application];
    this.saveApplications(applications);
    this.applicationsSubject.next(applications);

    return application;
  }

  /**
   * Update application
   */
  updateApplication(applicationId: string, updates: Partial<GrantApplication>): void {
    const applications = this.applicationsSubject.value.map(app =>
      app.id === applicationId
        ? { ...app, ...updates, updatedAt: new Date() }
        : app
    );

    this.saveApplications(applications);
    this.applicationsSubject.next(applications);
  }

  /**
   * Delete application
   */
  deleteApplication(applicationId: string): void {
    const applications = this.applicationsSubject.value.filter(app => app.id !== applicationId);
    this.saveApplications(applications);
    this.applicationsSubject.next(applications);
  }

  /**
   * Generate AI proposal draft
   */
  generateProposalDraft(grant: Grant, userProfile: UserProfile): Observable<string> {
    // Simulate AI generation
    return of(this.createMockProposal(grant, userProfile)).pipe(delay(2000));
  }

  /**
   * Create alerts
   */
  createAlert(alert: Omit<GrantAlert, 'id' | 'createdAt' | 'userId'>): GrantAlert {
    const newAlert: GrantAlert = {
      id: this.generateId(),
      userId: 'demo-user',
      createdAt: new Date(),
      ...alert
    };

    const alerts = [...this.alertsSubject.value, newAlert];
    this.saveAlerts(alerts);
    this.alertsSubject.next(alerts);

    return newAlert;
  }

  /**
   * Delete alert
   */
  deleteAlert(alertId: string): void {
    const alerts = this.alertsSubject.value.filter(a => a.id !== alertId);
    this.saveAlerts(alerts);
    this.alertsSubject.next(alerts);
  }

  /**
   * Get user profile
   */
  getUserProfile(): UserProfile {
    const stored = localStorage.getItem(this.STORAGE_KEY_PROFILE);
    if (stored) {
      return JSON.parse(stored);
    }

    // Default profile
    const defaultProfile: UserProfile = {
      id: 'demo-user',
      researchAreas: ['Machine Learning', 'Artificial Intelligence', 'Computer Science'],
      institution: 'University',
      country: 'USA',
      careerStage: 'Assistant Professor',
      previousGrants: [],
      publications: 15,
      collaborators: ['Dr. Smith', 'Prof. Johnson', 'Dr. Lee']
    };

    this.saveUserProfile(defaultProfile);
    return defaultProfile;
  }

  /**
   * Update user profile
   */
  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }

  // Private helper methods

  private loadApplications(): GrantApplication[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_APPLICATIONS);
    if (stored) {
      const apps = JSON.parse(stored);
      // Convert date strings back to Date objects
      return apps.map((app: any) => ({
        ...app,
        createdAt: new Date(app.createdAt),
        updatedAt: new Date(app.updatedAt),
        submittedAt: app.submittedAt ? new Date(app.submittedAt) : undefined,
        grant: {
          ...app.grant,
          deadline: new Date(app.grant.deadline)
        }
      }));
    }
    return [];
  }

  private saveApplications(applications: GrantApplication[]): void {
    localStorage.setItem(this.STORAGE_KEY_APPLICATIONS, JSON.stringify(applications));
  }

  private loadAlerts(): GrantAlert[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_ALERTS);
    return stored ? JSON.parse(stored) : [];
  }

  private saveAlerts(alerts: GrantAlert[]): void {
    localStorage.setItem(this.STORAGE_KEY_ALERTS, JSON.stringify(alerts));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createDefaultSections(): ProposalSection[] {
    return [
      {
        id: this.generateId(),
        title: 'Abstract',
        content: '',
        wordCount: 0,
        aiGenerated: false,
        lastEdited: new Date()
      },
      {
        id: this.generateId(),
        title: 'Introduction',
        content: '',
        wordCount: 0,
        aiGenerated: false,
        lastEdited: new Date()
      },
      {
        id: this.generateId(),
        title: 'Research Plan',
        content: '',
        wordCount: 0,
        aiGenerated: false,
        lastEdited: new Date()
      },
      {
        id: this.generateId(),
        title: 'Methodology',
        content: '',
        wordCount: 0,
        aiGenerated: false,
        lastEdited: new Date()
      },
      {
        id: this.generateId(),
        title: 'Expected Outcomes',
        content: '',
        wordCount: 0,
        aiGenerated: false,
        lastEdited: new Date()
      },
      {
        id: this.generateId(),
        title: 'Budget Justification',
        content: '',
        wordCount: 0,
        aiGenerated: false,
        lastEdited: new Date()
      }
    ];
  }

  private createMockProposal(grant: Grant, profile: UserProfile): string {
    return `# Proposal for ${grant.title}

## Abstract

This proposal outlines a comprehensive research plan aligned with the ${grant.program} program objectives. Building upon ${profile.publications} previous publications and leveraging expertise in ${profile.researchAreas.join(', ')}, this project addresses critical challenges in the field.

## Introduction

The proposed research represents a significant advancement in ${profile.researchAreas[0]}, directly addressing the priorities outlined by ${grant.agency}. Our interdisciplinary team brings together expertise from ${profile.collaborators.join(', ')}, positioning us uniquely to tackle this important problem.

## Research Plan

### Objectives
1. Advance the state-of-the-art in ${profile.researchAreas[0]}
2. Develop novel methodologies for practical applications
3. Foster collaboration across institutions and disciplines
4. Train the next generation of researchers

### Timeline
- Year 1: Foundational research and methodology development
- Year 2: Implementation and validation
- Year 3: Dissemination and community building

## Expected Impact

This research will:
- Contribute fundamental knowledge to ${profile.researchAreas.join(' and ')}
- Produce high-impact publications in top-tier venues
- Train graduate students and postdoctoral researchers
- Establish new collaborative networks

## Budget Summary

Total Requested: $${grant.amount.min.toLocaleString()} - $${grant.amount.max.toLocaleString()}

- Personnel: 60%
- Equipment: 20%
- Travel: 10%
- Other Direct Costs: 10%

---

*This is an AI-generated draft. Please review and customize before submission.*
`;
  }
}
