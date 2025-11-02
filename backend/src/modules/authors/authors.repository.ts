import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorsRepository {
  constructor(
    @InjectRepository(Author)
    private repository: Repository<Author>,
  ) {}

  async create(data: CreateAuthorDto): Promise<Author> {
    const author = this.repository.create(data);
    return this.repository.save(author);
  }

  async findAll(skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  async findById(id: string): Promise<Author | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<CreateAuthorDto>): Promise<Author> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findByName(name: string, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.repository.find({
      where: { name: ILike(`%${name}%`) },
      order: { totalCitations: 'DESC' },
      skip,
      take,
    });
  }

  async findByORCID(orcid: string): Promise<Author | null> {
    return this.repository.findOne({ where: { orcid } });
  }

  async findByEmail(email: string): Promise<Author | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByInstitution(institution: string, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.repository.find({
      where: { institution: ILike(`%${institution}%`) },
      order: { totalCitations: 'DESC' },
      skip,
      take,
    });
  }

  async findByResearchArea(area: string, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.repository
      .createQueryBuilder('author')
      .where('author.researchInterests LIKE :area', { area: `%${area}%` })
      .orWhere('author.expertise LIKE :area', { area: `%${area}%` })
      .orderBy('author.totalCitations', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findTopAuthors(limit: number = 10): Promise<Author[]> {
    return this.repository.find({
      order: { totalCitations: 'DESC' },
      take: limit,
    });
  }

  async findByResearchGateId(researchGateId: string): Promise<Author | null> {
    return this.repository.findOne({ where: { researchGateId } });
  }

  async findByGoogleScholarId(googleScholarId: string): Promise<Author | null> {
    return this.repository.findOne({ where: { googleScholarId } });
  }

  async findByScopusAuthorId(scopusAuthorId: string): Promise<Author | null> {
    return this.repository.findOne({ where: { scopusAuthorId } });
  }

  async findByPubmedAuthorId(pubmedAuthorId: string): Promise<Author | null> {
    return this.repository.findOne({ where: { pubmedAuthorId } });
  }

  async findByHIndexRange(minH: number, maxH: number, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.repository
      .createQueryBuilder('author')
      .where('author.hIndex >= :minH', { minH })
      .andWhere('author.hIndex <= :maxH', { maxH })
      .orderBy('author.hIndex', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findHighlyPublished(minPublications: number = 50, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.repository.find({
      where: { totalPublications: minPublications },
      order: { totalPublications: 'DESC' },
      skip,
      take,
    });
  }

  async bulkCreate(authors: CreateAuthorDto[]): Promise<Author[]> {
    const entities = this.repository.create(authors);
    return this.repository.save(entities);
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<CreateAuthorDto> }>): Promise<Author[]> {
    const results: Author[] = [];
    for (const { id, data } of updates) {
      await this.repository.update(id, data);
      const updated = await this.findById(id);
      if (updated) results.push(updated);
    }
    return results;
  }

  async findDuplicates(name: string): Promise<Author[]> {
    return this.repository
      .createQueryBuilder('author')
      .where('LOWER(author.name) = LOWER(:name)', { name })
      .getMany();
  }

  async mergeDuplicates(primaryId: string, duplicateIds: string[]): Promise<Author> {
    // This would typically involve updating all papers/citations to point to primary author
    // For now, we'll just delete the duplicates
    for (const duplicateId of duplicateIds) {
      await this.delete(duplicateId);
    }
    return this.findById(primaryId);
  }

  async searchAuthors(query: string, skip: number = 0, take: number = 20): Promise<Author[]> {
    return this.repository
      .createQueryBuilder('author')
      .where('author.name ILIKE :query', { query: `%${query}%` })
      .orWhere('author.institution ILIKE :query', { query: `%${query}%` })
      .orWhere('author.researchInterests LIKE :query', { query: `%${query}%` })
      .orderBy('author.totalCitations', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }
}
