import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { Paper } from './entities/paper.entity';
export declare class PapersController {
    private readonly papersService;
    constructor(papersService: PapersService);
    create(createPaperDto: CreatePaperDto): Promise<Paper>;
    findAll(): Promise<Paper[]>;
    getStats(): Promise<{
        totalPapers: number;
    }>;
    findById(id: string): Promise<Paper>;
    update(id: string, updatePaperDto: Partial<CreatePaperDto>): Promise<Paper>;
    delete(id: string): Promise<void>;
}
