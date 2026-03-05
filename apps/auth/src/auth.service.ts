import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from './entities/role_permissions.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user-service/user.service';
import { Permission, Role } from './entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    /*@InjectRepository(User)
    private readonly usersRepo: Repository<User>,*/

    @InjectRepository(RolePermission)
    private readonly rolePermissionsRepo: Repository<RolePermission>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.phone, loginDto.password);
    const payload = {
      sub: user.id,
      phone: user.phone,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, phone: user.phone },
    };
  }
  private async validateUser(phone: string, password: string) {
    const user = await this.userService.findOneByPhone(phone);
    if (!user) {
      throw new NotFoundException(`User #${phone} no exist`);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(`password or phone doesn't match`);
    }
    return user;
  }

  async check(userId: number, permission: string): Promise<boolean> {
    const numericUserId = Number(userId);
    if (isNaN(numericUserId)) {
      return false;
    }

    const user = await this.userService.findIdAndRoleByIdAndActive(
      numericUserId,
      true,
    );

    if (!user) {
      return false;
    }

    return await this.rolePermissionsRepo.existsBy({
      role: user.role, // enum string sifatida saqlanadi
      permission: permission as Permission,
    });
  }

  async addPermissionToRole(dto: { permission: Permission; role: Role }) {
    return this.dataSource.transaction(async (manager) => {
      const existingByRoleAndPermission = await manager.existsBy(
        RolePermission,
        {
          permission: dto.permission,
          role: dto.role,
        },
      );
      if (existingByRoleAndPermission) {
        throw new ConflictException(`Permission already exists`);
      }
      const rolePermission = manager.create(RolePermission, {
        permission: dto.permission,
        role: dto.role,
      });
      await manager.save(rolePermission);
    });
  }

  async deletePermissionToRole(dto: { permission: Permission; role: Role }) {
    return this.dataSource.transaction(async (manager) => {
      const existingByRoleAndPermission = await manager.existsBy(
        RolePermission,
        {
          permission: dto.permission,
          role: dto.role,
        },
      );
      if (!existingByRoleAndPermission) {
        throw new BadRequestException(`Permission not  exists`);
      }
      await manager.delete(RolePermission, {
        permission: dto.permission,
        role: dto.role,
      });
    });
  }

  async getAllPermissionRoles() {
    return await this.rolePermissionsRepo.find();
  }
}
