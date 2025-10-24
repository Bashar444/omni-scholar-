import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  VerificationRecord,
  PeerVerification,
  ReputationProfile,
  FraudAlert,
  DataLineage,
  CitationVerification,
  VerificationStatus,
  VerificationType,
  VerificationMethod,
  VerificationResult,
  FraudAlertType,
  AlertStatus,
  ReputationEventType,
  MOCK_VERIFICATIONS,
  MOCK_PEER_VERIFICATIONS,
  MOCK_REPUTATION_PROFILES,
  MOCK_FRAUD_ALERTS
} from '../models/trust.model';

@Injectable({
  providedIn: 'root'
})
export class TrustService {
  private readonly STORAGE_KEYS = {
    verifications: 'trust_layer_verifications',
    peerVerifications: 'trust_layer_peer_verifications',
    reputations: 'trust_layer_reputations',
    fraudAlerts: 'trust_layer_fraud_alerts',
    lineage: 'trust_layer_lineage',
    citations: 'trust_layer_citations'
  };

  private verificationsSubject = new BehaviorSubject<VerificationRecord[]>(this.loadFromStorage('verifications', MOCK_VERIFICATIONS));
  private peerVerificationsSubject = new BehaviorSubject<PeerVerification[]>(this.loadFromStorage('peerVerifications', MOCK_PEER_VERIFICATIONS));
  private reputationProfilesSubject = new BehaviorSubject<ReputationProfile[]>(this.loadFromStorage('reputations', MOCK_REPUTATION_PROFILES));
  private fraudAlertsSubject = new BehaviorSubject<FraudAlert[]>(this.loadFromStorage('fraudAlerts', MOCK_FRAUD_ALERTS));
  private lineageRecordsSubject = new BehaviorSubject<DataLineage[]>(this.loadFromStorage('lineage', []));
  private citationVerificationsSubject = new BehaviorSubject<CitationVerification[]>(this.loadFromStorage('citations', []));

  public verifications$ = this.verificationsSubject.asObservable();
  public peerVerifications$ = this.peerVerificationsSubject.asObservable();
  public reputationProfiles$ = this.reputationProfilesSubject.asObservable();
  public fraudAlerts$ = this.fraudAlertsSubject.asObservable();
  public lineageRecords$ = this.lineageRecordsSubject.asObservable();
  public citationVerifications$ = this.citationVerificationsSubject.asObservable();

  constructor() {}

  // ============================================================================
  // Blockchain Verification Methods
  // ============================================================================

  getAllVerifications(): Observable<VerificationRecord[]> {
    return of(this.verificationsSubject.value).pipe(delay(200));
  }

  getVerificationById(id: string): Observable<VerificationRecord | undefined> {
    const verification = this.verificationsSubject.value.find(v => v.id === id);
    return of(verification).pipe(delay(150));
  }

  getVerificationsByEntity(entityId: string): Observable<VerificationRecord[]> {
    const verifications = this.verificationsSubject.value.filter(v => v.entityId === entityId);
    return of(verifications).pipe(delay(200));
  }

  getVerificationsByStatus(status: VerificationStatus): Observable<VerificationRecord[]> {
    const verifications = this.verificationsSubject.value.filter(v => v.status === status);
    return of(verifications).pipe(delay(200));
  }

  searchVerifications(filters: {
    query?: string;
    entityType?: VerificationType;
    status?: VerificationStatus;
    method?: VerificationMethod;
    minIntegrity?: number;
  }): Observable<VerificationRecord[]> {
    let results = this.verificationsSubject.value;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(v =>
        v.entityId.toLowerCase().includes(query) ||
        v.verifier.toLowerCase().includes(query) ||
        v.verifierOrganization?.toLowerCase().includes(query)
      );
    }

    if (filters.entityType) {
      results = results.filter(v => v.entityType === filters.entityType);
    }

