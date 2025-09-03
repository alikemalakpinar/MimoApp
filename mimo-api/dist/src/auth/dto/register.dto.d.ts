export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'PATIENT' | 'THERAPIST';
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class VerifyEmailDto {
    email: string;
    code: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ResendVerificationDto {
    email: string;
}
