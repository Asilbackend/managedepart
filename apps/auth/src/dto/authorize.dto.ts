import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthorizeDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  permission?: string;
}
