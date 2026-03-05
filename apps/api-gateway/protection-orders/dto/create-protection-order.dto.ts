import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

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
  status?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  created_by: number;

  @IsOptional()
  expires_at?: Date | string;
}
