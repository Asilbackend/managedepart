import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

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
  status?: string;

  @IsNotEmpty()
  @IsNumber()
  created_by: number;

  @IsOptional()
  expires_at?: Date;
}