    if (filters.status) {
      results = results.filter(v => v.status === filters.status);
    }

    if (filters.method) {
      results = results.filter(v => v.verificationMethod === filters.method);
    }

    if (filters.minIntegrity !== undefined) {
      results = results.filter(v => v.metadata.integrityScore >= filters.minIntegrity!);
    }

    return of(results).pipe(delay(300));
  }

  createVerification(verification: Omit<VerificationRecord, 'id' | 'timestamp' | 'blockchainHash' | 'transactionId'>): Observable<VerificationRecord> {
    const newVerification: VerificationRecord = {
      ...verification,
      id: `ver_${Date.now()}`,
      timestamp: new Date(),
      blockchainHash: this.generateBlockchainHash(),
      transactionId: `tx_${this.generateRandomId()}`
    };

    const verifications = [...this.verificationsSubject.value, newVerification];
    this.verificationsSubject.next(verifications);
    this.saveToStorage('verifications', verifications);

    return of(newVerification).pipe(delay(500));
  }

  updateVerificationStatus(id: string, status: VerificationStatus): Observable<VerificationRecord | undefined> {
    const verifications = this.verificationsSubject.value.map(v =>
      v.id === id ? { ...v, status } : v
    );
    this.verificationsSubject.next(verifications);
    this.saveToStorage('verifications', verifications);

    const updated = verifications.find(v => v.id === id);
    return of(updated).pipe(delay(300));
  }

  // ============================================================================
  // Peer Verification Methods
  // ============================================================================

  getAllPeerVerifications(): Observable<PeerVerification[]> {
    return of(this.peerVerificationsSubject.value).pipe(delay(200));
  }

  getPeerVerificationById(id: string): Observable<PeerVerification | undefined> {
    const verification = this.peerVerificationsSubject.value.find(v => v.id === id);
    return of(verification).pipe(delay(150));
  }

  getPeerVerificationsBySubject(subjectId: string): Observable<PeerVerification[]> {
    const verifications = this.peerVerificationsSubject.value.filter(v => v.subjectId === subjectId);
    return of(verifications).pipe(delay(200));
  }

  searchPeerVerifications(filters: {
    query?: string;
    subjectType?: VerificationType;
    result?: VerificationResult;
    minConfidence?: number;
  }): Observable<PeerVerification[]> {
    let results = this.peerVerificationsSubject.value;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(v =>
        v.subjectTitle.toLowerCase().includes(query) ||
        v.verifierName.toLowerCase().includes(query)
      );
    }

    if (filters.subjectType) {
      results = results.filter(v => v.subjectType === filters.subjectType);
    }

    if (filters.result) {
      results = results.filter(v => v.result === filters.result);
    }

    if (filters.minConfidence !== undefined) {
      results = results.filter(v => v.confidence >= filters.minConfidence!);
    }

    return of(results).pipe(delay(300));
  }

  submitPeerVerification(verification: Omit<PeerVerification, 'id' | 'verificationDate' | 'status'>): Observable<PeerVerification> {
    const newVerification: PeerVerification = {
      ...verification,
      id: `peer_${Date.now()}`,
      verificationDate: new Date(),
      status: 'verified'
    };

    const verifications = [...this.peerVerificationsSubject.value, newVerification];
    this.peerVerificationsSubject.next(verifications);
    this.saveToStorage('peerVerifications', verifications);

    return of(newVerification).pipe(delay(500));
  }

  // ============================================================================
  // Reputation System Methods
  // ============================================================================

  getAllReputationProfiles(): Observable<ReputationProfile[]> {
    return of(this.reputationProfilesSubject.value).pipe(delay(200));
  }

  getReputationProfileById(userId: string): Observable<ReputationProfile | undefined> {
    const profile = this.reputationProfilesSubject.value.find(p => p.userId === userId);
    return of(profile).pipe(delay(150));
  }

  getTopReputationProfiles(limit: number = 10): Observable<ReputationProfile[]> {
    const sorted = [...this.reputationProfilesSubject.value]
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);
    return of(sorted).pipe(delay(200));
  }

  searchReputationProfiles(query: string): Observable<ReputationProfile[]> {
    const searchQuery = query.toLowerCase();
    const results = this.reputationProfilesSubject.value.filter(p =>
      p.userName.toLowerCase().includes(searchQuery)
    );
    return of(results).pipe(delay(300));
  }

  updateReputationScore(userId: string, eventType: ReputationEventType, points: number, description: string): Observable<ReputationProfile | undefined> {
    const profiles = this.reputationProfilesSubject.value.map(p => {
      if (p.userId === userId) {
        const newScore = p.overallScore + points;
        const event = {
          id: `event_${Date.now()}`,
          type: eventType,
          action: description,
          points,
          timestamp: new Date(),
          description
        };
        
        return {
          ...p,
          overallScore: Math.max(0, Math.min(1000, newScore)),
          history: [...p.history, event],
          lastUpdated: new Date()
        };
      }
      return p;
    });

    this.reputationProfilesSubject.next(profiles);
    this.saveToStorage('reputations', profiles);

    const updated = profiles.find(p => p.userId === userId);
    return of(updated).pipe(delay(300));
  }

  // ============================================================================
  // Fraud Detection Methods
  // ============================================================================

  getAllFraudAlerts(): Observable<FraudAlert[]> {
    return of(this.fraudAlertsSubject.value).pipe(delay(200));
  }

  getFraudAlertById(id: string): Observable<FraudAlert | undefined> {
    const alert = this.fraudAlertsSubject.value.find(a => a.id === id);
    return of(alert).pipe(delay(150));
  }

  getFraudAlertsBySeverity(severity: string): Observable<FraudAlert[]> {
    const alerts = this.fraudAlertsSubject.value.filter(a => a.severity === severity);
    return of(alerts).pipe(delay(200));
  }

  getActiveFraudAlerts(): Observable<FraudAlert[]> {
    const alerts = this.fraudAlertsSubject.value.filter(a => 
      a.status === 'open' || a.status === 'investigating'
    );
    return of(alerts).pipe(delay(200));
  }

  searchFraudAlerts(filters: {
    query?: string;
    alertType?: FraudAlertType;
    severity?: string;
    status?: AlertStatus;
    minConfidence?: number;
  }): Observable<FraudAlert[]> {
    let results = this.fraudAlertsSubject.value;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(a =>
        a.entityTitle.toLowerCase().includes(query) ||
        a.detectionMethod.toLowerCase().includes(query)
      );
    }

    if (filters.alertType) {
      results = results.filter(a => a.alertType === filters.alertType);
    }

    if (filters.severity) {
      results = results.filter(a => a.severity === filters.severity);
    }

    if (filters.status) {
      results = results.filter(a => a.status === filters.status);
    }

    if (filters.minConfidence !== undefined) {
      results = results.filter(a => a.confidence >= filters.minConfidence!);
    }

    return of(results).pipe(delay(300));
  }

  submitFraudAlert(alert: Omit<FraudAlert, 'id' | 'detectedAt' | 'status'>): Observable<FraudAlert> {
    const newAlert: FraudAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      detectedAt: new Date(),
      status: 'open'
    };

    const alerts = [...this.fraudAlertsSubject.value, newAlert];
    this.fraudAlertsSubject.next(alerts);
    this.saveToStorage('fraudAlerts', alerts);

    return of(newAlert).pipe(delay(500));
  }

  updateFraudAlertStatus(id: string, status: AlertStatus, investigator?: string, resolution?: string): Observable<FraudAlert | undefined> {
    const alerts = this.fraudAlertsSubject.value.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          investigator,
          resolution,
          resolvedAt: status === 'resolved' || status === 'dismissed' ? new Date() : undefined
        };
      }
      return a;
    });

    this.fraudAlertsSubject.next(alerts);
    this.saveToStorage('fraudAlerts', alerts);

    const updated = alerts.find(a => a.id === id);
    return of(updated).pipe(delay(300));
  }

  // ============================================================================
  // Statistics Methods
  // ============================================================================

  getVerificationStatistics(): Observable<{
    totalVerifications: number;
    verifiedCount: number;
    pendingCount: number;
    rejectedCount: number;
    averageIntegrity: number;
    byEntityType: Record<string, number>;
    byMethod: Record<string, number>;
  }> {
    const verifications = this.verificationsSubject.value;
    const stats = {
      totalVerifications: verifications.length,
      verifiedCount: verifications.filter(v => v.status === 'verified').length,
      pendingCount: verifications.filter(v => v.status === 'pending' || v.status === 'in-progress').length,
      rejectedCount: verifications.filter(v => v.status === 'rejected').length,
      averageIntegrity: verifications.length > 0 
        ? verifications.reduce((sum, v) => sum + v.metadata.integrityScore, 0) / verifications.length 
        : 0,
      byEntityType: this.groupByCount(verifications, 'entityType'),
      byMethod: this.groupByCount(verifications, 'verificationMethod')
    };

    return of(stats).pipe(delay(200));
  }

  getPeerVerificationStatistics(): Observable<{
    totalReviews: number;
    verifiedCount: number;
    averageConfidence: number;
    averageReviewDuration: number;
    bySubjectType: Record<string, number>;
    byResult: Record<string, number>;
  }> {
    const reviews = this.peerVerificationsSubject.value;
    const stats = {
      totalReviews: reviews.length,
      verifiedCount: reviews.filter(r => r.result === 'verified').length,
      averageConfidence: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.confidence, 0) / reviews.length 
        : 0,
      averageReviewDuration: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.reviewDuration, 0) / reviews.length 
        : 0,
      bySubjectType: this.groupByCount(reviews, 'subjectType'),
      byResult: this.groupByCount(reviews, 'result')
    };

    return of(stats).pipe(delay(200));
  }

  getFraudStatistics(): Observable<{
    totalAlerts: number;
    openAlerts: number;
    confirmedFraudCount: number;
    dismissedCount: number;
    averageConfidence: number;
    byAlertType: Record<string, number>;
    bySeverity: Record<string, number>;
  }> {
    const alerts = this.fraudAlertsSubject.value;
    const stats = {
      totalAlerts: alerts.length,
      openAlerts: alerts.filter(a => a.status === 'open' || a.status === 'investigating').length,
      confirmedFraudCount: alerts.filter(a => a.status === 'confirmed').length,
      dismissedCount: alerts.filter(a => a.status === 'dismissed').length,
      averageConfidence: alerts.length > 0 
        ? alerts.reduce((sum, a) => sum + a.confidence, 0) / alerts.length 
        : 0,
      byAlertType: this.groupByCount(alerts, 'alertType'),
      bySeverity: this.groupByCount(alerts, 'severity')
    };

    return of(stats).pipe(delay(200));
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private generateBlockchainHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private groupByCount<T>(items: T[], key: keyof T): Record<string, number> {
    return items.reduce((acc, item) => {
      const value = String(item[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private loadFromStorage<T>(key: keyof typeof this.STORAGE_KEYS, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS[key]);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return this.reviveDates(parsed);
      }
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
    }
    return defaultValue;
  }

  private saveToStorage<T>(key: keyof typeof this.STORAGE_KEYS, data: T): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS[key], JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  private reviveDates<T>(obj: any): T {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
      // Check if string matches ISO date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (dateRegex.test(obj)) {
        return new Date(obj) as any;
      }
      return obj as any;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.reviveDates(item)) as any;
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = this.reviveDates(obj[key]);
        }
      }
      return result;
    }
    
    return obj as any;
  }
}
