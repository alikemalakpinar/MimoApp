"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    prisma;
    usersService;
    jwtService;
    configService;
    constructor(prisma, usersService, jwtService, configService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, password, name, phone, role = 'PATIENT' } = registerDto;
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('Bu e-posta adresi zaten kullanımda');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role,
                emailVerified: false,
                emailVerificationToken: this.generateVerificationCode(),
                emailVerificationExpires: new Date(Date.now() + 3600000),
            },
        });
        await this.sendVerificationEmail(user.email, user.emailVerificationToken);
        const tokens = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
            message: 'Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.',
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('E-posta veya şifre hatalı');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('E-posta veya şifre hatalı');
        }
        if (!user.emailVerified) {
            throw new common_1.UnauthorizedException('Lütfen önce e-posta adresinizi doğrulayın');
        }
        const tokens = await this.generateTokens(user);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async verifyEmail(verifyEmailDto) {
        const { email, code } = verifyEmailDto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('Geçersiz doğrulama kodu');
        }
        if (user.emailVerified) {
            return { message: 'E-posta adresi zaten doğrulanmış' };
        }
        if (user.emailVerificationToken !== code) {
            throw new common_1.BadRequestException('Geçersiz doğrulama kodu');
        }
        if (user.emailVerificationExpires < new Date()) {
            throw new common_1.BadRequestException('Doğrulama kodu süresi dolmuş');
        }
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
    async refreshTokens(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Geçersiz token');
            }
            const tokens = await this.generateTokens(user);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Geçersiz veya süresi dolmuş token');
        }
    }
    async logout(userId) {
        return { message: 'Çıkış başarılı' };
    }
    async resendVerificationEmail(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('Kullanıcı bulunamadı');
        }
        if (user.emailVerified) {
            return { message: 'E-posta adresi zaten doğrulanmış' };
        }
        const verificationCode = this.generateVerificationCode();
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: verificationCode,
                emailVerificationExpires: new Date(Date.now() + 3600000),
            },
        });
        await this.sendVerificationEmail(user.email, verificationCode);
        return { message: 'Doğrulama kodu tekrar gönderildi' };
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    sanitizeUser(user) {
        const { password, emailVerificationToken, ...sanitized } = user;
        return sanitized;
    }
    async sendVerificationEmail(email, code) {
        console.log(`Verification email sent to ${email} with code: ${code}`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object, jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=app.service.js.map