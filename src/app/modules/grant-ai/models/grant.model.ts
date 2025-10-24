export interface Grant {
  id: string;
  title: string;
  agency: string;
  program: string;
  description: string;
  amount: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: Date;
  eligibility: {
    countries: string[];
    institutions: string[];
    careerStage: string[];
    requirements: string[];
  };
  keywords: string[];
  category: GrantCategory;
  url: string;
  matchScore?: number;
  status: GrantStatus;
  fundingType: FundingType;
}

export type GrantCategory = 
  | 'Basic Research'
  | 'Applied Research'
  | 'Clinical Trials'
  | 'Education'
  | 'Infrastructure'
  | 'Collaboration'
  | 'Early Career'
  | 'Innovation';

export type GrantStatus = 'Open' | 'Closing Soon' | 'Closed' | 'Archived';

export type FundingType = 
  | 'Fellowship'
  | 'Project Grant'
  | 'Equipment'
  | 'Training'
  | 'Travel'
  | 'Seed Funding';

export interface UserProfile {
  id: string;
  researchAreas: string[];
  institution: string;
  country: string;
  careerStage: string;
  previousGrants: string[];
  publications: number;
  collaborators: string[];
}

export interface GrantApplication {
  id: string;
  userId: string;
  grantId: string;
  grant: Grant;
  status: ApplicationStatus;
  proposalDraft: string;
  sections: ProposalSection[];
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
}

export type ApplicationStatus = 
  | 'Draft'
  | 'In Progress'
  | 'Ready to Submit'
  | 'Submitted'
  | 'Under Review'
  | 'Awarded'
  | 'Rejected'
  | 'Withdrawn';

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  aiGenerated: boolean;
  lastEdited: Date;
}

