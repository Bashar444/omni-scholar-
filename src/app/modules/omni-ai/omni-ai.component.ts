import { Component, signal, computed, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { AiService } from './services/ai.service';
import { DataExportImportService } from '../../shared/services/data-export-import.service';
import { ChatMessage, ChatSession, AITool, AISettings } from './models/chat.model';

@Component({
  selector: 'app-omni-ai',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // ✅ PrimeNG UI Modules
    CardModule,
    ButtonModule,
    InputTextModule,
    TabViewModule,
    ChipModule,
    DropdownModule,
    DividerModule,
    TooltipModule,
    SliderModule,
    ToggleButtonModule,
    ProgressBarModule,
    ToastModule,
    ListboxModule,
    MenuModule,
    InputSwitchModule,
    InputNumberModule,
    InputTextareaModule
  ],
  providers: [MessageService],
  templateUrl: './omni-ai.component.html',
  styleUrls: ['./omni-ai.component.scss']
})
export class OmniAiComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer?: ElementRef;

  private aiService = inject(AiService);
  private dataExportImportService = inject(DataExportImportService);
  private messageService = inject(MessageService);

  constructor() {
    this.loadInitialData();
  }

  // State
  currentSession = signal<ChatSession | null>(null);
  messages = computed(() => this.currentSession()?.messages || []);
  allSessions = signal<ChatSession[]>([]);
  availableTools = signal<AITool[]>([]);
  selectedTool = signal<AITool | null>(null);
  isTyping = signal<boolean>(false);
  isLoadingSessions = signal<boolean>(false);
  settings = signal<AISettings | null>(null);

  // Search
  sessionSearchQuery = '';

  // Computed filtered sessions
  filteredSessions = computed(() => {
    const query = this.sessionSearchQuery.toLowerCase().trim();
    if (!query) return this.allSessions();
    return this.allSessions().filter(session =>
      session.title.toLowerCase().includes(query) ||
      session.messages.some(m => m.content.toLowerCase().includes(query))
    );
  });

  userInput = '';
  activeTabIndex = 0;
  private shouldScrollToBottom = false;

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private loadInitialData() {
    this.isLoadingSessions.set(true);
    this.availableTools.set(this.aiService.getAvailableTools());
    this.settings.set(this.aiService.getSettings());

    setTimeout(() => {
      this.allSessions.set(this.aiService.getAllSessions());
      this.isLoadingSessions.set(false);
    }, 600);

    const current = this.aiService.getCurrentSession();
    if (current) {
      this.currentSession.set(current);
    } else if (this.allSessions().length > 0) {
      this.switchSession(this.allSessions()[0].id);
    } else {
      this.startNewConversation();
    }
  }

  startNewConversation() {
    const session = this.aiService.createSession();
    this.currentSession.set(session);
    this.allSessions.set(this.aiService.getAllSessions());
  }

  switchSession(sessionId: string) {
    const session = this.aiService.switchSession(sessionId);
    if (session) {
      this.currentSession.set(session);
      this.shouldScrollToBottom = true;
    }
  }

  deleteSession(sessionId: string, event: Event) {
    event.stopPropagation();
    this.aiService.deleteSession(sessionId);
    this.allSessions.set(this.aiService.getAllSessions());

    if (this.currentSession()?.id === sessionId) {
      if (this.allSessions().length > 0) {
        this.switchSession(this.allSessions()[0].id);
      } else {
        this.startNewConversation();
      }
    }
    this.messageService.add({ severity: 'info', summary: 'Session Deleted', detail: 'The session was removed successfully.' });
  }

  selectTool(tool: AITool) {
    const current = this.selectedTool();
    this.selectedTool.set(current?.id === tool.id ? null : tool);
  }

  onEnterPress(event: KeyboardEvent) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const tool = this.selectedTool();
    const message = this.userInput;
    this.userInput = '';
    this.isTyping.set(true);
    this.shouldScrollToBottom = true;

    this.aiService.sendMessage(message, tool || undefined).subscribe({
      next: () => {
        this.isTyping.set(false);
        this.currentSession.set(this.aiService.getCurrentSession());
        this.allSessions.set(this.aiService.getAllSessions());
        this.shouldScrollToBottom = true;
      },
      error: () => {
        this.isTyping.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send message.' });
      }
    });
  }

  exportData(): void {
    try {
      const data = {
        sessions: this.allSessions(),
        settings: this.settings(),
        exportDate: new Date().toISOString(),
        totalSessions: this.allSessions().length
      };
      this.dataExportImportService.exportModuleData('omni-ai', data);
      this.messageService.add({ severity: 'success', summary: 'Exported', detail: 'Conversations exported successfully.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Export Failed', detail: 'Failed to export data.' });
    }
  }

  async importData(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    try {
      const result = await this.dataExportImportService.importData(file, { merge: false });
      if (result.success) {
        this.loadInitialData();
        this.messageService.add({ severity: 'success', summary: 'Imported', detail: result.message });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Import Warning', detail: result.message });
      }
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data.' });
    } finally {
      input.value = '';
    }
  }

  private scrollToBottom() {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

    formatDate(date: Date): string {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  onSessionSearchChange(): void {
    // Session search is handled by the computed filteredSessions property
  }

  clearSessionSearch(): void {
    this.sessionSearchQuery = '';
  }

  updateSettings(settings: AISettings): void {
    this.settings.set(settings);
    this.aiService.updateSettings(settings);
    this.messageService.add({
      severity: 'success',
      summary: 'Settings Updated',
      detail: 'AI settings have been updated successfully.'
    });
  }

  exportCurrentChat(): void {
    if (!this.currentSession()) return;
    
    try {
      const data = JSON.stringify({
        sessions: [this.currentSession()!],
        settings: this.settings(),
        tools: this.availableTools()
      });
      this.dataExportImportService.exportAllData(data);
      this.messageService.add({
        severity: 'success',
        summary: 'Chat Exported',
        detail: 'Current chat has been exported successfully.'
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Export Failed',
        detail: 'Failed to export current chat.'
      });
    }
  }
}