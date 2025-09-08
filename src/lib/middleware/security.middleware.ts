import { NextRequest, NextResponse } from "next/server";
import { AuthUtils } from "@/lib/utils/auth.utils";
import { UserRole } from "@prisma/client";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    role: UserRole;
  };
}

/**
 * Security headers middleware
 */
export function securityHeaders(_request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // HSTS (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

/**
 * Authentication middleware
 */
export function authenticate(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const token = AuthUtils.extractTokenFromHeader(authHeader);

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", message: "No token provided" },
      { status: 401 }
    );
  }

  try {
    const payload = AuthUtils.verifyAccessToken(token);

    // Add user info to request
    (request as AuthenticatedRequest).user = {
      userId: payload.userId,
      role: payload.role,
    };

    return null; // Continue to next middleware
  } catch (_error) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

/**
 * Authorization middleware
 */
export function authorize(requiredRole: UserRole) {
  return (request: AuthenticatedRequest): NextResponse | null => {
    const user = request.user;

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!AuthUtils.hasRole(user.role, requiredRole)) {
      return NextResponse.json(
        { error: "Forbidden", message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return null; // Continue to next middleware
  };
}

/**
 * CSRF protection middleware
 */
export function csrfProtection(request: NextRequest): NextResponse | null {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return null;
  }

  const csrfToken = request.headers.get("x-csrf-token");
  const cookieToken = request.cookies.get("csrf-token")?.value;

  if (!csrfToken || !cookieToken) {
    return NextResponse.json(
      { error: "Forbidden", message: "CSRF token missing" },
      { status: 403 }
    );
  }

  if (!AuthUtils.verifyTokenHash(csrfToken, cookieToken)) {
    return NextResponse.json(
      { error: "Forbidden", message: "Invalid CSRF token" },
      { status: 403 }
    );
  }

  return null; // Continue to next middleware
}

/**
 * Rate limiting middleware (simple in-memory implementation)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 100
) {
  return (request: NextRequest): NextResponse | null => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const now = Date.now();

    // Clean up expired entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }

    const key = `${ip}:${request.nextUrl.pathname}`;
    const current = rateLimitStore.get(key);

    if (!current) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return null;
    }

    if (current.resetTime < now) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return null;
    }

    if (current.count >= maxRequests) {
      return NextResponse.json(
        { error: "Too Many Requests", message: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    current.count++;
    return null;
  };
}

/**
 * Input sanitization middleware
 */
export function sanitizeInput(request: NextRequest): NextRequest {
  // This is a basic implementation
  // In production, you'd want more comprehensive sanitization
  const url = new URL(request.url);

  // Sanitize query parameters
  for (const [key, value] of url.searchParams.entries()) {
    const sanitized = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");

    if (sanitized !== value) {
      url.searchParams.set(key, sanitized);
    }
  }

  return new NextRequest(url.toString(), request);
}

/**
 * Sanitize request body data
 */
export function sanitizeBody<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === "string") {
      // TypeScript: avoid assigning to generic index signature directly
      (sanitized as Record<string, unknown>)[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
        .trim();
    }
  }

  return sanitized;
}

/**
 * Request logging middleware
 */
export function requestLogger(request: NextRequest): void {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  console.log(`[${timestamp}] ${method} ${url} - ${ip} - ${userAgent}`);
}

/**
 * Combine multiple middleware functions
 */
export function combineMiddleware(
  ...middlewares: Array<(req: NextRequest) => NextResponse | null>
) {
  return (request: NextRequest): NextResponse | null => {
    for (const middleware of middlewares) {
      const result = middleware(request);
      if (result) {
        return result;
      }
    }
    return null;
  };
}
