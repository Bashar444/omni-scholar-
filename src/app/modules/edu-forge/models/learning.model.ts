// ============================================================================
// EduForge Models - Learning & Mentorship Platform
// ============================================================================

// Course Related Models
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  difficulty: DifficultyLevel;
  category: CourseCategory;
  topics: string[];
  duration: number; // in minutes
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  reviewsCount: number;
  thumbnail?: string;
  isPublished: boolean;
  isFeatured: boolean;
  lessons: Lesson[];
  quizzes: Quiz[];
  certificate?: Certificate;
  prerequisites: string[];
  learningOutcomes: string[];
  sourcePapers?: string[]; // Paper IDs that generated this course
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string; // Markdown or HTML content
  order: number;
  duration: number; // in minutes
  type: LessonType;
  videoUrl?: string;
  resources: Resource[];
  isCompleted?: boolean;
  completedAt?: Date;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  size?: string;
  downloadable: boolean;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
  attemptsAllowed: number;
  attempts?: QuizAttempt[];
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[]; // single or multiple correct answers
  explanation?: string;
  points: number;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: { [questionId: string]: string | string[] };
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
  timeSpent: number; // in seconds
}

export interface Certificate {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  courseName: string;
  issueDate: Date;
  certificateUrl?: string;
  verificationCode: string;
}

// Mentorship Related Models
export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  avatar?: string;
  bio: string;
  expertise: string[];
  researchAreas: string[];
  publications: number;
  hIndex: number;
  rating: number;
  reviewsCount: number;
  menteeCount: number;
  availability: AvailabilitySlot[];
  languages: string[];
  hourlyRate?: number;
  isFeatured: boolean;
  socialLinks?: SocialLinks;
  createdAt: Date;
}

export interface MentorshipRequest {
  id: string;
  menteeId: string;
  menteeName: string;
  mentorId: string;
  mentorName: string;
  topic: string;
  description: string;
  status: MentorshipStatus;
  proposedTime?: Date;
  duration?: number; // in minutes
  createdAt: Date;
  respondedAt?: Date;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  mentorName: string;
  menteeId: string;
  menteeName: string;
  topic: string;
  description: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: SessionStatus;
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  completedAt?: Date;
}

export interface AvailabilitySlot {
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '17:00'
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  researchGate?: string;
  googleScholar?: string;
  orcid?: string;
}

// Progress Tracking
export interface LearningProgress {
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedLessons: string[]; // lesson IDs
  totalLessons: number;
  completedQuizzes: string[]; // quiz IDs
  totalQuizzes: number;
  progressPercentage: number;
  lastAccessedAt: Date;
  certificateEarned?: boolean;
  certificateId?: string;
}

export interface UserStats {
  userId: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  totalLearningTime: number; // in minutes
  averageQuizScore: number;
  currentStreak: number; // days
  longestStreak: number; // days
  mentorshipSessions: number;
}

// Discussion Forum
export interface ForumPost {
  id: string;
  courseId: string;
  lessonId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  replies: ForumReply[];
  isResolved: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  isAccepted: boolean; // for marking best answer
  createdAt: Date;
}

// Type Unions and Enums
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CourseCategory = 'biology' | 'physics' | 'chemistry' | 'medicine' | 'computer-science' | 'engineering' | 'social-sciences' | 'mathematics' | 'other';
export type LessonType = 'video' | 'text' | 'interactive' | 'quiz' | 'assignment';
export type ResourceType = 'pdf' | 'video' | 'link' | 'code' | 'dataset';
export type QuestionType = 'multiple-choice' | 'multiple-answer' | 'true-false' | 'short-answer' | 'essay';
export type MentorshipStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'missed';

