// ============================================================================
// GlobalKnowledgeBridge Models - Cross-Language Research Platform
// ============================================================================

// Multi-Language Paper Models
export interface MultilingualPaper {
  id: string;
  originalLanguage: LanguageCode;
  title: Partial<Record<LanguageCode, string>>;
  abstract: Partial<Record<LanguageCode, string>>;
  authors: Author[];
  journal: string;
  publicationDate: Date;
  doi?: string;
  keywords: Partial<Record<LanguageCode, string[]>>;
  availableLanguages: LanguageCode[];
  translationQuality: Partial<Record<LanguageCode, TranslationQuality>>;
  citations: number;
  field: ResearchField;
  openAccess: boolean;
  pdfUrl?: string;
  regions: GeographicRegion[];
  culturalContext?: CulturalContext;
}

export interface Author {
  id: string;
  name: Partial<Record<LanguageCode, string>>;
  originalName: string;
  affiliation: string;
  country: string;
  languagesSpoken: LanguageCode[];
  orcid?: string;
  email?: string;
}

export interface CulturalContext {
  region: GeographicRegion;
  researchTradition: string;
  methodologyApproach: string;
  culturalConsiderations: string[];
  localTerminology: Record<string, string>;
}

// Translation Models
export interface TranslationRequest {
  id: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  sourceText: string;
  translatedText?: string;
  requestedBy: string;
  requestedAt: Date;
  completedAt?: Date;
  status: TranslationStatus;
  translationService: TranslationService;
  confidence: number; // 0-100
  reviewedBy?: string;
  reviewStatus?: ReviewStatus;
  terminology?: TerminologyEntry[];
}

export interface TranslationQuality {
  score: number; // 0-100
  accuracy: number;
  fluency: number;
  terminology: number;
  reviewCount: number;
  lastReviewed?: Date;
  reviewedBy?: string[];
  isHumanReviewed: boolean;
  isProfessionalTranslation: boolean;
}

export interface TerminologyEntry {
  id: string;
  term: string;
  language: LanguageCode;
  translation: Record<LanguageCode, string>;
  field: ResearchField;
  definition: string;
  examples: string[];
  alternativeTerms: string[];
  frequency: number;
  confidence: number;
}

// Global Collaboration Models
export interface GlobalCollaboration {
  id: string;
  title: Partial<Record<LanguageCode, string>>;
  description: Partial<Record<LanguageCode, string>>;
  leader: CollaboratorProfile;
  members: CollaboratorProfile[];
  languages: LanguageCode[];
  primaryLanguage: LanguageCode;
  field: ResearchField;
  regions: GeographicRegion[];
  status: CollaborationStatus;
  startDate: Date;
  endDate?: Date;
  objectives: string[];
  deliverables: Deliverable[];
  meetings: CollaborationMeeting[];
  sharedResources: SharedResource[];
  visibility: CollaborationVisibility;
  tags: string[];
}

export interface CollaboratorProfile {
  id: string;
  name: string;
  displayName: Partial<Record<LanguageCode, string>>;
  affiliation: string;
  country: string;
  region: GeographicRegion;
  nativeLanguage: LanguageCode;
  additionalLanguages: LanguageCode[];
  expertise: string[];
  researchInterests: string[];
  timeZone: string;
  availability: AvailabilitySchedule;
  collaborationScore: number; // 0-100
  completedProjects: number;
  publications: number;
  rating: number; // 0-5
  reviewCount: number;
}

export interface AvailabilitySchedule {
  preferredHours: TimeRange[];
  timeZone: string;
  daysAvailable: DayOfWeek[];
  busyPeriods: BusyPeriod[];
}

export interface TimeRange {
  start: string; // HH:MM format
  end: string;
}

export interface BusyPeriod {
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: DeliverableStatus;
  assignedTo: string[];
  completionPercentage: number;
  files: FileAttachment[];
}

export interface CollaborationMeeting {
  id: string;
  title: string;
  scheduledAt: Date;
  duration: number; // in minutes
  timeZone: string;
  primaryLanguage: LanguageCode;
  translationProvided: boolean;
  supportedLanguages: LanguageCode[];
  participants: string[]; // collaborator IDs
  agenda: string;
  meetingLink?: string;
  recordingUrl?: string;
  notes?: string;
  status: MeetingStatus;
}

