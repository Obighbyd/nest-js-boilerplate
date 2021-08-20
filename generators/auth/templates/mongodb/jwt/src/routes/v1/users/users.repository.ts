import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import SignUpDto from '@v1/auth/dto/sign-up.dto';
import { UserDocument, User } from '@v1/users/schemas/users.schema';

import UpdateUserDto from './dto/update-user.dto';

@Injectable()
export default class UsersRepository {
  constructor(@InjectModel(User.name) private usersModel: Model<UserDocument>) {}

  public async create(user: SignUpDto): Promise<User> {
    const newUser = await this.usersModel.create({
      ...user,
      verified: false,
    });

    return newUser.toJSON();
  }

  public async getUnverifiedUserByEmail(email: string) {
    const user = await this.usersModel.findOne({
      email,
      verified: false,
    }).exec();

    return user ? user.toJSON() : null;
  }

  public async getVerifiedUserByEmail(email: string) {
    const user = await this.usersModel.findOne({
      email,
      verified: true,
    }).exec();

    return user ? user.toJSON() : null;
  }

  public async getById(id: Types.ObjectId): Promise<User | null> {
    const user = await this.usersModel.findOne({
      _id: id,
    }, { password: 0 }).exec();

    return user ? user.toJSON() : null;
  }

  public async getVerifiedUserById(id: Types.ObjectId): Promise<User | null> {
    const user = await this.usersModel.findOne({
      _id: id,
      verified: true,
    }, { password: 0 }).exec();

    return user ? user.toJSON() : null;
  }

  public async getUnverifiedUserById(id: Types.ObjectId): Promise<User | null> {
    const user = await this.usersModel.findOne({
      _id: id,
      verified: false,
    }, { password: 0 }).exec();

    return user ? user.toJSON() : null;
  }

  public async updateById(id: Types.ObjectId, data: UpdateUserDto): Promise<User | null> {
    const updatedUser = await this.usersModel.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
    ).exec();

    return updatedUser ? updatedUser.toJSON() : null;
  }

  public getAll() {
    return this.usersModel.find().lean();
  }

  public getVerifiedUsers() {
    return this.usersModel.find({ verified: true }).lean();
  }
}
