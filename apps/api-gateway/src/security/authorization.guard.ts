import { HttpService } from '@nestjs/axios';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { firstValueFrom } from 'rxjs';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<string>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRole && !requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    console.log('[AuthorizationGuard] request.user exists?', !!request.user);
    console.log('[AuthorizationGuard] request.user:', request.user);

    const user = request.user;

    if (!user || !user.id) {
      console.log('[AuthorizationGuard] No user found after JwtAuthGuard');
      throw new ForbiddenException('No authenticated user');
    }

    const authUrl = await this.configService.get('services.auth.url');
    console.log(authUrl + '-----------------------------------------------');

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${authUrl}/auth/internal/authorize`, {
          userId: user.id,
          role: requiredRole || null,
          permission: requiredPermission || null,
        }),
      );

      if (!response.data.allowed) {
        throw new ForbiddenException('Access denied');
      }

      return true;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Access denied');
    }
  }
}
