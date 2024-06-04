import { Injectable, UnauthorizedException, BadRequestException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { authPayloadDto } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateRoleDto } from './dto/createRole.dto';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { jwtPayloadDto } from './dto/jwtPayload.dto';
import { RolePermissionDto } from './dto/permission.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/roles.entity';
import { Permission } from 'src/entities/permission.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
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

      const user = await this.userService.getUserByUsername(username);
      console.log('the user returned by username: ', user)

      if (user && await bcrypt.compare(password, user.password)) {
        return this.generateJwtToken(user);
      }
      return null;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateGoogleUser(profile: { id: string, email: string, name: { givenName: string, familyName: string } }) {
    try {
      const { id, email, name } = profile;
      let user = await this.userService.findByEmail(email);
              console.log('user found successfully...', user);

      if (!user) {
        return null;
      }
      else {
        console.log('user found successfully...');
                return this.generateJwtToken(user);
      }
    }
    catch (error) {

            console.error('Error validating Google user:', error.message);
            throw new UnauthorizedException('User not found(Email is not registered)');
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

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name } = createRoleDto;
    const role = new Role();
    role.name = name;

    return await this.roleRepository.save(role);
  }

  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { name } = createPermissionDto;
    const permission = new Permission();
    permission.name = name;

    return await this.permissionRepository.save(permission);
  }


  //function to associate permissions with roles...
  async associateRoleWithPermission(rolePermissionDto: RolePermissionDto): Promise<string> {
    const { role, permission } = rolePermissionDto;

    // Check if role exists
    const roleEntity = await this.roleRepository.findOne({ where: { name: role }, relations: ['permissions'] });
    if (!roleEntity) {
      throw new NotFoundException(`Role ${role} not found`);
    }

    // Check if permission exists
    const permissionEntity = await this.permissionRepository.findOne({ where: { name: permission } });
    if (!permissionEntity) {
      throw new NotFoundException(`Permission ${permission} not found`);
    }

    // Check if the permission is already associated with the role
    const isPermissionAlreadyAssociated = roleEntity.permissions.some(
      (perm) => perm.name === permission
    );
    if (isPermissionAlreadyAssociated) {
      throw new BadRequestException(`Permission ${permission} is already associated with Role ${role}`);
    }

    // Associate permission with role
    if (!roleEntity.permissions) {
      roleEntity.permissions = [];
    }
    roleEntity.permissions.push(permissionEntity);
    await this.roleRepository.save(roleEntity);

    return `Permission ${permission} has been associated with Role ${role}`;
  }
}
