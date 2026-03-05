import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpProxyService } from '../src/common/http-proxy.service';
import { AddPermissionToRoleDto } from './dto/add-permission.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly proxy: HttpProxyService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const authBaseUrl = this.getBaseUrl();
    return this.proxy.post(`${authBaseUrl}/auth/login`, loginDto);
  }

  private getBaseUrl() {
    return this.configService.get<string>('services.auth.url');
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const authBaseUrl = this.getBaseUrl();
    console.log(authBaseUrl);
    return this.proxy.post(
      `${authBaseUrl}/auth/internal/create-user`,
      createUserDto,
    );
  }
  async checkPermission(userId: string, permission: string): Promise<any> {
    const authBaseUrl = this.getBaseUrl();
    return this.proxy.post(`${authBaseUrl}/auth/internal/check-permission`, {
      userId,
      permission,
    });
  }

  async searchUserData(pinfl: string) {
    const authBaseUrl = this.getBaseUrl();
    return await this.proxy.get(`${authBaseUrl}/auth/internal/search/${pinfl}`);
  }

  async addPermission(dto: AddPermissionToRoleDto) {
    const baseUrl = this.getBaseUrl();
    const response = await this.proxy.post(
      `${baseUrl}/auth/internal/add-permission`,
      dto,
    );
    return response;
  }

  async deletePermission(dto: AddPermissionToRoleDto) {
    const baseUrl = this.getBaseUrl();
    const response = await this.proxy.delete(
      `${baseUrl}/auth/internal/delete-permission`,
      { data: dto }, // DELETE body shu tarzda yuboriladi
    );
    return response;
  }

  async showPermissions() {
    const baseUrl = this.getBaseUrl();
    const resp = await this.proxy.get(
      `${baseUrl}/auth/internal/show-permission`,
    );

    return {
      success: true,
      message: 'Permissionlar ro‘yxati',
      data: resp,
    };
  }
}
