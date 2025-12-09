// shared/utils/validation.ts - Form validation utilities

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
};

export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Zay1f', color: '#EF4444' };
  if (score <= 4) return { score, label: 'Orta', color: '#F59E0B' };
  return { score, label: 'Güçlü', color: '#10B981' };
};

// Phone validation (Turkish format)
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s/g, '').replace(/[()-]/g, '');
  // Turkish phone: +90 or 0 followed by 10 digits
  return /^(\+90|0)?[5][0-9]{9}$/.test(cleanPhone);
};

export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `0${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
  }
  if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7, 9)} ${cleanPhone.slice(9)}`;
  }
  if (cleanPhone.length === 12 && cleanPhone.startsWith('90')) {
    return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8, 10)} ${cleanPhone.slice(10)}`;
  }
  return phone;
};

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Zü_1öçÜ^0ÖÇ\s]+$/.test(name);
};

// Username validation
export const isValidUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric and underscores only
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

// TC Kimlik validation (Turkish ID)
export const isValidTCKimlik = (tc: string): boolean => {
  if (!/^[1-9][0-9]{10}$/.test(tc)) return false;

  const digits = tc.split('').map(Number);
  const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7;
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
  const check1 = (sum1 - sum2) % 10;

  if (check1 !== digits[9]) return false;

  const totalSum = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  return totalSum % 10 === digits[10];
};

// Date validation
export const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isAdult = (birthDate: Date): boolean => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
};

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleanNumber)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const formatCreditCard = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  const parts = cleanNumber.match(/.{1,4}/g) || [];
  return parts.join(' ').slice(0, 19);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const isRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

// Min/Max length validation
export const hasMinLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

export const hasMaxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// Form validation helper
export interface ValidationRule {
  validator: (value: string) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = (
  data: Record<string, string>,
  rules: Record<string, ValidationRule[]>
): ValidationResult => {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field] || '';

    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation rules
export const commonRules = {
  email: [
    { validator: isRequired, message: 'E-posta adresi gerekli' },
    { validator: isValidEmail, message: 'Geçerli bir e-posta adresi girin' },
  ],
  password: [
    { validator: isRequired, message: '^ifre gerekli' },
    { validator: (v: string) => hasMinLength(v, 8), message: '^ifre en az 8 karakter olmal1' },
    { validator: isValidPassword, message: '^ifre büyük harf, küçük harf ve rakam içermeli' },
  ],
  name: [
    { validator: isRequired, message: '0sim gerekli' },
    { validator: isValidName, message: 'Geçerli bir isim girin' },
  ],
  phone: [
    { validator: isRequired, message: 'Telefon numaras1 gerekli' },
    { validator: isValidPhone, message: 'Geçerli bir telefon numaras1 girin' },
  ],
  username: [
    { validator: isRequired, message: 'Kullan1c1 ad1 gerekli' },
    { validator: isValidUsername, message: 'Kullan1c1 ad1 3-20 karakter, harf, rakam ve alt çizgi içerebilir' },
  ],
};

export default {
  isValidEmail,
  isValidPassword,
  getPasswordStrength,
  isValidPhone,
  formatPhone,
  isValidName,
  isValidUsername,
  isValidTCKimlik,
  isValidDate,
  isAdult,
  isValidCreditCard,
  formatCreditCard,
  isValidUrl,
  isRequired,
  hasMinLength,
  hasMaxLength,
  validateForm,
  commonRules,
};
