// mimo-api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, role = 'PATIENT' } = registerDto;

    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kullanımda');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
        emailVerified: false,
        emailVerificationToken: this.generateVerificationCode(),
        emailVerificationExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    // Send verification email (implement email service)
    await this.sendVerificationEmail(user.email, user.emailVerificationToken);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
      message: 'Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    // Check email verification
    if (!user.emailVerified) {
      throw new UnauthorizedException('Lütfen önce e-posta adresinizi doğrulayın');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Geçersiz doğrulama kodu');
    }

    if (user.emailVerified) {
      return { message: 'E-posta adresi zaten doğrulanmış' };
    }

    if (user.emailVerificationToken !== code) {
      throw new BadRequestException('Geçersiz doğrulama kodu');
    }

    if (user.emailVerificationExpires < new Date()) {
      throw new BadRequestException('Doğrulama kodu süresi dolmuş');
    }

    // Update user
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return { message: 'E-posta adresi başarıyla doğrulandı' };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Geçersiz token');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş token');
    }
  }

  async logout(userId: string) {
    // Optionally, you can blacklist the refresh token here
    // For now, just return success
    return { message: 'Çıkış başarılı' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı');
    }

    if (user.emailVerified) {
      return { message: 'E-posta adresi zaten doğrulanmış' };
    }

    // Generate new verification code
    const verificationCode = this.generateVerificationCode();
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationCode,
        emailVerificationExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    await this.sendVerificationEmail(user.email, verificationCode);
    return { message: 'Doğrulama kodu tekrar gönderildi' };
  }

  // Helper methods
  private async generateTokens(user: User) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private sanitizeUser(user: User) {
    const { password, emailVerificationToken, ...sanitized } = user;
    return sanitized;
  }

  private async sendVerificationEmail(email: string, code: string) {
    // TODO: Implement email service (SendGrid, AWS SES, etc.)
    console.log(`Verification email sent to ${email} with code: ${code}`);
  }
}