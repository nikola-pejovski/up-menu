import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AdminUser, UserRole } from "@prisma/client";

export interface TokenPayload {
  userId: string;
  role: UserRole;
  type?: "access" | "refresh";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthUtils {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "fallback-secret-key";
  private static readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret-key";
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
  private static readonly JWT_REFRESH_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  private static readonly BCRYPT_ROUNDS = parseInt(
    process.env.BCRYPT_ROUNDS || "12"
  );

  /**
   * Generate JWT token pair (access + refresh)
   */
  static generateTokens(user: AdminUser): TokenPair {
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      { ...payload, type: "refresh" },
      this.JWT_REFRESH_SECRET,
      {
        expiresIn: this.JWT_REFRESH_EXPIRES_IN,
      } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify JWT access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (_error) {
      throw new Error("Invalid or expired access token");
    }
  }

  /**
   * Verify JWT refresh token
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      const payload = jwt.verify(
        token,
        this.JWT_REFRESH_SECRET
      ) as TokenPayload;
      if (payload.type !== "refresh") {
        throw new Error("Invalid token type");
      }
      return payload;
    } catch (_error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.BCRYPT_ROUNDS);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Generate cryptographically secure random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * Generate secure random string with custom charset
   */
  // static generateSecureString(length: number = 32): string {
  //   const chars =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   const randomBytes = crypto.randomBytes(length);
  //   let result = "";
  //   for (let i = 0; i < length; i++) {
  //     result += chars[randomBytes[i] % chars.length];
  //   }
  //   return result;
  // }

  /**
   * Check if user has required role
   */
  static hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      USER: 0,
      MANAGER: 1,
      ADMIN: 2,
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * Generate password reset token
   */
  static generatePasswordResetToken(): string {
    return this.generateSecureToken(32);
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    return this.generateSecureToken(32);
  }

  /**
   * Hash token for storage (one-way)
   */
  static hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Verify token against hash
   */
  static verifyTokenHash(token: string, hash: string): boolean {
    const tokenHash = this.hashToken(token);
    return crypto.timingSafeEqual(
      Buffer.from(tokenHash, "hex"),
      Buffer.from(hash, "hex")
    );
  }
}
