import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Citation } from './entities/citation.entity';
import { CitationsService } from './citations.service';
import { CitationsController } from './citations.controller';
import { CitationsRepository } from './citations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Citation])],
  providers: [CitationsService, CitationsRepository],
  controllers: [CitationsController],
  exports: [CitationsService, CitationsRepository],
})
export class CitationsModule {}
