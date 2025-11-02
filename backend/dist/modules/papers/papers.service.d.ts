import { PapersRepository } from './papers.repository';
import { CreatePaperDto } from './dto/create-paper.dto';
import { Paper } from './entities/paper.entity';
export declare class PapersService {
    private readonly papersRepository;
    constructor(papersRepository: PapersRepository);
    create(createPaperDto: CreatePaperDto): Promise<Paper>;
    findAll(): Promise<Paper[]>;
    findById(id: string): Promise<Paper>;
    update(id: string, updatePaperDto: Partial<CreatePaperDto>): Promise<Paper>;
    delete(id: string): Promise<void>;
    getStats(): Promise<{
        totalPapers: number;
    }>;
}
