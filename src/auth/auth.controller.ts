import { Controller, Get, Post, Req, Res, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request } from "express";
import { RolesGuard } from './guards/roles.guard';
import { Roles } from 'src/Decorators/roles.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Permissions } from 'src/Decorators/permissions.decorator';
import { RolePermissionDto } from './dto/permission.dto';


@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {

    constructor(private authService: AuthService) {

    }
    //endpoint to inject permissions-roles association...
    @Post('associate-permission')
    async associateRoleWithPermission(@Body() rolePermissionDto: RolePermissionDto): Promise<string> {
        return this.authService.associateRoleWithPermission(rolePermissionDto);
    }

    //login router for auth...
    @Post('login')
    @UseGuards(LocalGuard)
    login(@Req() req: Request) {
        return req.user;
    }

    @Post('signup')
    //@Roles('EMPLOYER', 'ADMIN', 'EMPLOYEE', 'GUEST')
    async signUp(@Body() createUserDto: CreateUserDto, @Res() res) {
        try {
            console.log('inside signup...', createUserDto)
            const { password: _password, ...createduser } = await this.authService.signUp(createUserDto);

            console.log('the created user inside auth controller: ', createduser)
            return res.status(HttpStatus.CREATED).json({ message: 'User created successfully', user: createduser });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }
    @Permissions('view_resource') // Example of using the permissions decorator(it is a random one, but the functionality can be tested with it)
    @Get('statusforadmin')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard)
    statusforadmin(@Req() req: Request) {
        console.log('inside auth/status');
        console.log('the request user is:', req.user)
        return req.user;
    }
    @Get('statusforemployer')
    @Roles('EMPLOYER')
    @UseGuards(JwtAuthGuard)
    statusforemployer(@Req() req: Request) {
        console.log('inside auth/status');
        console.log('the request user is:', req.user)
        return req.user;
    }
    @Get('statusforemployee')
    @Roles('EMPLOYEE')
    @UseGuards(JwtAuthGuard)
    statusforemployee(@Req() req: Request) {
        console.log('inside auth/status');
        console.log('the request user is:', req.user)
        return req.user;
    }
    @Permissions('edit_resource')  // Example of using the permissions decorator(it is a random one, but the functionality can be tested with it)
    @Get('statusforguest')
    @Roles('GUEST')
    @UseGuards(JwtAuthGuard)
    statusforguest(@Req() req: Request) {
        console.log('inside auth/status');
        console.log('the request user is:', req.user)
        return req.user;
    }

}
