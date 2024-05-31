import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'; // Import UserService
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from 'src/user/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PermissionRepository } from 'src/Repository/permissions.repository';
import { RoleRepository } from 'src/Repository/roles.repository';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/roles.entity';

@Module({
  imports: [PassportModule,
    JwtModule.register({
      secret: 'jwtsecret',
      signOptions: { expiresIn: '2d' }
    }), TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService, UserRepository,PermissionRepository, RoleRepository ]
})
export class AuthModule { }
