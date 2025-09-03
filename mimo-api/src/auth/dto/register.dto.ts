// mimo-api/src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum, Matches, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'İsim en az 2 karakter olmalıdır' })
  name: string;

  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir',
  })
  password: string;

  @IsOptional()
  @IsPhoneNumber('TR', { message: 'Geçerli bir telefon numarası giriniz' })
  phone?: string;

  @IsOptional()
  @IsEnum(['PATIENT', 'THERAPIST'], { message: 'Geçersiz rol' })
  role?: 'PATIENT' | 'THERAPIST';
}

// mimo-api/src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  email: string;

  @IsString()
  password: string;
}

// mimo-api/src/auth/dto/verify-email.dto.ts
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'Doğrulama kodu 6 haneli olmalıdır' })
  code: string;
}

// mimo-api/src/auth/dto/refresh-token.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh token gereklidir' })
  refreshToken: string;
}

// mimo-api/src/auth/dto/resend-verification.dto.ts
import { IsEmail } from 'class-validator';

export class ResendVerificationDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  email: string;
}