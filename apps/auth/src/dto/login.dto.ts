import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Telefon raqami bo‘sh bo‘lishi mumkin emas' })
  @Matches(/^\+998[ -]?[0-9]{2}[ -]?[0-9]{3}[ -]?[0-9]{2}[ -]?[0-9]{2}$/, {
    message:
      'Telefon raqami +998 bilan boshlanishi va 9 ta raqamdan iborat bo‘lishi kerak (masalan: +998901234567 yoki +998 90 123 45 67)',
  })
  phone: string;

  @IsNotEmpty({ message: 'Parol bo‘sh bo‘lishi mumkin emas' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lsin' })
  password: string;
}
