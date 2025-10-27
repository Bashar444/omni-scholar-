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

  async findAll(): Promise<Paper[]> {
    return this.papersRepository.findAll();
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
}
