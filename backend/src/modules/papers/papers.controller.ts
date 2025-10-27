import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { Paper } from './entities/paper.entity';

@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPaperDto: CreatePaperDto): Promise<Paper> {
    return this.papersService.create(createPaperDto);
  }

  @Get()
  async findAll(): Promise<Paper[]> {
    return this.papersService.findAll();
  }

  @Get('stats')
  async getStats(): Promise<{ totalPapers: number }> {
    return this.papersService.getStats();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Paper> {
    return this.papersService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaperDto: Partial<CreatePaperDto>,
  ): Promise<Paper> {
    return this.papersService.update(id, updatePaperDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.papersService.delete(id);
  }
}
