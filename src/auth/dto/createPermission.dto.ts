// src/auth/dto/create-permission.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}