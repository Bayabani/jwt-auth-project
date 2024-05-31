import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]), // Provide UserRepository
    // Import other required modules
  ],
  providers: [UserService, UserRepository],
  exports: [UserService], // Export UserService if needed
})
export class UserModule { }