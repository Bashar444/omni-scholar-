import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(): Promise<Paper[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
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
}
