import { Injectable, NotFoundException } from '@nestjs/common';
import { CitationsRepository, CitationGraph } from './citations.repository';
import { CreateCitationDto } from './dto/create-citation.dto';
import { Citation } from './entities/citation.entity';

@Injectable()
export class CitationsService {
  constructor(private readonly citationsRepository: CitationsRepository) {}

  async create(createCitationDto: CreateCitationDto): Promise<Citation> {
    return this.citationsRepository.create(createCitationDto);
  }

  async findAll(skip: number = 0, take: number = 20): Promise<Citation[]> {
    return this.citationsRepository.findAll(skip, take);
  }

  async findById(id: string): Promise<Citation> {
    const citation = await this.citationsRepository.findById(id);
    if (!citation) {
      throw new NotFoundException(`Citation with ID ${id} not found`);
    }
    return citation;
  }

  async update(id: string, updateCitationDto: Partial<CreateCitationDto>): Promise<Citation> {
    await this.findById(id);
    return this.citationsRepository.update(id, updateCitationDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.citationsRepository.delete(id);
  }

  async getStats(): Promise<{ totalCitations: number }> {
    const totalCitations = await this.citationsRepository.count();
    return { totalCitations };
  }

  async findCitationsBetween(sourcePaperId: string, targetPaperId: string): Promise<Citation[]> {
    return this.citationsRepository.findCitationsBetween(sourcePaperId, targetPaperId);
  }

  async findCitationsFor(paperId: string, skip: number = 0, take: number = 20): Promise<Citation[]> {
    return this.citationsRepository.findCitationsFor(paperId, skip, take);
  }

  async findCitationsFrom(paperId: string, skip: number = 0, take: number = 20): Promise<Citation[]> {
    return this.citationsRepository.findCitationsFrom(paperId, skip, take);
  }

  async getCitationCount(paperId: string): Promise<number> {
    return this.citationsRepository.getCitationCount(paperId);
  }

  async getCitationNetwork(paperId: string, depth: number = 2): Promise<CitationGraph> {
    return this.citationsRepository.getCitationNetwork(paperId, depth);
  }

  async findCitationPath(sourcePaperId: string, targetPaperId: string): Promise<Citation[]> {
    return this.citationsRepository.findCitationPath(sourcePaperId, targetPaperId);
  }

  async bulkCreate(citations: CreateCitationDto[]): Promise<Citation[]> {
    return this.citationsRepository.bulkCreate(citations);
  }

  async findTopCited(limit: number = 10): Promise<Citation[]> {
    return this.citationsRepository.findTopCited(limit);
  }

  async getCitationsByType(
    citationType: 'direct' | 'indirect' | 'related',
    skip: number = 0,
    take: number = 20,
  ): Promise<Citation[]> {
    return this.citationsRepository.getCitationsByType(citationType, skip, take);
  }
}
