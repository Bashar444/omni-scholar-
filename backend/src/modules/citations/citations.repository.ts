import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Citation } from './entities/citation.entity';
import { CreateCitationDto } from './dto/create-citation.dto';

export interface CitationGraph {
  nodes: Array<{ id: string; label: string }>;
  edges: Array<{ source: string; target: string; weight: number }>;
}

@Injectable()
export class CitationsRepository {
  constructor(
    @InjectRepository(Citation)
    private repository: Repository<Citation>,
  ) {}

  async create(data: CreateCitationDto): Promise<Citation> {
    const citation = this.repository.create(data);
    return this.repository.save(citation);
  }

  async findAll(skip: number = 0, take: number = 20): Promise<Citation[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  async findById(id: string): Promise<Citation | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<CreateCitationDto>): Promise<Citation> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findCitationsBetween(sourcePaperId: string, targetPaperId: string): Promise<Citation[]> {
    return this.repository.find({
      where: { sourcePaperId, targetPaperId },
    });
  }

  async findCitationsFor(paperId: string, skip: number = 0, take: number = 20): Promise<Citation[]> {
    return this.repository.find({
      where: { targetPaperId: paperId },
      order: { count: 'DESC' },
      skip,
      take,
    });
  }

  async findCitationsFrom(paperId: string, skip: number = 0, take: number = 20): Promise<Citation[]> {
    return this.repository.find({
      where: { sourcePaperId: paperId },
      order: { count: 'DESC' },
      skip,
      take,
    });
  }

  async getCitationCount(paperId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('citation')
      .where('citation.targetPaperId = :paperId', { paperId })
      .select('SUM(citation.count)', 'total')
      .getRawOne();
    return result?.total || 0;
  }

  async getCitationNetwork(paperId: string, depth: number = 2): Promise<CitationGraph> {
    const nodes = new Map<string, { id: string; label: string }>();
    const edges: Array<{ source: string; target: string; weight: number }> = [];

    // Add root node
    nodes.set(paperId, { id: paperId, label: paperId });

    // Recursively fetch citations
    const visited = new Set<string>();
    const queue: Array<{ id: string; depth: number }> = [{ id: paperId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth: currentDepth } = queue.shift();

      if (visited.has(id) || currentDepth >= depth) continue;
      visited.add(id);

      // Get citations from this paper
      const citations = await this.findCitationsFrom(id, 0, 50);

      for (const citation of citations) {
        if (!nodes.has(citation.targetPaperId)) {
          nodes.set(citation.targetPaperId, {
            id: citation.targetPaperId,
            label: citation.targetPaperId,
          });
          queue.push({ id: citation.targetPaperId, depth: currentDepth + 1 });
        }

        edges.push({
          source: citation.sourcePaperId,
          target: citation.targetPaperId,
          weight: citation.count,
        });
      }
    }

    return {
      nodes: Array.from(nodes.values()),
      edges,
    };
  }

  async findCitationPath(sourcePaperId: string, targetPaperId: string): Promise<Citation[]> {
    // BFS to find shortest path
    const visited = new Set<string>();
    const queue: Array<{ paperId: string; path: Citation[] }> = [
      { paperId: sourcePaperId, path: [] },
    ];

    while (queue.length > 0) {
      const { paperId, path } = queue.shift();

      if (visited.has(paperId)) continue;
      visited.add(paperId);

      if (paperId === targetPaperId) {
        return path;
      }

      const citations = await this.findCitationsFrom(paperId, 0, 50);

      for (const citation of citations) {
        if (!visited.has(citation.targetPaperId)) {
          queue.push({
            paperId: citation.targetPaperId,
            path: [...path, citation],
          });
        }
      }
    }

    return [];
  }

  async bulkCreate(citations: CreateCitationDto[]): Promise<Citation[]> {
    const entities = this.repository.create(citations);
    return this.repository.save(entities);
  }

  async findTopCited(limit: number = 10): Promise<Citation[]> {
    return this.repository.find({
      order: { count: 'DESC' },
      take: limit,
    });
  }

  async getCitationsByType(citationType: 'direct' | 'indirect' | 'related', skip: number = 0, take: number = 20): Promise<Citation[]> {
    return this.repository.find({
      where: { citationType },
      order: { count: 'DESC' },
      skip,
      take,
    });
  }
}
