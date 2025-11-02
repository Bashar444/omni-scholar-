import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

interface AnalysisResult {
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  citations: number;
  relevanceScore: number;
  publicationDate: string;
}

@Component({
  selector: 'app-research-paper-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule
  ],
  template: `
    <div class="analysis-container">
      <!-- Header -->
      <div class="header">
        <h1>📄 Research Paper Analysis Tool</h1>
        <p class="subtitle">Analyze and extract insights from research papers</p>
      </div>

      <!-- Input Section -->
      <mat-card class="input-section">
        <mat-card-header>
          <mat-card-title>Upload or Paste Paper</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field class="full-width">
            <mat-label>Paper Title or URL</mat-label>
            <input matInput [(ngModel)]="paperInput" placeholder="Enter paper title, DOI, or URL">
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="analyzePaper()" class="analyze-btn">
            <mat-icon>search</mat-icon>
            Analyze Paper
          </button>
        </mat-card-content>
      </mat-card>

      <!-- Results Section -->
      <div *ngIf="analysisResult" class="results-section">
        <mat-card class="result-card">
          <mat-card-header>
            <mat-card-title>{{ analysisResult.title }}</mat-card-title>
            <mat-card-subtitle>
              <span class="authors">By: {{ analysisResult.authors.join(', ') }}</span>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <!-- Metadata -->
            <div class="metadata">
              <div class="meta-item">
                <span class="label">Publication Date:</span>
                <span class="value">{{ analysisResult.publicationDate }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Citations:</span>
                <span class="value">{{ analysisResult.citations }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Relevance Score:</span>
                <span class="value">{{ (analysisResult.relevanceScore * 100).toFixed(1) }}%</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <mat-progress-bar 
              mode="determinate" 
              [value]="analysisResult.relevanceScore * 100"
              class="relevance-bar">
            </mat-progress-bar>

            <!-- Abstract -->
            <div class="section">
              <h3>Abstract</h3>
              <p>{{ analysisResult.abstract }}</p>
            </div>

            <!-- Keywords -->
            <div class="section">
              <h3>Keywords</h3>
              <div class="keywords">
                <span *ngFor="let keyword of analysisResult.keywords" class="keyword-tag">
                  {{ keyword }}
                </span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!analysisResult" class="empty-state">
        <mat-card>
          <mat-card-content>
            <div class="empty-content">
              <mat-icon class="empty-icon">description</mat-icon>
              <h2>No Paper Analyzed Yet</h2>
              <p>Enter a paper title, DOI, or URL above to get started with analysis</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .analysis-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2.5rem;
      color: #333;
      margin: 0;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #666;
      margin-top: 0.5rem;
    }

    .input-section {
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .full-width {
      width: 100%;
    }

    .analyze-btn {
      margin-top: 1rem;
      width: 100%;
    }

    .results-section {
      margin-top: 2rem;
    }

    .result-card {
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .metadata {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-weight: 600;
      color: #666;
    }

    .value {
      color: #2196F3;
      font-weight: 500;
    }

    .relevance-bar {
      margin: 1rem 0;
      height: 8px;
      border-radius: 4px;
    }

    .section {
      margin: 1.5rem 0;
    }

    .section h3 {
      color: #333;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      border-bottom: 2px solid #2196F3;
      padding-bottom: 0.5rem;
    }

    .section p {
      color: #555;
      line-height: 1.6;
    }

    .keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .keyword-tag {
      display: inline-block;
      background: #E3F2FD;
      color: #1976D2;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .empty-state {
      margin-top: 3rem;
    }

    .empty-content {
      text-align: center;
      padding: 3rem;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .empty-content h2 {
      color: #666;
      margin: 1rem 0;
    }

    .empty-content p {
      color: #999;
    }
  `]
})
export class ResearchPaperAnalysisComponent implements OnInit {
  paperInput: string = '';
  analysisResult: AnalysisResult | null = null;

  ngOnInit(): void {
    console.log('Research Paper Analysis Tool initialized');
  }

  analyzePaper(): void {
    if (!this.paperInput.trim()) {
      alert('Please enter a paper title, DOI, or URL');
      return;
    }

    // Mock analysis result for demonstration
    this.analysisResult = {
      title: 'Attention Is All You Need',
      authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.'],
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
      keywords: ['Transformer', 'Attention', 'Neural Networks', 'NLP', 'Sequence Modeling'],
      citations: 85000,
      relevanceScore: 0.95,
      publicationDate: 'June 2017'
    };
  }
}
