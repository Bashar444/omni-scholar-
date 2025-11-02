import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, Like } from 'typeorm';
import { Paper } from './entities/paper.entity';
import { CreatePaperDto } from './dto/create-paper.dto';

@Injectable()
export class PapersRepository {
  constructor(
    @InjectRepository(Paper)
    private repository: Repository<Paper>,
  ) {}

  async create(data: CreatePaperDto): Promise<Paper> {
    const paper = this.repository.create(data);
    return this.repository.save(paper);
  }

  async findAll(skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  async findById(id: string): Promise<Paper | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<CreatePaperDto>): Promise<Paper> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findByDOI(doi: string): Promise<Paper | null> {
    return this.repository.findOne({ where: { doi } });
  }

  async findByAuthor(authorName: string, skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.repository
      .createQueryBuilder('paper')
      .where('paper.authors LIKE :author', { author: `%${authorName}%` })
      .orderBy('paper.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findByJournal(journal: string, skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.repository.find({
      where: { journal },
      order: { publishedDate: 'DESC' },
      skip,
      take,
    });
  }

  async findByDateRange(startDate: Date, endDate: Date, skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.repository.find({
      where: { publishedDate: Between(startDate, endDate) },
      order: { publishedDate: 'DESC' },
      skip,
      take,
    });
  }

  async findByKeywords(keywords: string[], skip: number = 0, take: number = 20): Promise<Paper[]> {
    const query = this.repository.createQueryBuilder('paper');
    
    keywords.forEach((keyword, index) => {
      if (index === 0) {
        query.where('paper.keywords LIKE :keyword', { keyword: `%${keyword}%` });
      } else {
        query.orWhere('paper.keywords LIKE :keyword${index}', { [`keyword${index}`]: `%${keyword}%` });
      }
    });

    return query
      .orderBy('paper.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async searchFullText(query: string, skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.repository
      .createQueryBuilder('paper')
      .where('paper.title ILIKE :query', { query: `%${query}%` })
      .orWhere('paper.abstract ILIKE :query', { query: `%${query}%` })
      .orWhere('paper.keywords LIKE :query', { query: `%${query}%` })
      .orderBy('paper.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findOpenAccess(skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.repository.find({
      where: { openAccess: true },
      order: { publishedDate: 'DESC' },
      skip,
      take,
    });
  }

  async findPreprints(skip: number = 0, take: number = 20): Promise<Paper[]> {
    return this.repository.find({
      where: { preprint: true },
      order: { publishedDate: 'DESC' },
      skip,
      take,
    });
  }

  async findByArxivId(arxivId: string): Promise<Paper | null> {
    return this.repository.findOne({ where: { arxivId } });
  }

  async findByPubmedId(pubmedId: string): Promise<Paper | null> {
    return this.repository.findOne({ where: { pubmedId } });
  }

  async findByScopusId(scopusId: string): Promise<Paper | null> {
    return this.repository.findOne({ where: { scopusId } });
  }

  async bulkCreate(papers: CreatePaperDto[]): Promise<Paper[]> {
    const entities = this.repository.create(papers);
    return this.repository.save(entities);
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<CreatePaperDto> }>): Promise<Paper[]> {
    const results: Paper[] = [];
    for (const { id, data } of updates) {
      await this.repository.update(id, data);
      const updated = await this.findById(id);
      if (updated) results.push(updated);
    }
    return results;
  }

  async findTopCited(limit: number = 10): Promise<Paper[]> {
    return this.repository.find({
      order: { citationCount: 'DESC' },
      take: limit,
    });
  }

  async findRecent(days: number = 30, limit: number = 20): Promise<Paper[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.repository.find({
      where: { publishedDate: Between(startDate, new Date()) },
      order: { publishedDate: 'DESC' },
      take: limit,
    });
  }
}
