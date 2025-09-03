import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
            emailVerificationExpires: Date | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
            emailVerificationExpires: Date | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private generateVerificationCode;
    private sanitizeUser;
    private sendVerificationEmail;
}
