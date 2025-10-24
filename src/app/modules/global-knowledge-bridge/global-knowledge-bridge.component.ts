import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from './services/translation.service';
import {
  MultilingualPaper,
  GlobalCollaboration,
  LanguageCode,
  ResearchField,
  GeographicRegion,
  CollaborationStatus,
  SUPPORTED_LANGUAGES
} from './models/translation.model';

// ✅ PrimeNG modules replacing Angular Material
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-global-knowledge-bridge',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // ✅ PrimeNG replacements for Angular Material modules
    CardModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    DropdownModule,
    TabViewModule,
    BadgeModule,
    ProgressSpinnerModule,
    TooltipModule,
    MenuModule,
    DividerModule,
    TableModule,
    DialogModule,
    TagModule,
    MultiSelectModule
  ],
  templateUrl: './global-knowledge-bridge.component.html',
  styleUrls: ['./global-knowledge-bridge.component.scss']
})
export class GlobalKnowledgeBridgeComponent implements OnInit {
  // State signals
  papers = signal<MultilingualPaper[]>([]);
  selectedPaper: MultilingualPaper | null = null;
  collaborations = signal<GlobalCollaboration[]>([]);
  isLoading = signal(false);

  // PrimeNG Menu Items
  translateMenuItems = computed(() => 
    this.supportedLanguages.slice(0, 10).map(lang => ({
      label: `${lang.flag} ${lang.name}`,
      command: () => this.selectedPaper && this.translatePaper(this.selectedPaper, lang.code)
    }))
  );

  // Statistics signals
  paperStats = signal({
    totalPapers: 0,
    byLanguage: {} as Record<string, number>,
    byField: {} as Record<string, number>,
    byRegion: {} as Record<string, number>,
    averageTranslationQuality: 0,
    openAccessPercentage: 0
  });

  collaborationStats = signal({
    totalCollaborations: 0,
    activeCollaborations: 0,
    byLanguage: {} as Record<string, number>,
    byField: {} as Record<string, number>,
    byRegion: {} as Record<string, number>,
    averageTeamSize: 0
  });

  // Search and filter
  searchQuery = signal('');
  selectedLanguages = signal<LanguageCode[]>([]);
  selectedFields = signal<ResearchField[]>([]);
  selectedRegions = signal<GeographicRegion[]>([]);
  selectedUserLanguage = signal<LanguageCode>('en');

  // Computed filtered data
  filteredPapers = computed(() => {
    let results = this.papers();

    const query = this.searchQuery().toLowerCase();
    if (query) {
      results = results.filter(p =>
        Object.values(p.title).some(title => title.toLowerCase().includes(query)) ||
        Object.values(p.abstract).some(abstract => abstract.toLowerCase().includes(query))
      );
    }

    const languages = this.selectedLanguages();
    if (languages.length > 0) {
      results = results.filter(p =>
        languages.some(lang => p.availableLanguages.includes(lang))
      );
    }

    const fields = this.selectedFields();
    if (fields.length > 0) {
      results = results.filter(p => fields.includes(p.field));
    }

    const regions = this.selectedRegions();
    if (regions.length > 0) {
      results = results.filter(p =>
        regions.some(region => p.regions.includes(region))
      );
    }

    return results;
  });

  filteredCollaborations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.collaborations();

