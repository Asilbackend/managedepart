// users/dto/create-user.dto.ts
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'firstName bo‘sh bo‘lishi mumkin emas' })
  @MinLength(3, { message: 'Kamida 3 ta belgi bo‘lishi kerak' })
  firstName: string;

  @IsNotEmpty({ message: 'lastName bo‘sh bo‘lishi mumkin emas' })
  @MinLength(3, { message: 'Kamida 3 ta belgi bo‘lishi kerak' })
  lastName: string;

  @IsNotEmpty({ message: 'Telefon raqami bo‘sh bo‘lishi mumkin emas' })
  @Matches(/^\+998[ -]?[0-9]{2}[ -]?[0-9]{3}[ -]?[0-9]{2}[ -]?[0-9]{2}$/, {
    message:
      'Telefon raqami +998 bilan boshlanishi va 9 ta raqamdan iborat bo‘lishi kerak (masalan: +998901234567 yoki +998 90 123 45 67)',
  })
  phone: string;

  @IsNotEmpty({ message: 'Parol bo‘sh bo‘lishi mumkin emas' })
  @MinLength(8, { message: 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak' })
  password: string;
  @IsNotEmpty({ message: 'pinfl bo‘sh bo‘lishi mumkin emas' })
  pinfl: string;

  @IsNotEmpty({ message: 'role bo‘sh bo‘lishi mumkin emas' })
  role: string;
}
