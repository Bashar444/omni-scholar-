import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
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

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreate(@Body() papers: CreatePaperDto[]): Promise<Paper[]> {
    return this.papersService.bulkCreate(papers);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Paper[]> {
    return this.papersService.findAll(skip, take);
  }

  @Get('stats')
  async getStats(): Promise<{ totalPapers: number }> {
    return this.papersService.getStats();
  }

  @Get('trending/top-cited')
  async getTopCited(@Query('limit') limit: number = 10): Promise<Paper[]> {
    return this.papersService.findTopCited(limit);
  }

  @Get('trending/recent')
  async getRecent(
    @Query('days') days: number = 30,
    @Query('limit') limit: number = 20,
  ): Promise<Paper[]> {
    return this.papersService.findRecent(days, limit);
  }

  @Get('search/full-text')
  async searchFullText(
    @Query('q') query: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Paper[]> {
    return this.papersService.searchFullText(query, skip, take);
  }

  @Get('search/by-author')
  async findByAuthor(
    @Query('author') author: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Paper[]> {
    return this.papersService.findByAuthor(author, skip, take);
  }

  @Get('search/by-journal')
  async findByJournal(
    @Query('journal') journal: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Paper[]> {
    return this.papersService.findByJournal(journal, skip, take);
  }

  @Get('search/by-date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Paper[]> {
    return this.papersService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
      skip,
      take,
    );
  }

  @Get('search/by-keywords')
  async findByKeywords(
    @Query('keywords') keywords: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Paper[]> {
    const keywordArray = keywords.split(',').map((k) => k.trim());
    return this.papersService.findByKeywords(keywordArray, skip, take);
  }

  @Get('filter/open-access')
  async findOpenAccess(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Paper[]> {
    return this.papersService.findOpenAccess(skip, take);
  }

  @Get('filter/preprints')
  async findPreprints(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Paper[]> {
    return this.papersService.findPreprints(skip, take);
  }

  @Get('doi/:doi')
  async findByDOI(@Param('doi') doi: string): Promise<Paper> {
    return this.papersService.findByDOI(doi);
  }

  @Get('arxiv/:arxivId')
  async findByArxivId(@Param('arxivId') arxivId: string): Promise<Paper> {
    return this.papersService.findByArxivId(arxivId);
  }

  @Get('pubmed/:pubmedId')
  async findByPubmedId(@Param('pubmedId') pubmedId: string): Promise<Paper> {
    return this.papersService.findByPubmedId(pubmedId);
  }

  @Get('scopus/:scopusId')
  async findByScopusId(@Param('scopusId') scopusId: string): Promise<Paper> {
    return this.papersService.findByScopusId(scopusId);
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
