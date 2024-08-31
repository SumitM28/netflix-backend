/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}

  async getAllMovies(): Promise<any> {
    try {
      const options = {
        method: 'GET',
        url: this.configService.get<string>('MOVIE_API_URL'), // Get URL from .env
        headers: {
          'x-rapidapi-key': this.configService.get<string>('RAPIDAPI_KEY'), // Get API key from .env
          'x-rapidapi-host': this.configService.get<string>('RAPIDAPI_HOST'), // Get API host from .env
        },
      };
      const response = await firstValueFrom(this.httpService.request(options));
      console.log(response.data)
      return response.data; // Adjust based on the actual API response structure
    } catch (error) {
      throw new HttpException('Failed to fetch movies', HttpStatus.BAD_REQUEST);
    }
  }
}

