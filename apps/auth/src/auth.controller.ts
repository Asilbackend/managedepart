import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from '../user-service/user.service';
import { LoginDto } from './dto/login.dto';
import { AddPermissionToRoleDto } from './dto/add-permission.dto';
import { AuthorizeDto } from './dto/authorize.dto';
import { Role } from './entities/users.entity';
import { SearchService } from '../search/search.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly searchService: SearchService,
  ) {}

  @Get('/internal/search/:pinfl')
  async searchUser(@Param('pinfl') pinfl: string) {
    return await this.searchService.searchUser(pinfl);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/internal/create-user')
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Post('/internal/check-permission')
  async checkPermission(@Body() dto: { userId: number; permission: string }) {
    const allowed = await this.authService.check(dto.userId, dto.permission);
    return { allowed };
  }

  @Post('/internal/authorize')
  async authorize(@Body() body: AuthorizeDto) {
    const { userId, role, permission } = body;

    const user = await this.userService.findIdAndRoleByIdAndActive(
      userId,
      true,
    );
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    console.log('user found', user);

    // 🔹 ROLE tekshirish
    if (role) {
      console.log(role + '--------------');
      const hasRole = user.role === (role as Role);
      if (!hasRole) return { allowed: false };
    }

    // 🔹 PERMISSION tekshirish
    if (permission) {
      console.log(permission + '--------------');
      const allowed = await this.authService.check(userId, permission);
      if (!allowed) return false;
    }
    console.log('allowed:' + true + '---------------');
    return { allowed: true };
  }

  @Post('internal/add-permission')
  @HttpCode(201) // yoki 200, sizning logikangizga qarab
  async addPermissionToRole(@Body() dto: AddPermissionToRoleDto) {
    await this.authService.addPermissionToRole(dto);
    return { message: 'Ruxsat muvaffaqiyatli qo‘shildi' };
  }

  @Delete('internal/delete-permission')
  async deletePermissionToRole(@Body() dto: AddPermissionToRoleDto) {
    await this.authService.deletePermissionToRole(dto);
    return { message: 'Ruxsat muvaffaqiyatli bekor qilindi' };
  }

  @Get('internal/show-permission')
  async showPermission() {
    return await this.authService.getAllPermissionRoles();
  }
}
