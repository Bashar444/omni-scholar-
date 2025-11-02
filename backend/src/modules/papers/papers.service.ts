import { Injectable, NotFoundException } from '@nestjs/common';
import { PapersRepository } from './papers.repository';
import { CreatePaperDto } from './dto/create-paper.dto';
import { Paper } from './entities/paper.entity';

@Injectable()
export class PapersService {
  constructor(private readonly papersRepository: PapersRepository) {}

  async create(createPaperDto: CreatePaperDto): Promise<Paper> {
    return this.papersRepository.create(createPaperDto);
  }

  async findAll(skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.papersRepository.findAll(skip, take);
  }

  async findById(id: string): Promise<Paper> {
    const paper = await this.papersRepository.findById(id);
    if (!paper) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
    return paper;
  }

  async update(id: string, updatePaperDto: Partial<CreatePaperDto>): Promise<Paper> {
    await this.findById(id); // Verify exists
    return this.papersRepository.update(id, updatePaperDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verify exists
    await this.papersRepository.delete(id);
  }

  async getStats(): Promise<{ totalPapers: number }> {
    const totalPapers = await this.papersRepository.count();
    return { totalPapers };
  }

  async findByDOI(doi: string): Promise<Paper> {
    const paper = await this.papersRepository.findByDOI(doi);
    if (!paper) {
      throw new NotFoundException(`Paper with DOI ${doi} not found`);
    }
    return paper;
  }

  async findByAuthor(authorName: string, skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.papersRepository.findByAuthor(authorName, skip, take);
  }

  async findByJournal(journal: string, skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.papersRepository.findByJournal(journal, skip, take);
  }

  async findByDateRange(startDate: Date, endDate: Date, skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.papersRepository.findByDateRange(startDate, endDate, skip, take);
  }

  async findByKeywords(keywords: string[], skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.papersRepository.findByKeywords(keywords, skip, take);
  }

  async searchFullText(query: string, skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.papersRepository.searchFullText(query, skip, take);
  }

  async findOpenAccess(skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.papersRepository.findOpenAccess(skip, take);
  }

  async findPreprints(skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.papersRepository.findPreprints(skip, take);
  }

  async findByArxivId(arxivId: string): Promise<Paper> {
    const paper = await this.papersRepository.findByArxivId(arxivId);
    if (!paper) {
      throw new NotFoundException(`Paper with arXiv ID ${arxivId} not found`);
    }
    return paper;
  }

  async findByPubmedId(pubmedId: string): Promise<Paper> {
    const paper = await this.papersRepository.findByPubmedId(pubmedId);
    if (!paper) {
      throw new NotFoundException(`Paper with PubMed ID ${pubmedId} not found`);
    }
    return paper;
  }

  async findByScopusId(scopusId: string): Promise<Paper> {
    const paper = await this.papersRepository.findByScopusId(scopusId);
    if (!paper) {
      throw new NotFoundException(`Paper with Scopus ID ${scopusId} not found`);
    }
    return paper;
  }

  async bulkCreate(papers: CreatePaperDto[]): Promise<Paper[]> {
    return this.papersRepository.bulkCreate(papers);
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<CreatePaperDto> }>): Promise<Paper[]> {
    return this.papersRepository.bulkUpdate(updates);
  }

  async findTopCited(limit: number = 10): Promise<Paper[]> {
    return this.papersRepository.findTopCited(limit);
  }

  async findRecent(days: number = 30, limit: number = 20): Promise<Paper[]> {
    return this.papersRepository.findRecent(days, limit);
  }
}
