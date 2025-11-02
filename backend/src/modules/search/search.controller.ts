import { Controller, Get, Query, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SearchService, SearchResult, SearchFilters } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('author') author?: string,
    @Query('journal') journal?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('keywords') keywords?: string,
    @Query('openAccess') openAccess?: string,
    @Query('preprint') preprint?: string,
    @Query('minCitations') minCitations?: string,
    @Query('maxCitations') maxCitations?: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<SearchResult[]> {
    const filters: SearchFilters = {
      author,
      journal,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      keywords: keywords ? keywords.split(',').map((k) => k.trim()) : undefined,
      openAccess: openAccess === 'true' ? true : openAccess === 'false' ? false : undefined,
      preprint: preprint === 'true' ? true : preprint === 'false' ? false : undefined,
      minCitations: minCitations ? parseInt(minCitations) : undefined,
      maxCitations: maxCitations ? parseInt(maxCitations) : undefined,
    };

    return this.searchService.search(query, filters, skip, take);
  }

  @Get('autocomplete')
  async autocomplete(
    @Query('prefix') prefix: string,
    @Query('limit') limit: number = 10,
  ): Promise<string[]> {
    return this.searchService.autocomplete(prefix, limit);
  }

  @Get('suggestions')
  async getSuggestions(
    @Query('q') query: string,
    @Query('limit') limit: number = 5,
  ): Promise<string[]> {
    return this.searchService.getSuggestions(query, limit);
  }

  @Get('trending')
  async getTrendingSearches(
    @Query('limit') limit: number = 10,
  ): Promise<Array<{ query: string; count: number }>> {
    return this.searchService.getTrendingSearches(limit);
  }

  @Post('advanced')
  @HttpCode(HttpStatus.OK)
  async advancedSearch(
    @Body()
    body: {
      query: string;
      filters?: SearchFilters;
      skip?: number;
      take?: number;
    },
  ): Promise<SearchResult[]> {
    return this.searchService.advancedSearch(body.query, body.filters || {}, body.skip || 0, body.take || 20);
  }

  @Post('boolean')
  @HttpCode(HttpStatus.OK)
  async booleanSearch(
    @Body()
    body: {
      query: string;
      skip?: number;
      take?: number;
    },
  ): Promise<SearchResult[]> {
    return this.searchService.booleanSearch(body.query, body.skip || 0, body.take || 20);
  }
}
