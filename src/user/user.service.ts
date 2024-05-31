// src/user/user.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
  ) { }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log('In user service.', createUserDto );
      const createduser = await this.userRepository.createuser(createUserDto);
      console.log('created user in user service:', createduser);
      // Call the createUser method defined in the UserRepository
      return createduser;
    } catch (error) {
      console.log('ERROR IS HERE::', error.message);
      error.message = ('usename is already taken')
      throw error
    }
  }

  async getUserByUsername(username: string, options?: any): Promise<User> {
    return this.userRepository.getuserbyUsername( username );
  }

  async getUserById(id: number, options?: any): Promise<User> {
    return this.userRepository.getuserbyId({ where: { id }, ...options });
  }

}