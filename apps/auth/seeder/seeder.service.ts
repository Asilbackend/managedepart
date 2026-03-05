// src/seeder/admin.seeder.service.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user-service/user.service';
import { CreateUserDto } from '../src/dto/create-user.dto';
import { Permission, Role } from '../src/entities/users.entity';
import { AddPermissionToRoleDto } from '../src/dto/add-permission.dto';
import { AuthService } from '../src/auth.service';

@Injectable()
export class AdminSeederService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const newVar = await this.userService.findByPinfl('12345678901234');
    if (newVar) {
      this.logger.log(`ADMIN already added to db`);
      this.logger.log(`ROLE AND PERMISSIONS auto added to db`);
      return;
    }
    await this.seedAdmin();
    await this.seedPermissions();
  }

  private async seedAdmin(): Promise<void> {
    const phone =
      this.configService.get<string>('ADMIN_PHONE') || '+998901234567';

    const password =
      this.configService.get<string>('ADMIN_PASSWORD') || 'admin12345';

    try {
      const dto: CreateUserDto = {
        firstName: 'Default',
        lastName: 'Admin',
        phone,
        password,
        pinfl: '12345678901234',
        role: Role.ADMIN,
      };

      await this.userService.create(dto);

      this.logger.warn(
        `━━━━━━━━━━ DEFAULT ADMIN YARATILDI ━━━━━━━━━━\n` +
          `Phone : ${phone}\n` +
          `Password : ${password}\n` +
          `Role : ADMIN\n` +
          `Muhit : ${this.configService.get('NODE_ENV')}\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      );
    } catch (error) {
      this.logger.log('Admin allaqachon mavjud yoki yaratishda xato.');
    }
  }

  private async seedPermissions() {
    const rolePermissions: Record<Role, Permission[]> = {
      [Role.ADMIN]: Object.values(Permission),

      [Role.UCHASTKAVOY]: [
        Permission.ORDER_CREATE,
        Permission.ORDER_READ,
        Permission.ORDER_UPDATE,
        Permission.SHOW_CITIZEN,
        Permission.SEARCH_CITIZEN,
      ],

      [Role.MAHALLA_YETTILIGI]: [
        Permission.ORDER_READ,
        Permission.SHOW_CITIZEN,
        Permission.SEARCH_CITIZEN,
        Permission.SOCIAL_CREATE,
        Permission.SOCIAL_READ,
        Permission.SOCIAL_UPDATE,
      ],
      [Role.CITIZEN]: [],
    };

    for (const role of Object.keys(rolePermissions) as Role[]) {
      const permissions = rolePermissions[role];

      for (const permission of permissions) {
        const dto: AddPermissionToRoleDto = {
          role,
          permission,
        };

        try {
          await this.authService.addPermissionToRole(dto);
          this.logger.log(`${role} → ${permission} qo‘shildi`);
        } catch (e) {
          this.logger.debug(`${role} → ${permission} allaqachon mavjud`);
        }
      }
    }

    this.logger.warn('━━━━━━━━ Role Permission Seeder Tugadi ━━━━━━━━');
  }
}
