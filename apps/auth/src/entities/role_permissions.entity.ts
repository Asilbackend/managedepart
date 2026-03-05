import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Permission, Role } from './users.entity';

@Entity('role_permissions')
@Unique(['role', 'permission'])
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: Role })
  role: Role;
  @Column({ type: 'enum', enum: Permission })
  permission: Permission;
}
