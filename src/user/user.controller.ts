/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema'; // Import UserDocument

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }) {
    const user = await this.userService.createUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user: UserDocument = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorite')
  async addFavorite(@Req() req, @Body() body: { movieId: string }) {
    return this.userService.addFavorite(req.user.userId, body.movieId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavorites(@Req() req) {
    return this.userService.getFavorites(req.user.userId);
  }
}
