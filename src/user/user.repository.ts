import { EntityRepository, Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/entities/roles.entity';
@Injectable()
@EntityRepository(User)

export class UserRepository extends Repository<User> {
  // Custom methods can be added here if needed in the future

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createuser(createUserDto: CreateUserDto): Promise<User> {
    console.log('inside createUser in user repository...', createUserDto);
    const { username, password, roles } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      // Fetch the corresponding Role entities from the database
      const roleEntities = await this.dataSource.getRepository(Role).find({
        where: roles.map(role => ({ name: role })),
      });

      if (roleEntities.length !== roles.length) {
        throw new InternalServerErrorException('Some roles do not exist');
      }

      const newUser = this.create({ username, password: hashedPassword, roles: roleEntities });
      const savedUser = await this.save(newUser);

      return savedUser;
    } catch (error) {
      console.error('Error creating user in repository:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }




  async getuserbyUsername(username: string): Promise<User | undefined> {
    try {
      console.log('inside getUserByUsername function. the username is: ', username);
      return await this.findOne({
        where: { username },
        relations: ['roles'], // Ensure roles are fetched
      });
    } catch (error) {
      console.error('Error finding user by username:', error.message);
      throw new Error('Error finding user by username: ' + error.message);
    }
  }

  async getuserbyId(id: number): Promise<User | undefined> {
    try {
      console.log('inside getUserById function');
      return await this.findOne({
        where: { id },
        relations: ['roles'], // Ensure roles are fetched
      });
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw new Error('Error finding user by ID: ' + error.message);
    }
  }
}
