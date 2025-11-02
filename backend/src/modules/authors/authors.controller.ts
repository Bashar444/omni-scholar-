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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './entities/author.entity';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorsService.create(createAuthorDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreate(@Body() authors: CreateAuthorDto[]): Promise<Author[]> {
    return this.authorsService.bulkCreate(authors);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Author[]> {
    return this.authorsService.findAll(skip, take);
  }

  @Get('stats')
  async getStats(): Promise<{ totalAuthors: number }> {
    return this.authorsService.getStats();
  }

  @Get('trending/top')
  async getTopAuthors(@Query('limit') limit: number = 10): Promise<Author[]> {
    return this.authorsService.findTopAuthors(limit);
  }

  @Get('search')
  async searchAuthors(
    @Query('q') query: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Author[]> {
    return this.authorsService.searchAuthors(query, skip, take);
  }

  @Get('search/by-name')
  async findByName(
    @Query('name') name: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Author[]> {
    return this.authorsService.findByName(name, skip, take);
  }

  @Get('search/by-institution')
  async findByInstitution(
    @Query('institution') institution: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Author[]> {
    return this.authorsService.findByInstitution(institution, skip, take);
  }

  @Get('search/by-research-area')
  async findByResearchArea(
    @Query('area') area: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Author[]> {
    return this.authorsService.findByResearchArea(area, skip, take);
  }

  @Get('search/by-h-index')
  async findByHIndexRange(
    @Query('minH') minH: number,
    @Query('maxH') maxH: number,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Author[]> {
    return this.authorsService.findByHIndexRange(minH, maxH, skip, take);
  }

  @Get('search/highly-published')
  async findHighlyPublished(
    @Query('minPublications') minPublications: number = 50,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Author[]> {
    return this.authorsService.findHighlyPublished(minPublications, skip, take);
  }

  @Get('duplicates/:name')
  async findDuplicates(@Param('name') name: string): Promise<Author[]> {
    return this.authorsService.findDuplicates(name);
  }

  @Post('merge-duplicates')
  async mergeDuplicates(
    @Body() body: { primaryId: string; duplicateIds: string[] },
  ): Promise<Author> {
    return this.authorsService.mergeDuplicates(body.primaryId, body.duplicateIds);
  }

  @Get('orcid/:orcid')
  async findByORCID(@Param('orcid') orcid: string): Promise<Author> {
    return this.authorsService.findByORCID(orcid);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<Author> {
    return this.authorsService.findByEmail(email);
  }

  @Get('researchgate/:researchGateId')
  async findByResearchGateId(@Param('researchGateId') researchGateId: string): Promise<Author> {
    return this.authorsService.findByResearchGateId(researchGateId);
  }

  @Get('google-scholar/:googleScholarId')
  async findByGoogleScholarId(@Param('googleScholarId') googleScholarId: string): Promise<Author> {
    return this.authorsService.findByGoogleScholarId(googleScholarId);
  }

  @Get('scopus/:scopusAuthorId')
  async findByScopusAuthorId(@Param('scopusAuthorId') scopusAuthorId: string): Promise<Author> {
    return this.authorsService.findByScopusAuthorId(scopusAuthorId);
  }

  @Get('pubmed/:pubmedAuthorId')
  async findByPubmedAuthorId(@Param('pubmedAuthorId') pubmedAuthorId: string): Promise<Author> {
    return this.authorsService.findByPubmedAuthorId(pubmedAuthorId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Author> {
    return this.authorsService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: Partial<CreateAuthorDto>,
  ): Promise<Author> {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.authorsService.delete(id);
  }
}
