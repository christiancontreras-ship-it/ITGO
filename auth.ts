import { jwtVerify, SignJWT } from 'jose';
import CryptoJS from 'crypto-js';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Verify JWT token
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Generate JWT token
export async function generateJWT(userId: string, email: string, role: string): Promise<string> {
  const token = await new SignJWT({ email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);

  return token;
}

// Hash password
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password + process.env.JWT_SECRET).toString();
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate MFA secret
export function generateMFASecret(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

// Validate MFA TOTP
export function validateMFACode(secret: string, code: string): boolean {
  const window = parseInt(process.env.MFA_WINDOW_SIZE || '30');
  const now = Math.floor(Date.now() / 1000 / window);

  for (let i = -1; i <= 1; i++) {
    const hmac = CryptoJS.HmacSHA1(secret, (now + i).toString());
    const offset = parseInt(hmac.charAt(hmac.length - 1), 16) & 0xf;
    const otp = (parseInt(hmac.substr(offset * 2, 8), 16) & 0x7fffffff) % 1000000;

    if (otp.toString().padStart(6, '0') === code) {
      return true;
    }
  }

  return false;
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const window = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

  const existing = rateLimitMap.get(identifier);

  if (!existing) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + window });
    return true;
  }

  if (now > existing.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + window });
    return true;
  }

  if (existing.count >= maxRequests) {
    return false;
  }

  existing.count++;
  return true;
}

// Encrypt sensitive data
export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, process.env.JWT_SECRET || 'default').toString();
}

// Decrypt sensitive data
export function decryptData(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, process.env.JWT_SECRET || 'default');
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Generate random token for password reset
export function generateResetToken(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isStrongPassword(password: string): {
  isStrong: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial (!@#$%^&*)');
  }

  return {
    isStrong: errors.length === 0,
    errors,
  };
}

// Generate session ID
export function generateSessionId(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

// Create authorization header
export function createAuthHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

// Extract token from header
export function extractTokenFromHeader(header?: string): string | null {
  if (!header) return null;
  const parts = header.split(' ');
  return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
}

// Check if user has permission
export async function checkPermission(userRole: string, requiredRole: string): Promise<boolean> {
  const roleHierarchy: Record<string, number> = {
    admin: 3,
    partner: 2,
    specialist: 1,
    client: 0,
  };

  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 255);
}

// Validate phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}
