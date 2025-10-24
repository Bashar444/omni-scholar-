import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { ChatMessage, ChatSession, AITool, AISettings, AI_TOOLS } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly STORAGE_KEY = 'omni_ai_sessions';
  private readonly SETTINGS_KEY = 'omni_ai_settings';
  private currentSessionId: string | null = null;

  constructor() {}

  // ===== Chat Session Management =====

  getCurrentSession(): ChatSession | null {
    if (!this.currentSessionId) return null;
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === this.currentSessionId) || null;
  }

  createSession(title: string = 'New Conversation'): ChatSession {
    const session: ChatSession = {
      id: this.generateId(),
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const sessions = this.getAllSessions();
    sessions.push(session);
    this.saveSessions(sessions);
    this.currentSessionId = session.id;
    
    return session;
  }

  getAllSessions(): ChatSession[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    const sessions = JSON.parse(data);
    // Convert date strings back to Date objects
    return sessions.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    }));
  }

  deleteSession(sessionId: string): void {
    let sessions = this.getAllSessions();
    sessions = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(sessions);
    
    if (this.currentSessionId === sessionId) {
      this.currentSessionId = null;
    }
  }

  switchSession(sessionId: string): ChatSession | null {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      this.currentSessionId = sessionId;
      return session;
    }
    return null;
  }

  // ===== Message Handling =====

  sendMessage(content: string, tool?: AITool): Observable<ChatMessage> {
    let session = this.getCurrentSession();
    if (!session) {
      session = this.createSession();
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: this.generateId(),
      sender: 'user',
      content,
      timestamp: new Date(),
      toolUsed: tool
    };
    
    session.messages.push(userMessage);
    session.updatedAt = new Date();
    this.updateSession(session);

    // Simulate AI response
    return this.generateAIResponse(content, tool).pipe(
      map(aiContent => {
        const aiMessage: ChatMessage = {
          id: this.generateId(),
          sender: 'ai',
          content: aiContent,
          timestamp: new Date(),
          toolUsed: tool
        };
        
        session!.messages.push(aiMessage);
        session!.updatedAt = new Date();
        this.updateSession(session!);
        
        return aiMessage;
      })
    );
  }

  private generateAIResponse(userMessage: string, tool?: AITool): Observable<string> {
    // Simulate API delay
    const responseDelay = 1500 + Math.random() * 1000; // 1.5-2.5 seconds
    
    let response = '';
    
    if (tool) {
      response = this.getToolBasedResponse(userMessage, tool);
    } else {
      response = this.getGeneralResponse(userMessage);
    }
    
    return of(response).pipe(delay(responseDelay));
  }

  private getToolBasedResponse(message: string, tool: AITool): string {
    const responses: Record<string, string> = {
      'summarize': `📄 **Paper Summary**\n\nBased on your request, here's a concise summary:\n\n**Key Points:**\n- Main research objective: ${message.slice(0, 50)}...\n- Methodology employed: Mixed-methods approach\n- Primary findings: Significant correlation observed\n- Implications: Contributes to theoretical framework\n\n**Conclusion:** The study provides valuable insights that advance our understanding of the topic.\n\n💡 *Would you like me to elaborate on any specific section?*`,
      
      'questions': `❓ **Research Questions Generated**\n\nBased on your topic, here are potential research questions:\n\n1. What are the primary factors influencing [topic]?\n2. How do different methodologies compare in addressing [issue]?\n3. What gaps exist in current literature regarding [subject]?\n4. To what extent does [variable A] affect [variable B]?\n5. What are the implications for future research?\n\n🔍 *Would you like me to refine any of these questions?*`,
      
      'hypothesis': `🔬 **Hypothesis Framework**\n\nBased on your research area:\n\n**Null Hypothesis (H₀):**\nThere is no significant relationship between [Variable A] and [Variable B].\n\n**Alternative Hypothesis (H₁):**\nThere exists a statistically significant positive relationship between [Variable A] and [Variable B].\n\n**Testable Predictions:**\n- If [condition], then [outcome]\n- Measurable indicators include: [metrics]\n\n📊 *Shall I help design an experiment to test this?*`,
      
      'methodology': `📋 **Methodology Recommendations**\n\nFor your research topic, consider:\n\n**Recommended Approach:** Mixed-Methods Design\n\n**Quantitative Component:**\n- Survey design (n > 200)\n- Statistical analysis (regression, ANOVA)\n- Data collection via validated instruments\n\n**Qualitative Component:**\n- Semi-structured interviews (n = 15-20)\n- Thematic analysis\n- Member checking for validity\n\n**Timeline:** 12-18 months\n\n⚙️ *Need help with ethical approval or sampling?*`,
      
      'writing': `✍️ **Writing Assistance**\n\nHere's help with your academic writing:\n\n**Structure Suggestions:**\n- Opening paragraph: State problem clearly\n- Body: Use topic sentences + evidence + analysis\n- Transitions: Moreover, Furthermore, However, Consequently\n- Conclusion: Restate thesis + implications\n\n**Academic Tone Tips:**\n- Use passive voice judiciously\n- Avoid colloquialisms\n- Support claims with citations\n- Maintain objectivity\n\n📝 *Share a paragraph for detailed feedback!*`,
      
      'citations': `📚 **Citation Formatting**\n\nHere are your citations in multiple styles:\n\n**APA 7th Edition:**\nSmith, J. A., & Doe, M. B. (2024). Research methods in practice. *Journal of Studies*, 45(3), 123-145. https://doi.org/10.1234/example\n\n**MLA 9th Edition:**\nSmith, John A., and Mary B. Doe. "Research Methods in Practice." *Journal of Studies*, vol. 45, no. 3, 2024, pp. 123-145.\n\n**Chicago 17th Edition:**\nSmith, John A., and Mary B. Doe. "Research Methods in Practice." *Journal of Studies* 45, no. 3 (2024): 123-145.\n\n🔖 *Need more citations formatted?*`
    };
    
    return responses[tool.id] || this.getGeneralResponse(message);
  }

  private getGeneralResponse(message: string): string {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('hello') || messageLower.includes('hi')) {
      return "👋 Hello! I'm OmniAI, your research assistant. I can help with:\n\n" +
             "📄 Summarizing papers\n" +
             "❓ Generating research questions\n" +
             "🔬 Building hypotheses\n" +
             "📋 Suggesting methodologies\n" +
             "✍️ Academic writing\n" +
             "📚 Citation formatting\n\n" +
             "What would you like assistance with today?";
    }
    
    if (messageLower.includes('help')) {
      return "🤝 **How I Can Help:**\n\n" +
             "Use the AI Tools in the sidebar to access specialized features. Or just chat with me naturally!\n\n" +
             "**Example questions:**\n" +
             "- \"Can you summarize this paper about [topic]?\"\n" +
             "- \"What research questions should I explore?\"\n" +
             "- \"Help me write an introduction\"\n" +
             "- \"Format this citation in APA style\"\n\n" +
             "💬 *I'm here to support your research journey!*";
    }
    
    if (messageLower.includes('paper') || messageLower.includes('article')) {
      return "📰 **Paper Analysis**\n\n" +
             "I can help you understand research papers! Please:\n\n" +
             "1. Use the 'Summarize Paper' tool for comprehensive summaries\n" +
             "2. Share the paper title or DOI\n" +
             "3. Ask specific questions about methodology, findings, or implications\n\n" +
             "Alternatively, upload papers to the **PaperPilot** module for side-by-side comparison.\n\n" +
             "📚 *What aspect of the paper interests you most?*";
    }
    
    if (messageLower.includes('cite') || messageLower.includes('reference')) {
      return "📖 **Citation Assistance**\n\n" +
             "I can format citations in:\n" +
             "- APA (7th edition)\n" +
             "- MLA (9th edition)\n" +
             "- Chicago (17th edition)\n" +
             "- Harvard\n" +
             "- IEEE\n\n" +
             "Please provide:\n" +
             "- Author name(s)\n" +
             "- Publication year\n" +
             "- Title\n" +
             "- Journal/Book info\n\n" +
             "Or use the **Citation Formatter** tool for quick formatting!\n\n" +
             "🔖 *Which style do you need?*";
    }
    
    // Default response
    return `🤖 **I understand you're asking about:** "${message.slice(0, 100)}${message.length > 100 ? '...' : ''}"\n\n` +
           `While I'm a demo version, here's what I can suggest:\n\n` +
           `1. **Use AI Tools:** Check the sidebar for specialized features\n` +
           `2. **Be Specific:** The more context you provide, the better I can help\n` +
           `3. **Explore Modules:** PaperPilot for literature review, Library for paper discovery\n\n` +
           `💡 *Try asking: "Help me with research methodology" or "Summarize a paper about [topic]"*`;
  }

  // ===== Tools =====

  getAvailableTools(): AITool[] {
    return AI_TOOLS;
  }

  // ===== Settings =====

  getSettings(): AISettings {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    if (!data) {
      return this.getDefaultSettings();
    }
    return JSON.parse(data);
  }

  updateSettings(settings: AISettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  private getDefaultSettings(): AISettings {
    return {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      streamResponse: true
    };
  }

  // ===== Export =====

  exportChat(sessionId: string): void {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    let markdown = `# ${session.title}\n\n`;
    markdown += `**Created:** ${session.createdAt.toLocaleString()}\n`;
    markdown += `**Last Updated:** ${session.updatedAt.toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    session.messages.forEach(msg => {
      const sender = msg.sender === 'user' ? '👤 **You**' : '🤖 **OmniAI**';
      const time = msg.timestamp.toLocaleTimeString();
      const tool = msg.toolUsed ? ` *(using ${msg.toolUsed.name})*` : '';
      
      markdown += `### ${sender}${tool} - ${time}\n\n`;
      markdown += `${msg.content}\n\n`;
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title.replace(/\s+/g, '_')}_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ===== Utilities =====

  private updateSession(session: ChatSession): void {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index !== -1) {
      sessions[index] = session;
      this.saveSessions(sessions);
    }
  }

  private saveSessions(sessions: ChatSession[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
