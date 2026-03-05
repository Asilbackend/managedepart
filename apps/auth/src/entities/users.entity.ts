import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  UCHASTKAVOY = 'UCHASTKAVOY',
  MAHALLA_YETTILIGI = 'MAHALLA_YETTILIGI',
  ADMIN = 'ADMIN',
  CITIZEN = 'CITIZEN',
}
export enum Permission {
  ORDER_CREATE = 'order:create',
  ORDER_READ = 'order:read',
  ORDER_UPDATE = 'order:update',

  SHOW_CITIZEN = 'show:citizen',
  SEARCH_CITIZEN = 'search:citizen',

  SOCIAL_CREATE = 'social:create',
  SOCIAL_READ = 'social:read',
  SOCIAL_UPDATE = 'social:update',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;
  @Column({ type: 'varchar', length: 100 })
  lastName: string;
  @Column({ type: 'varchar', length: 100, unique: true })
  pinfl: string;
  @Column({ type: 'varchar', length: 100, unique: true })
  phone: string;
  @Column()
  password: string;
  @Column({ type: 'boolean' })
  isActive: boolean;
  @Column({ type: 'enum', enum: Role })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
