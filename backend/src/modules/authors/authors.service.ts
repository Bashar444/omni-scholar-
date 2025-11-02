import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(private readonly authorsRepository: AuthorsRepository) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorsRepository.create(createAuthorDto);
  }

  async findAll(skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.authorsRepository.findAll(skip, take);
  }

  async findById(id: string): Promise<Author> {
    const author = await this.authorsRepository.findById(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async update(id: string, updateAuthorDto: Partial<CreateAuthorDto>): Promise<Author> {
    await this.findById(id);
    return this.authorsRepository.update(id, updateAuthorDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.authorsRepository.delete(id);
  }

  async getStats(): Promise<{ totalAuthors: number }> {
    const totalAuthors = await this.authorsRepository.count();
    return { totalAuthors };
  }

  async findByName(name: string, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.authorsRepository.findByName(name, skip, take);
  }

  async findByORCID(orcid: string): Promise<Author> {
    const author = await this.authorsRepository.findByORCID(orcid);
    if (!author) {
      throw new NotFoundException(`Author with ORCID ${orcid} not found`);
    }
    return author;
  }

  async findByEmail(email: string): Promise<Author> {
    const author = await this.authorsRepository.findByEmail(email);
    if (!author) {
      throw new NotFoundException(`Author with email ${email} not found`);
    }
    return author;
  }

  async findByInstitution(institution: string, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.authorsRepository.findByInstitution(institution, skip, take);
  }

  async findByResearchArea(area: string, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.authorsRepository.findByResearchArea(area, skip, take);
  }

  async findTopAuthors(limit: number = 10): Promise<Author[]> {
    return this.authorsRepository.findTopAuthors(limit);
  }

  async findByResearchGateId(researchGateId: string): Promise<Author> {
    const author = await this.authorsRepository.findByResearchGateId(researchGateId);
    if (!author) {
      throw new NotFoundException(`Author with ResearchGate ID ${researchGateId} not found`);
    }
    return author;
  }

  async findByGoogleScholarId(googleScholarId: string): Promise<Author> {
    const author = await this.authorsRepository.findByGoogleScholarId(googleScholarId);
    if (!author) {
      throw new NotFoundException(`Author with Google Scholar ID ${googleScholarId} not found`);
    }
    return author;
  }

  async findByScopusAuthorId(scopusAuthorId: string): Promise<Author> {
    const author = await this.authorsRepository.findByScopusAuthorId(scopusAuthorId);
    if (!author) {
      throw new NotFoundException(`Author with Scopus ID ${scopusAuthorId} not found`);
    }
    return author;
  }

  async findByPubmedAuthorId(pubmedAuthorId: string): Promise<Author> {
    const author = await this.authorsRepository.findByPubmedAuthorId(pubmedAuthorId);
    if (!author) {
      throw new NotFoundException(`Author with PubMed ID ${pubmedAuthorId} not found`);
    }
    return author;
  }

  async findByHIndexRange(minH: number, maxH: number, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.authorsRepository.findByHIndexRange(minH, maxH, skip, take);
  }

  async findHighlyPublished(minPublications: number = 50, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.authorsRepository.findHighlyPublished(minPublications, skip, take);
  }

  async bulkCreate(authors: CreateAuthorDto[]): Promise<Author[]> {
    return this.authorsRepository.bulkCreate(authors);
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<CreateAuthorDto> }>): Promise<Author[]> {
    return this.authorsRepository.bulkUpdate(updates);
  }

  async searchAuthors(query: string, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.authorsRepository.searchAuthors(query, skip, take);
  }

  async findDuplicates(name: string): Promise<Author[]> {
    return this.authorsRepository.findDuplicates(name);
  }

  async mergeDuplicates(primaryId: string, duplicateIds: string[]): Promise<Author> {
    return this.authorsRepository.mergeDuplicates(primaryId, duplicateIds);
  }
}
