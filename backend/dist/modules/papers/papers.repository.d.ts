import { Repository } from 'typeorm';
import { Paper } from './entities/paper.entity';
import { CreatePaperDto } from './dto/create-paper.dto';
export declare class PapersRepository {
    private repository;
    constructor(repository: Repository<Paper>);
    create(data: CreatePaperDto): Promise<Paper>;
    findAll(): Promise<Paper[]>;
    findById(id: string): Promise<Paper | null>;
    update(id: string, data: Partial<CreatePaperDto>): Promise<Paper>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
