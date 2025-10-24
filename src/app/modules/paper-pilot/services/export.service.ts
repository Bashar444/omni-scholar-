import { Injectable } from '@angular/core';
import { UploadedPaper, ExtractedMetadata, COMPARISON_FIELDS, ExportFormat } from '../models/paper-comparison.model';

@Injectable({ providedIn: 'root' })
export class ExportService {

  exportComparison(papers: UploadedPaper[], format: ExportFormat, comparisonName: string): void {
    switch (format) {
      case 'csv':
        this.exportCsv(papers, comparisonName);
        break;
      case 'markdown':
        this.exportMarkdown(papers, comparisonName);
        break;
      case 'json':
        this.exportJson(papers, comparisonName);
        break;
      case 'excel':
        // Excel export would require a library like xlsx
        this.exportCsv(papers, comparisonName); // Fallback to CSV
        break;
    }
  }

  private exportCsv(papers: UploadedPaper[], name: string): void {
    const headers = ['Field', ...papers.map(p => p.fileName)];
    const rows: string[][] = [headers];

    COMPARISON_FIELDS.filter(f => f.exportable).forEach(field => {
      const row = [field.label];
      papers.forEach(paper => {
        const value = this.getFieldValue(paper.extractedData, field.key);
        row.push(this.escapeCsv(value));
      });
      rows.push(row);
    });

    const csv = rows.map(r => r.join(',')).join('\n');
    this.downloadFile(csv, `${name}-comparison-${this.getDateString()}.csv`, 'text/csv');
  }

  private exportMarkdown(papers: UploadedPaper[], name: string): void {
    let md = `# ${name}\n\n`;
    md += `*Comparison generated on ${new Date().toLocaleDateString()}*\n\n`;
    md += `## Papers Included\n\n`;
    
    papers.forEach((paper, i) => {
      md += `${i + 1}. **${paper.extractedData?.title || paper.fileName}**\n`;
      md += `   - Authors: ${paper.extractedData?.authors?.join(', ') || 'Unknown'}\n`;
      md += `   - Year: ${paper.extractedData?.year || 'Unknown'}\n\n`;
    });

    md += `---\n\n## Detailed Comparison\n\n`;

    COMPARISON_FIELDS.filter(f => f.exportable && f.key !== 'title' && f.key !== 'authors' && f.key !== 'year')
      .forEach(field => {
        md += `### ${field.label}\n\n`;
        papers.forEach((paper, i) => {
          const value = this.getFieldValue(paper.extractedData, field.key);
          md += `**Paper ${i + 1}:** ${value}\n\n`;
        });
        md += `---\n\n`;
      });

    this.downloadFile(md, `${name}-comparison-${this.getDateString()}.md`, 'text/markdown');
  }

  private exportJson(papers: UploadedPaper[], name: string): void {
    const exportData = {
      comparisonName: name,
      exportDate: new Date().toISOString(),
      papers: papers.map(p => ({
        fileName: p.fileName,
        uploadedAt: p.uploadedAt,
        metadata: p.extractedData
      }))
    };

    const json = JSON.stringify(exportData, null, 2);
    this.downloadFile(json, `${name}-comparison-${this.getDateString()}.json`, 'application/json');
  }

  exportLiteratureReviewOutline(papers: UploadedPaper[]): void {
    let outline = `# Literature Review Outline\n\n`;
    outline += `*Based on ${papers.length} papers*\n\n`;
    outline += `## 1. Introduction\n\n`;
    outline += `- Brief overview of the research area\n`;
    outline += `- Importance of the topic\n`;
    outline += `- Scope of this review\n\n`;

    outline += `## 2. Methodology\n\n`;
    outline += `- Search strategy\n`;
    outline += `- Inclusion/exclusion criteria\n`;
    outline += `- Papers reviewed: ${papers.length}\n\n`;

    // Group by year for chronological structure
    const papersByYear = this.groupPapersByYear(papers);
    outline += `## 3. Chronological Analysis\n\n`;
    
    Object.entries(papersByYear).sort(([a], [b]) => parseInt(a) - parseInt(b)).forEach(([year, yearPapers]) => {
      outline += `### ${year}\n\n`;
      yearPapers.forEach(paper => {
        const title = paper.extractedData?.title || paper.fileName;
        const authors = paper.extractedData?.authors?.join(', ') || 'Unknown';
        outline += `- **${title}** (${authors})\n`;
        if (paper.extractedData?.keyFindings) {
          paper.extractedData.keyFindings.forEach(finding => {
            outline += `  - ${finding}\n`;
          });
        }
        outline += `\n`;
      });
    });

    // Extract common themes
    outline += `## 4. Thematic Analysis\n\n`;
    outline += `### Common Methodologies\n\n`;
    papers.forEach(paper => {
      if (paper.extractedData?.methodology) {
        outline += `- ${paper.extractedData.title}: ${paper.extractedData.methodology.substring(0, 100)}...\n`;
      }
    });

    outline += `\n### Key Findings Summary\n\n`;
    papers.forEach(paper => {
      if (paper.extractedData?.keyFindings) {
        outline += `**${paper.extractedData.title}:**\n`;
        paper.extractedData.keyFindings.forEach(finding => {
          outline += `- ${finding}\n`;
        });
        outline += `\n`;
      }
    });

    outline += `## 5. Research Gaps\n\n`;
    outline += `- [Identify gaps based on the reviewed papers]\n`;
    outline += `- [Areas requiring further investigation]\n`;
    outline += `- [Contradictions or inconsistencies found]\n\n`;

    outline += `## 6. Conclusions\n\n`;
    outline += `- Summary of main findings\n`;
    outline += `- Implications for future research\n`;
    outline += `- Recommendations\n\n`;

    outline += `## 7. References\n\n`;
    papers.forEach((paper, i) => {
      const authors = paper.extractedData?.authors?.join(', ') || 'Unknown';
      const year = paper.extractedData?.year || 'n.d.';
      const title = paper.extractedData?.title || paper.fileName;
      outline += `${i + 1}. ${authors} (${year}). ${title}.\n`;
    });

    this.downloadFile(outline, `literature-review-outline-${this.getDateString()}.md`, 'text/markdown');
  }

  private getFieldValue(metadata: ExtractedMetadata | undefined, key: keyof ExtractedMetadata): string {
    if (!metadata) return 'N/A';
    const value = metadata[key];
    
    if (value === undefined || value === null) return 'N/A';
    if (Array.isArray(value)) return value.join('; ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private escapeCsv(val: string): string {
    if (!val) return '';
    const str = val.toString();
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private groupPapersByYear(papers: UploadedPaper[]): Record<string, UploadedPaper[]> {
    const grouped: Record<string, UploadedPaper[]> = {};
    papers.forEach(paper => {
      const year = paper.extractedData?.year?.toString() || 'Unknown';
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(paper);
    });
    return grouped;
  }

  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private getDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
