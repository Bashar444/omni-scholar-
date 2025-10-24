export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  toolUsed?: AITool;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'analysis' | 'writing' | 'research';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AISettings {
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'local';
  temperature: number; // 0-1
  maxTokens: number;
  streamResponse: boolean;
}

export const AI_TOOLS: AITool[] = [
  {
    id: 'summarize',
    name: 'Summarize Paper',
    description: 'Generate concise summaries of research papers',
    icon: 'summarize',
    category: 'analysis'
  },
  {
    id: 'questions',
    name: 'Research Questions',
    description: 'Generate relevant research questions',
    icon: 'quiz',
    category: 'research'
  },
  {
    id: 'hypothesis',
    name: 'Hypothesis Builder',
    description: 'Formulate testable hypotheses',
    icon: 'science',
    category: 'research'
  },
  {
    id: 'methodology',
    name: 'Methodology Advisor',
    description: 'Suggest research methodologies',
    icon: 'assignment',
    category: 'research'
  },
  {
    id: 'writing',
    name: 'Writing Assistant',
    description: 'Help with academic writing and citations',
    icon: 'edit',
    category: 'writing'
  },
  {
    id: 'citations',
    name: 'Citation Formatter',
    description: 'Format citations in various styles',
    icon: 'format_quote',
    category: 'writing'
  }
];
