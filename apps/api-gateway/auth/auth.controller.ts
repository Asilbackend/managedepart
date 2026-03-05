import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../src/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RequireRole } from '../src/decorators/role.decorator';
import { JwtAuthGuard } from '../src/security/jwt-auth.guard';
import { AuthorizationGuard } from '../src/security/authorization.guard';
import { AddPermissionToRoleDto } from './dto/add-permission.dto';
import { RequirePermission } from '../src/decorators/require-permission.decorator';

@ApiTags('auth (Gateway)')
@Controller('auth')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
  @RequireRole('ADMIN')
  @Post('/create-user')
  async createUser(@Body() dto: CreateUserDto) {
    return await this.authService.create(dto);
  }

  @Post('/search')
  @RequirePermission('search:citizen')
  async searchUserdata(@Query('pinfl') pinfl: string) {
    return await this.authService.searchUserData(pinfl);
  }

  @Public()
  @Post('/add-permission')
  async addPermission(@Body() dto: AddPermissionToRoleDto) {
    await this.authService.addPermission(dto);
    return {
      success: true,
      message: 'Ruxsat muvaffaqiyatli qo‘shildi',
    };
  }
  @Public()
  @Delete('/delete-permission')
  async deletePermission(@Body() dto: AddPermissionToRoleDto) {
    await this.authService.deletePermission(dto);
    return {
      success: true,
      message: 'Ruxsat muvaffaqiyatli bekor qilindi',
    };
  }
  @Public()
  @Get('/show-permission')
  async showPermissions() {
    return await this.authService.showPermissions();
  }
}
