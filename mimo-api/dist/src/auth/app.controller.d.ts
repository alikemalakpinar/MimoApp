import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<any>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<any>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<any>;
    resendVerification(resendVerificationDto: ResendVerificationDto): Promise<any>;
    logout(req: any): Promise<any>;
    getCurrentUser(req: any): Promise<{
        user: any;
    }>;
}
