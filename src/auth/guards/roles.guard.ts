import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private jwtService: JwtService,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(Permission) private permissionRepository: Repository<Permission>

    ) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!roles && !permissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new ForbiddenException('Token not found');
        }

        try {
            const user = this.jwtService.verify(token);
            console.log('the user in roles guard: ', user)
            const userRoles = user.roles;

            if (!userRoles) {
                throw new ForbiddenException('User roles not found in token');
            }

            // Fetch permissions for the user's roles
            const roleEntities = await this.roleRepository.find({
                where: userRoles.map(roleName => ({ name: roleName })),
                relations: ['permissions'],
            });
            const userPermissions = roleEntities.flatMap(role => role.permissions.map(permission => permission.name));
            // Check if user has required roles
            if (roles && !roles.some(role => userRoles.includes(role))) {
                throw new ForbiddenException('User does not have required roles');
            }
            console.log('user holds sufficient roles...', roles)

            // Check if user has required permissions
            if (permissions && !permissions.every(permission => userPermissions.includes(permission))) {
                throw new ForbiddenException('User does not have required permissions');
            }
            console.log('user holds sufficient permissions...', permissions)
            request.user = user;  // Set the user on the request
            return true;
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }
}