import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paper } from './entities/paper.entity';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';
import { PapersRepository } from './papers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Paper])],
  controllers: [PapersController],
  providers: [PapersService, PapersRepository],
  exports: [PapersService],
})
export class PapersModule {}
