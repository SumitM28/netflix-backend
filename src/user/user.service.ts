/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(email: string, password: string): Promise<UserDocument> {  // Return UserDocument
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> { // Return UserDocument or null
    return this.userModel.findOne({ email }).exec();
  }

  async addFavorite(userId: string, movieId: string): Promise<UserDocument> { // Return UserDocument
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: movieId } },
      { new: true }
    );
  }

  async getFavorites(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).exec();
    return user.favorites;
  }
}
