import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProtectionOrderStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  VIOLATED = 'violated',
  EXTENDED = 'extended', // ixtiyoriy, agar uzaytirish alohida kuzatilsa
  COMPLETED = 'completed', // ixtiyoriy
}

@Entity('protection_orders')
export class ProtectionOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  order_number: string;

  @Column({ type: 'varchar', length: 14 })
  citizen_pinfl: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProtectionOrderStatus,
    default: ProtectionOrderStatus.ACTIVE,
  })
  status: ProtectionOrderStatus;

  @Column({ type: 'int' })
  created_by: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