// Mock Data
export const MOCK_COURSES: Course[] = [
  {
    id: 'course_1',
    title: 'Introduction to CRISPR Gene Editing',
    description: 'Learn the fundamentals of CRISPR-Cas9 technology and its applications in genetic engineering. This course covers the history, mechanisms, and ethical considerations of gene editing.',
    instructor: 'Dr. Jennifer Chen',
    instructorAvatar: 'https://i.pravatar.cc/150?img=1',
    difficulty: 'intermediate',
    category: 'biology',
    topics: ['CRISPR', 'Gene Editing', 'Molecular Biology', 'Genetics'],
    duration: 240,
    lessonsCount: 8,
    enrolledCount: 1247,
    rating: 4.8,
    reviewsCount: 342,
    isPublished: true,
    isFeatured: true,
    lessons: [],
    quizzes: [],
    prerequisites: ['Basic Biology', 'Genetics 101'],
    learningOutcomes: [
      'Understand the molecular mechanism of CRISPR-Cas9',
      'Design guide RNAs for gene targeting',
      'Evaluate ethical implications of gene editing',
      'Apply CRISPR techniques in research contexts'
    ],
    sourcePapers: ['paper_123', 'paper_456'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-10')
  },
  {
    id: 'course_2',
    title: 'Machine Learning for Drug Discovery',
    description: 'Explore how artificial intelligence and machine learning are revolutionizing pharmaceutical research and drug development processes.',
    instructor: 'Prof. Michael Zhang',
    instructorAvatar: 'https://i.pravatar.cc/150?img=2',
    difficulty: 'advanced',
    category: 'computer-science',
    topics: ['Machine Learning', 'Drug Discovery', 'AI', 'Bioinformatics'],
    duration: 360,
    lessonsCount: 12,
    enrolledCount: 892,
    rating: 4.9,
    reviewsCount: 218,
    isPublished: true,
    isFeatured: true,
    lessons: [],
    quizzes: [],
    prerequisites: ['Python Programming', 'Statistics', 'Basic Chemistry'],
    learningOutcomes: [
      'Apply ML algorithms to molecular property prediction',
      'Build neural networks for drug-target interaction',
      'Implement virtual screening pipelines',
      'Evaluate model performance in drug discovery'
    ],
    sourcePapers: ['paper_789', 'paper_101'],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-10-15')
  },
  {
    id: 'course_3',
    title: 'Quantum Computing Fundamentals',
    description: 'A comprehensive introduction to quantum computing principles, quantum algorithms, and their applications in scientific research.',
    instructor: 'Dr. Sarah Williams',
    instructorAvatar: 'https://i.pravatar.cc/150?img=3',
    difficulty: 'advanced',
    category: 'physics',
    topics: ['Quantum Computing', 'Quantum Algorithms', 'Qubits', 'Superposition'],
    duration: 480,
    lessonsCount: 15,
    enrolledCount: 654,
    rating: 4.7,
    reviewsCount: 167,
    isPublished: true,
    isFeatured: false,
    lessons: [],
    quizzes: [],
    prerequisites: ['Linear Algebra', 'Complex Numbers', 'Basic Physics'],
    learningOutcomes: [
      'Understand quantum superposition and entanglement',
      'Implement basic quantum algorithms',
      'Use quantum programming languages',
      'Analyze quantum circuit complexity'
    ],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-09-28')
  },
  {
    id: 'course_4',
    title: 'Clinical Trial Design and Analysis',
    description: 'Master the principles of designing, conducting, and analyzing clinical trials in medical research.',
    instructor: 'Dr. Robert Anderson',
    instructorAvatar: 'https://i.pravatar.cc/150?img=4',
    difficulty: 'intermediate',
    category: 'medicine',
    topics: ['Clinical Trials', 'Biostatistics', 'Research Design', 'Medical Ethics'],
    duration: 300,
    lessonsCount: 10,
    enrolledCount: 1089,
    rating: 4.6,
    reviewsCount: 294,
    isPublished: true,
    isFeatured: true,
    lessons: [],
    quizzes: [],
    prerequisites: ['Statistics', 'Medical Terminology'],
    learningOutcomes: [
      'Design randomized controlled trials',
      'Apply appropriate statistical methods',
      'Ensure ethical compliance in trials',
      'Interpret and report trial results'
    ],
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-10-12')
  },
  {
    id: 'course_5',
    title: 'Sustainable Energy Systems',
    description: 'Explore renewable energy technologies, their implementation, and their role in combating climate change.',
    instructor: 'Prof. Emma Thompson',
    instructorAvatar: 'https://i.pravatar.cc/150?img=5',
    difficulty: 'beginner',
    category: 'engineering',
    topics: ['Renewable Energy', 'Solar Power', 'Wind Energy', 'Sustainability'],
    duration: 180,
    lessonsCount: 6,
    enrolledCount: 2134,
    rating: 4.5,
    reviewsCount: 478,
    isPublished: true,
    isFeatured: false,
    lessons: [],
    quizzes: [],
    prerequisites: [],
    learningOutcomes: [
      'Understand different renewable energy sources',
      'Calculate energy efficiency metrics',
      'Evaluate environmental impact',
      'Design basic solar panel systems'
    ],
    createdAt: new Date('2024-05-18'),
    updatedAt: new Date('2024-10-08')
  }
];

export const MOCK_MENTORS: MentorProfile[] = [
  {
    id: 'mentor_1',
    userId: 'user_101',
    name: 'Dr. Jennifer Chen',
    title: 'Professor of Molecular Biology',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Specializing in CRISPR technology and genetic engineering with 15+ years of research experience.',
    expertise: ['CRISPR', 'Gene Editing', 'Molecular Biology', 'Genetics'],
    researchAreas: ['Gene Therapy', 'Synthetic Biology', 'Genome Engineering'],
    publications: 87,
    hIndex: 34,
    rating: 4.9,
    reviewsCount: 45,
    menteeCount: 23,
    availability: [
      { day: 'Monday', startTime: '14:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '12:00' },
      { day: 'Friday', startTime: '15:00', endTime: '18:00' }
    ],
    languages: ['English', 'Mandarin'],
    hourlyRate: 150,
    isFeatured: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jennifer-chen',
      twitter: 'https://twitter.com/drjchen',
      googleScholar: 'https://scholar.google.com/jchen',
      orcid: '0000-0001-2345-6789'
    },
    createdAt: new Date('2023-06-15')
  },
  {
    id: 'mentor_2',
    userId: 'user_102',
    name: 'Prof. Michael Zhang',
    title: 'AI Research Lead',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Leading researcher in machine learning applications for drug discovery and computational biology.',
    expertise: ['Machine Learning', 'Drug Discovery', 'Bioinformatics', 'Deep Learning'],
    researchAreas: ['AI in Healthcare', 'Computational Drug Design', 'Neural Networks'],
    publications: 124,
    hIndex: 42,
    rating: 5.0,
    reviewsCount: 67,
    menteeCount: 31,
    availability: [
      { day: 'Tuesday', startTime: '09:00', endTime: '12:00' },
      { day: 'Thursday', startTime: '13:00', endTime: '16:00' }
    ],
    languages: ['English', 'Mandarin', 'German'],
    hourlyRate: 200,
    isFeatured: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michael-zhang',
      googleScholar: 'https://scholar.google.com/mzhang',
      researchGate: 'https://researchgate.net/profile/Michael_Zhang'
    },
    createdAt: new Date('2023-08-22')
  },
  {
    id: 'mentor_3',
    userId: 'user_103',
    name: 'Dr. Sarah Williams',
    title: 'Quantum Computing Researcher',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Pioneering research in quantum algorithms and their applications in scientific computing.',
    expertise: ['Quantum Computing', 'Quantum Algorithms', 'Quantum Information', 'Physics'],
    researchAreas: ['Quantum Simulation', 'Quantum Machine Learning', 'Quantum Cryptography'],
    publications: 56,
    hIndex: 28,
    rating: 4.8,
    reviewsCount: 34,
    menteeCount: 18,
    availability: [
      { day: 'Monday', startTime: '10:00', endTime: '13:00' },
      { day: 'Wednesday', startTime: '14:00', endTime: '17:00' }
    ],
    languages: ['English', 'French'],
    hourlyRate: 175,
    isFeatured: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarah-williams-phd',
      twitter: 'https://twitter.com/quantumsarah',
      googleScholar: 'https://scholar.google.com/swilliams'
    },
    createdAt: new Date('2023-09-10')
  }
];

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: '#4caf50',
  intermediate: '#ff9800',
  advanced: '#f44336',
  expert: '#9c27b0'
};

export const CATEGORY_ICONS: Record<CourseCategory, string> = {
  biology: 'biotech',
  physics: 'science',
  chemistry: 'science',
  medicine: 'local_hospital',
  'computer-science': 'computer',
  engineering: 'engineering',
  'social-sciences': 'groups',
  mathematics: 'calculate',
  other: 'school'
};
