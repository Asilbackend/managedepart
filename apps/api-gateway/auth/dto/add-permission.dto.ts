// src/auth/dto/add-permission.dto.ts
import { IsString } from 'class-validator';

export class AddPermissionToRoleDto {
  @IsString()
  role: string;
  @IsString()
  permission: string;
}