export interface GrantMatch {
  grant: Grant;
  matchScore: number;
  reasons: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface GrantAlert {
  id: string;
  userId: string;
  keywords: string[];
  categories: GrantCategory[];
  minAmount: number;
  active: boolean;
  createdAt: Date;
}

export interface GrantStatistics {
  totalGrants: number;
  openGrants: number;
  closingSoonGrants: number;
  averageAmount: number;
  byCategory: Record<GrantCategory, number>;
  byAgency: Record<string, number>;
  byFundingType: Record<FundingType, number>;
}

export const MOCK_GRANTS: Grant[] = [
  {
    id: 'nsf-career-2024',
    title: 'NSF CAREER Award: Faculty Early Career Development',
    agency: 'National Science Foundation',
    program: 'CAREER',
    description: 'The Faculty Early Career Development (CAREER) Program is a Foundation-wide activity that offers NSF\'s most prestigious awards in support of early-career faculty who have the potential to serve as academic role models in research and education.',
    amount: { min: 400000, max: 600000, currency: 'USD' },
    deadline: new Date('2025-07-22'),
    eligibility: {
      countries: ['USA'],
      institutions: ['Universities', 'Colleges'],
      careerStage: ['Assistant Professor', 'Early Career'],
      requirements: ['PhD required', 'Must be within 5 years of PhD', 'US Citizen or Permanent Resident']
    },
    keywords: ['STEM', 'Early Career', 'Research', 'Education Integration'],
    category: 'Early Career',
    url: 'https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=503214',
    status: 'Open',
    fundingType: 'Project Grant'
  },
  {
    id: 'nih-r01-2024',
    title: 'NIH R01: Research Project Grant',
    agency: 'National Institutes of Health',
    program: 'R01',
    description: 'The R01 grant supports discrete, specified, circumscribed projects in areas representing the investigator\'s specific interests and competencies. The R01 provides support for health-related research and development.',
    amount: { min: 250000, max: 500000, currency: 'USD' },
    deadline: new Date('2025-10-05'),
    eligibility: {
      countries: ['USA'],
      institutions: ['Universities', 'Research Institutions', 'Hospitals'],
      careerStage: ['All Levels'],
      requirements: ['Biomedical or behavioral research focus']
    },
    keywords: ['Health', 'Biomedical', 'Clinical Research'],
    category: 'Basic Research',
    url: 'https://grants.nih.gov/grants/funding/r01.htm',
    status: 'Open',
    fundingType: 'Project Grant'
  },
  {
    id: 'erc-starting-2024',
    title: 'ERC Starting Grant',
    agency: 'European Research Council',
    program: 'Starting Grant',
    description: 'ERC Starting Grants are designed to support excellent Principal Investigators at the career stage at which they are starting their own independent research team or programme.',
    amount: { min: 1000000, max: 1500000, currency: 'EUR' },
    deadline: new Date('2025-04-15'),
    eligibility: {
      countries: ['EU Member States', 'Associated Countries'],
      institutions: ['Universities', 'Research Institutions'],
      careerStage: ['Early Career'],
      requirements: ['2-7 years post-PhD', 'No previous ERC grant']
    },
    keywords: ['Any Field', 'Frontier Research', 'Excellence'],
    category: 'Early Career',
    url: 'https://erc.europa.eu/funding/starting-grants',
    status: 'Open',
    fundingType: 'Project Grant'
  },
  {
    id: 'wellcome-innovator-2024',
    title: 'Wellcome Innovator Award',
    agency: 'Wellcome Trust',
    program: 'Innovator Awards',
    description: 'Innovator Awards support researchers from any discipline who are ready to develop their innovative idea into a new product, service or intervention.',
    amount: { min: 50000, max: 600000, currency: 'GBP' },
    deadline: new Date('2025-09-30'),
    eligibility: {
      countries: ['UK', 'Ireland', 'Low/Middle Income Countries'],
      institutions: ['Universities', 'NGOs', 'Companies'],
      careerStage: ['All Levels'],
      requirements: ['Innovative health-focused idea']
    },
    keywords: ['Innovation', 'Health Technology', 'Global Health'],
    category: 'Innovation',
    url: 'https://wellcome.org/grant-funding/schemes/innovator-awards',
    status: 'Open',
    fundingType: 'Project Grant'
  },
  {
    id: 'marie-curie-2024',
    title: 'Marie Skłodowska-Curie Individual Fellowships',
    agency: 'European Commission',
    program: 'MSCA-IF',
    description: 'Individual Fellowships enhance the creative and innovative potential of experienced researchers wishing to diversify their individual competence through advanced training, international, interdisciplinary and inter-sectoral mobility.',
    amount: { min: 150000, max: 250000, currency: 'EUR' },
    deadline: new Date('2025-09-15'),
    eligibility: {
      countries: ['All Countries'],
      institutions: ['Universities', 'Research Institutions', 'Companies'],
      careerStage: ['Postdoctoral'],
      requirements: ['PhD or 4 years research experience']
    },
    keywords: ['Mobility', 'Training', 'Career Development'],
    category: 'Early Career',
    url: 'https://marie-sklodowska-curie-actions.ec.europa.eu/',
    status: 'Open',
    fundingType: 'Fellowship'
  },
  {
    id: 'gates-foundation-2024',
    title: 'Bill & Melinda Gates Foundation: Grand Challenges',
    agency: 'Bill & Melinda Gates Foundation',
    program: 'Grand Challenges',
    description: 'Grand Challenges create and support networks of innovators to solve key global health and development problems.',
    amount: { min: 100000, max: 1000000, currency: 'USD' },
    deadline: new Date('2025-12-01'),
    eligibility: {
      countries: ['All Countries'],
      institutions: ['Universities', 'NGOs', 'Companies', 'Individuals'],
      careerStage: ['All Levels'],
      requirements: ['Focus on global health or development challenges']
    },
    keywords: ['Global Health', 'Innovation', 'Development'],
    category: 'Innovation',
    url: 'https://gcgh.grandchallenges.org/',
    status: 'Open',
    fundingType: 'Seed Funding'
  }
];
