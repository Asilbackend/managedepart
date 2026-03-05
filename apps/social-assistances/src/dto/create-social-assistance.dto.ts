import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { SocialAssistanceStatus } from '../entities/social-assistances.entity';

export class CreateSocialAssistanceDto {
  @IsNotEmpty()
  @IsString()
  @Length(14, 14, { message: 'PINFL exactly 14 characters' })
  citizen_pinfl: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsOptional()
  @IsEnum(SocialAssistanceStatus, {
    message: `status faqat quyidagilardan biri bo‘lishi mumkin: ${Object.values(SocialAssistanceStatus).join(', ')}`,
  })
  status?: SocialAssistanceStatus;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  created_by: number;

  @IsOptional()
  expires_at?: Date;
}
