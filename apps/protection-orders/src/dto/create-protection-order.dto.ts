import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ProtectionOrderStatus } from '../entities/protection-orders.entity';

export class CreateProtectionOrderDto {
  @IsNotEmpty()
  @IsString()
  order_number: string;

  @IsNotEmpty()
  @IsString()
  @Length(14, 14, { message: 'PINFL must be exactly 14 characters' })
  citizen_pinfl: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(ProtectionOrderStatus, {
    message: `status faqat quyidagilardan biri bo‘lishi mumkin: ${Object.values(ProtectionOrderStatus).join(', ')}`,
  })
  status?: ProtectionOrderStatus;

  @IsNotEmpty()
  @IsNumber()
  created_by: number;

  @IsOptional()
  expires_at?: Date;
}
