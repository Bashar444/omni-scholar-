import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { AuthorsRepository } from './authors.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  providers: [AuthorsService, AuthorsRepository],
  controllers: [AuthorsController],
  exports: [AuthorsService, AuthorsRepository],
})
export class AuthorsModule {}
