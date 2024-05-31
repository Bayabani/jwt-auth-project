import { IsString, IsNotEmpty, MinLength, ArrayMinSize, ArrayMaxSize, ArrayUnique, IsArray, IsEnum } from 'class-validator';
import { UserRole } from 'src/enum/roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsArray({ message: 'Roles must be an array' })
  @ArrayMinSize(1, { message: 'At least one role must be provided' })
  @ArrayMaxSize(4, { message: 'Maximum four roles are allowed' })
  @ArrayUnique({ message: 'Duplicate roles are not allowed' })
  @IsEnum(UserRole, { each: true, message: 'Each role must be one of EMPLOYER, ADMIN, EMPLOYEE, GUEST' })
  roles: UserRole[];
}