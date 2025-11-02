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
import { CitationsService } from './citations.service';
import { CreateCitationDto } from './dto/create-citation.dto';
import { Citation } from './entities/citation.entity';
import { CitationGraph } from './citations.repository';

@Controller('citations')
export class CitationsController {
  constructor(private readonly citationsService: CitationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCitationDto: CreateCitationDto): Promise<Citation> {
    return this.citationsService.create(createCitationDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreate(@Body() citations: CreateCitationDto[]): Promise<Citation[]> {
    return this.citationsService.bulkCreate(citations);
  }

  @Get()
  async findAll(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Citation[]> {
    return this.citationsService.findAll(skip, take);
  }

  @Get('stats')
  async getStats(): Promise<{ totalCitations: number }> {
    return this.citationsService.getStats();
  }

  @Get('trending/top-cited')
  async getTopCited(@Query('limit') limit: number = 10): Promise<Citation[]> {
    return this.citationsService.findTopCited(limit);
  }

  @Get('by-type/:type')
  async getCitationsByType(
    @Param('type') type: 'direct' | 'indirect' | 'related',
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Citation[]> {
    return this.citationsService.getCitationsByType(type, skip, take);
  }

  @Get(':paperId/incoming')
  async getCitationsFor(
    @Param('paperId') paperId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Citation[]> {
    return this.citationsService.findCitationsFor(paperId, skip, take);
  }

  @Get(':paperId/outgoing')
  async getCitationsFrom(
    @Param('paperId') paperId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<Citation[]> {
    return this.citationsService.findCitationsFrom(paperId, skip, take);
  }

  @Get(':paperId/count')
  async getCitationCount(@Param('paperId') paperId: string): Promise<{ count: number }> {
    const count = await this.citationsService.getCitationCount(paperId);
    return { count };
  }

  @Get(':paperId/network')
  async getCitationNetwork(
    @Param('paperId') paperId: string,
    @Query('depth') depth: number = 2,
  ): Promise<CitationGraph> {
    return this.citationsService.getCitationNetwork(paperId, depth);
  }

  @Get(':paperId/path/:targetPaperId')
  async getCitationPath(
    @Param('paperId') sourcePaperId: string,
    @Param('targetPaperId') targetPaperId: string,
  ): Promise<Citation[]> {
    return this.citationsService.findCitationPath(sourcePaperId, targetPaperId);
  }

  @Get('between/:sourcePaperId/:targetPaperId')
  async getCitationsBetween(
    @Param('sourcePaperId') sourcePaperId: string,
    @Param('targetPaperId') targetPaperId: string,
  ): Promise<Citation[]> {
    return this.citationsService.findCitationsBetween(sourcePaperId, targetPaperId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Citation> {
    return this.citationsService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCitationDto: Partial<CreateCitationDto>,
  ): Promise<Citation> {
    return this.citationsService.update(id, updateCitationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.citationsService.delete(id);
  }
}
