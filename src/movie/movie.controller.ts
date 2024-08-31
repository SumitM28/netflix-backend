/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getAllMovies() {
    return this.movieService.getAllMovies();
  }
}