    return this.collaborations().filter(c =>
      Object.values(c.title).some(title => title.toLowerCase().includes(query)) ||
      c.leader.name.toLowerCase().includes(query)
    );
  });

  // Constants
  readonly supportedLanguages = Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
    code: code as LanguageCode,
    ...info
  }));

  readonly researchFields: ResearchField[] = [
    'Medicine', 'Biology', 'Physics', 'Chemistry', 'Computer Science',
    'Engineering', 'Mathematics', 'Social Sciences', 'Humanities', 'Environmental Science'
  ];

  readonly geographicRegions: GeographicRegion[] = [
    'North America', 'South America', 'Europe', 'Middle East',
    'Africa', 'Asia', 'Oceania', 'Central America', 'Caribbean'
  ];

  readonly collaborationStatuses: CollaborationStatus[] = ['planning', 'active', 'on-hold', 'completed', 'cancelled'];

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    this.translationService.getAllPapers().subscribe(papers => {
      this.papers.set(papers);
    });

    this.translationService.getAllCollaborations().subscribe(collaborations => {
      this.collaborations.set(collaborations);
    });

    this.translationService.getPaperStatistics().subscribe(stats => {
      this.paperStats.set(stats);
    });

    this.translationService.getCollaborationStatistics().subscribe(stats => {
      this.collaborationStats.set(stats);
      this.isLoading.set(false);
    });
  }

  // Search and filter methods
  searchPapers(): void {
    const filters = {
      query: this.searchQuery(),
      languages: this.selectedLanguages(),
      fields: this.selectedFields(),
      regions: this.selectedRegions()
    };

    this.translationService.searchPapers(filters).subscribe(results => {
      this.papers.set(results);
    });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.selectedLanguages.set([]);
    this.selectedFields.set([]);
    this.selectedRegions.set([]);
    this.loadData();
  }

  // Paper actions
  viewPaper(paper: MultilingualPaper): void {
    console.log('Viewing paper:', paper);
  }

  translatePaper(paper: MultilingualPaper, targetLanguage: LanguageCode): void {
    console.log('Translating paper to:', targetLanguage);
  }

  downloadPaper(paper: MultilingualPaper): void {
    console.log('Downloading paper:', paper.id);
  }

  // Collaboration actions
  viewCollaboration(collaboration: GlobalCollaboration): void {
    console.log('Viewing collaboration:', collaboration);
  }

  createCollaboration(): void {
    console.log('Opening collaboration creation form');
  }

  joinCollaboration(collaboration: GlobalCollaboration): void {
    console.log('Joining collaboration:', collaboration.id);
    this.translationService.joinCollaboration(collaboration.id, 'current_user').subscribe(success => {
      if (success) {
        console.log('Successfully joined collaboration');
      }
    });
  }

  // UI helper methods
  getLanguageName(code: LanguageCode): string {
    return SUPPORTED_LANGUAGES[code]?.name || code;
  }

  getLanguageFlag(code: LanguageCode): string {
    return SUPPORTED_LANGUAGES[code]?.flag || '🌐';
  }

  getLanguageNativeName(code: LanguageCode): string {
    return SUPPORTED_LANGUAGES[code]?.nativeName || code;
  }

  getPaperTitle(paper: MultilingualPaper): string {
    const userLang = this.selectedUserLanguage();
    return paper.title[userLang] || paper.title[paper.originalLanguage] || Object.values(paper.title)[0];
  }

  getPaperAbstract(paper: MultilingualPaper): string {
    const userLang = this.selectedUserLanguage();
    return paper.abstract[userLang] || paper.abstract[paper.originalLanguage] || Object.values(paper.abstract)[0];
  }

  getCollaborationTitle(collaboration: GlobalCollaboration): string {
    const userLang = this.selectedUserLanguage();
    return collaboration.title[userLang] || collaboration.title[collaboration.primaryLanguage] || Object.values(collaboration.title)[0];
  }

  getCollaborationDescription(collaboration: GlobalCollaboration): string {
    const userLang = this.selectedUserLanguage();
    return collaboration.description[userLang] || collaboration.description[collaboration.primaryLanguage] || Object.values(collaboration.description)[0];
  }

  getTranslationQualityColor(score: number): string {
    if (score >= 90) return '#4caf50';
    if (score >= 75) return '#8bc34a';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  }

  getCollaborationStatusColor(status: CollaborationStatus): string {
    const colors: Record<CollaborationStatus, string> = {
      'planning': '#ffc107',
      'active': '#4caf50',
      'on-hold': '#ff9800',
      'completed': '#2196f3',
      'cancelled': '#9e9e9e'
    };
    return colors[status] || '#9e9e9e';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
