// src/dto/role-permission.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class RolePermissionDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  permission: string;
}