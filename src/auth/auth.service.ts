import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { authPayloadDto } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Assuming this is the path to your UserService
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { jwtPayloadDto } from './dto/jwtPayload.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) { }

private async generateJwtToken(user: User): Promise<string> {
  // Ensure that the user roles are loaded, even if lazy loading is used
  if (!user.roles) {
    const userWithRoles = await this.userService.getUserById(user.id, { relations: ['roles'] });
    user.roles = userWithRoles.roles;
  }

  const payload: jwtPayloadDto = { 
    id: user.id, 
    username: user.username, 
    roles: user.roles.map(role => role.name) 
  };

  return this.jwtService.sign(payload);
}
 async validateUser(authPayloadDto: authPayloadDto): Promise<string | null> {
  try {
    const { username, password } = authPayloadDto;
    console.log('inside validateUser...')
    
    const user = await this.userService.getUserByUsername(username );
    console.log('the user returned by username: ', user)

    if (user && await bcrypt.compare(password, user.password)) {
      return this.generateJwtToken(user);
    }
    return null;
  } catch (error) {
    throw new UnauthorizedException('Invalid credentials');
  }
}
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createuser = await this.userService.createUser(createUserDto);

      return createuser
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation error code
        throw new ConflictException('Username already exists');

      } else if (error.message.includes('"duplicate key value violates unique constraint')) {
        // Add more specific error handling if needed
        throw new InternalServerErrorException('Username must be unique.');
      } else {
        throw new InternalServerErrorException(error.message);
      }

    }
  }
}
