import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum SocialAssistanceStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}
@Entity('social_assistances')
export class SocialAssistance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 14 })
  citizen_pinfl: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: SocialAssistanceStatus,
    default: SocialAssistanceStatus.PENDING,
  })
  status: SocialAssistanceStatus;

  @Column({ type: 'timestamp', nullable: true })
  expires_at?: Date; // muddati tugashi (masalan, 6 oy yoki 1 yil)

  @Column({ type: 'int' })
  created_by: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;
}
