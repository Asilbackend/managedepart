// src/auth/dto/add-permission.dto.ts
import { IsEnum } from 'class-validator';
import { Permission, Role } from '../entities/users.entity'; // yoki qayerda enum bo‘lsa

export class AddPermissionToRoleDto {
  @IsEnum(Role, {
    message: `role faqat quyidagi qiymatlardan biri bo‘lishi mumkin: ${Object.values(Role).join(', ')}`,
  })
  role: Role;

  @IsEnum(Permission, {
    message: `permission faqat quyidagi qiymatlardan biri bo‘lishi mumkin: ${Object.values(Permission).join(', ')}`,
  })
  permission: Permission;
}