export interface SharedResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  language: LanguageCode;
  translationsAvailable: LanguageCode[];
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl: string;
  fileSize: number;
  accessLevel: AccessLevel;
  downloadCount: number;
  tags: string[];
}

export interface FileAttachment {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
  uploadedBy: string;
  url: string;
}

// Language Detection and Processing Models
export interface LanguageDetection {
  detectedLanguage: LanguageCode;
  confidence: number; // 0-100
  alternativeLanguages: Array<{
    language: LanguageCode;
    confidence: number;
  }>;
  script: string;
  isReliable: boolean;
}

export interface CrossLingualSearch {
  id: string;
  query: string;
  sourceLanguage: LanguageCode;
  targetLanguages: LanguageCode[];
  translatedQueries: Partial<Record<LanguageCode, string>>;
  results: MultilingualPaper[];
  resultCount: number;
  searchDate: Date;
  filters: SearchFilter[];
  relevanceScores: Record<string, number>; // paperId -> score
}

export interface SearchFilter {
  type: FilterType;
  value: string | string[] | DateRange;
  label: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Translation Memory and Learning Models
export interface TranslationMemory {
  id: string;
  sourceSegment: string;
  targetSegment: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  field: ResearchField;
  quality: number; // 0-100
  usageCount: number;
  lastUsed: Date;
  createdBy: string;
  createdAt: Date;
  metadata: Record<string, any>;
}

export interface LanguageProfile {
  userId: string;
  nativeLanguage: LanguageCode;
  fluentLanguages: LanguageCode[];
  learningLanguages: LanguagePreference[];
  preferredTranslationServices: TranslationService[];
  translationHistory: TranslationRequest[];
  contributedTranslations: number;
  translationQualityScore: number; // 0-100
  languagePairExpertise: LanguagePair[];
  certifications: LanguageCertification[];
}

export interface LanguagePreference {
  language: LanguageCode;
  proficiency: LanguageProficiency;
  learningGoals: string[];
  lastPracticed: Date;
}

export interface LanguagePair {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  translationCount: number;
  averageQuality: number;
  specialization: ResearchField[];
}

export interface LanguageCertification {
  id: string;
  language: LanguageCode;
  certificationType: string;
  level: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  verificationUrl?: string;
}

// Statistics and Analytics Models
export interface TranslationStatistics {
  totalTranslations: number;
  translationsByLanguage: Record<LanguageCode, number>;
  translationsByField: Record<ResearchField, number>;
  averageQuality: number;
  topLanguagePairs: Array<{
    source: LanguageCode;
    target: LanguageCode;
    count: number;
  }>;
  translationTrends: Array<{
    date: Date;
    count: number;
  }>;
}

export interface CollaborationStatistics {
  totalCollaborations: number;
  activeCollaborations: number;
  collaborationsByRegion: Record<GeographicRegion, number>;
  collaborationsByLanguage: Record<LanguageCode, number>;
  averageTeamSize: number;
  successRate: number; // percentage
  topResearchFields: Array<{
    field: ResearchField;
    count: number;
  }>;
}

// Type Unions and Enums
export type LanguageCode = 
  | 'en' | 'es' | 'zh' | 'hi' | 'ar' | 'pt' | 'ru' | 'ja' | 'de' | 'fr'
  | 'it' | 'ko' | 'nl' | 'pl' | 'tr' | 'vi' | 'th' | 'id' | 'he' | 'sv';

export type GeographicRegion = 
  | 'North America' | 'South America' | 'Europe' | 'Middle East' 
  | 'Africa' | 'Asia' | 'Oceania' | 'Central America' | 'Caribbean';

export type ResearchField = 
  | 'Medicine' | 'Biology' | 'Physics' | 'Chemistry' | 'Computer Science'
  | 'Engineering' | 'Mathematics' | 'Social Sciences' | 'Humanities' | 'Environmental Science';

export type TranslationStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'under-review';
export type TranslationService = 'ai-powered' | 'human' | 'hybrid' | 'community' | 'professional';
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';

export type CollaborationStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export type CollaborationVisibility = 'public' | 'private' | 'invitation-only';
export type DeliverableStatus = 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
export type MeetingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled';

export type ResourceType = 'document' | 'dataset' | 'code' | 'presentation' | 'video' | 'audio' | 'image' | 'other';
export type AccessLevel = 'public' | 'team-only' | 'restricted' | 'private';

export type FilterType = 'language' | 'field' | 'region' | 'date' | 'openAccess' | 'translationQuality';
export type LanguageProficiency = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// Language Information
export const SUPPORTED_LANGUAGES: Record<LanguageCode, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  pl: { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  tr: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  th: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  he: { name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  sv: { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' }
};

// Mock Data
export const MOCK_MULTILINGUAL_PAPERS: MultilingualPaper[] = [
  {
    id: 'paper_1',
    originalLanguage: 'zh',
    title: {
      zh: '基于深度学习的癌症早期诊断研究',
      en: 'Deep Learning-Based Early Cancer Diagnosis Research',
      es: 'Investigación sobre diagnóstico temprano de cáncer basado en aprendizaje profundo'
    },
    abstract: {
      zh: '本研究提出了一种新型深度学习模型，用于癌症的早期诊断。该模型在多个数据集上表现出色，准确率达到95%以上。',
      en: 'This study proposes a novel deep learning model for early cancer diagnosis. The model demonstrates excellent performance across multiple datasets, achieving accuracy above 95%.',
      es: 'Este estudio propone un nuevo modelo de aprendizaje profundo para el diagnóstico temprano del cáncer. El modelo demuestra un rendimiento excelente en múltiples conjuntos de datos, logrando una precisión superior al 95%.'
    },
    authors: [
      {
        id: 'author_1',
        name: { zh: '李明', en: 'Li Ming', es: 'Li Ming' },
        originalName: '李明',
        affiliation: 'Tsinghua University',
        country: 'China',
        languagesSpoken: ['zh', 'en'],
        orcid: '0000-0001-2345-6789'
      }
    ],
    journal: 'Nature Medicine',
    publicationDate: new Date('2024-08-15'),
    doi: '10.1038/nm.2024.12345',
    keywords: {
      zh: ['深度学习', '癌症诊断', '医学影像', '人工智能'],
      en: ['deep learning', 'cancer diagnosis', 'medical imaging', 'artificial intelligence'],
      es: ['aprendizaje profundo', 'diagnóstico de cáncer', 'imagen médica', 'inteligencia artificial']
    },
    availableLanguages: ['zh', 'en', 'es'],
    translationQuality: {
      en: { score: 92, accuracy: 95, fluency: 90, terminology: 91, reviewCount: 3, isHumanReviewed: true, isProfessionalTranslation: true },
      es: { score: 88, accuracy: 90, fluency: 87, terminology: 87, reviewCount: 2, isHumanReviewed: true, isProfessionalTranslation: false }
    },
    citations: 47,
    field: 'Medicine',
    openAccess: true,
    regions: ['Asia'],
    culturalContext: {
      region: 'Asia',
      researchTradition: 'Eastern Medical Research',
      methodologyApproach: 'Integration of traditional and modern approaches',
      culturalConsiderations: ['Traditional medicine perspective', 'Holistic health approach'],
      localTerminology: { '气': 'Qi/Life Energy', '经络': 'Meridian System' }
    }
  },
  {
    id: 'paper_2',
    originalLanguage: 'ar',
    title: {
      ar: 'الطاقة المتجددة في الشرق الأوسط: فرص وتحديات',
      en: 'Renewable Energy in the Middle East: Opportunities and Challenges',
      fr: 'Énergie renouvelable au Moyen-Orient : Opportunités et défis'
    },
    abstract: {
      ar: 'تستكشف هذه الدراسة إمكانات الطاقة المتجددة في منطقة الشرق الأوسط، مع التركيز على الطاقة الشمسية وطاقة الرياح.',
      en: 'This study explores the potential of renewable energy in the Middle East region, focusing on solar and wind energy.',
      fr: 'Cette étude explore le potentiel des énergies renouvelables dans la région du Moyen-Orient, en se concentrant sur l\'énergie solaire et éolienne.'
    },
    authors: [
      {
        id: 'author_2',
        name: { ar: 'أحمد الفهد', en: 'Ahmed Al-Fahd', fr: 'Ahmed Al-Fahd' },
        originalName: 'أحمد الفهد',
        affiliation: 'King Abdullah University',
        country: 'Saudi Arabia',
        languagesSpoken: ['ar', 'en', 'fr']
      }
    ],
    journal: 'Energy Policy',
    publicationDate: new Date('2024-09-20'),
    keywords: {
      ar: ['الطاقة المتجددة', 'الطاقة الشمسية', 'الشرق الأوسط', 'الاستدامة'],
      en: ['renewable energy', 'solar power', 'Middle East', 'sustainability'],
      fr: ['énergie renouvelable', 'énergie solaire', 'Moyen-Orient', 'durabilité']
    },
    availableLanguages: ['ar', 'en', 'fr'],
    translationQuality: {
      en: { score: 94, accuracy: 96, fluency: 93, terminology: 93, reviewCount: 4, isHumanReviewed: true, isProfessionalTranslation: true },
      fr: { score: 90, accuracy: 92, fluency: 89, terminology: 89, reviewCount: 2, isHumanReviewed: true, isProfessionalTranslation: true }
    },
    citations: 32,
    field: 'Environmental Science',
    openAccess: true,
    regions: ['Middle East']
  }
];

export const MOCK_COLLABORATIONS: GlobalCollaboration[] = [
  {
    id: 'collab_1',
    title: {
      en: 'Global Climate Change Research Initiative',
      es: 'Iniciativa Global de Investigación sobre Cambio Climático',
      fr: 'Initiative mondiale de recherche sur le changement climatique'
    },
    description: {
      en: 'International collaboration studying climate change impacts across different regions',
      es: 'Colaboración internacional que estudia los impactos del cambio climático en diferentes regiones',
      fr: 'Collaboration internationale étudiant les impacts du changement climatique dans différentes régions'
    },
    leader: {
      id: 'user_1',
      name: 'Dr. Maria Garcia',
      displayName: { en: 'Dr. Maria Garcia', es: 'Dra. Maria García' },
      affiliation: 'University of Barcelona',
      country: 'Spain',
      region: 'Europe',
      nativeLanguage: 'es',
      additionalLanguages: ['en', 'fr'],
      expertise: ['Climate Science', 'Environmental Policy'],
      researchInterests: ['Global Warming', 'Carbon Emissions'],
      timeZone: 'Europe/Madrid',
      availability: {
        preferredHours: [{ start: '09:00', end: '17:00' }],
        timeZone: 'Europe/Madrid',
        daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        busyPeriods: []
      },
      collaborationScore: 95,
      completedProjects: 12,
      publications: 47,
      rating: 4.8,
      reviewCount: 15
    },
    members: [],
    languages: ['en', 'es', 'fr', 'de', 'zh'],
    primaryLanguage: 'en',
    field: 'Environmental Science',
    regions: ['Europe', 'North America', 'Asia'],
    status: 'active',
    startDate: new Date('2024-01-15'),
    objectives: [
      'Study regional climate patterns',
      'Develop mitigation strategies',
      'Create cross-cultural awareness'
    ],
    deliverables: [],
    meetings: [],
    sharedResources: [],
    visibility: 'public',
    tags: ['climate-change', 'international', 'multi-region']
  }
];

export const TRANSLATION_SERVICE_COLORS: Record<TranslationService, string> = {
  'ai-powered': '#2196f3',
  'human': '#4caf50',
  'hybrid': '#ff9800',
  'community': '#9c27b0',
  'professional': '#f44336'
};

export const COLLABORATION_STATUS_COLORS: Record<CollaborationStatus, string> = {
  'planning': '#ffc107',
  'active': '#4caf50',
  'on-hold': '#ff9800',
  'completed': '#2196f3',
  'cancelled': '#9e9e9e'
};
