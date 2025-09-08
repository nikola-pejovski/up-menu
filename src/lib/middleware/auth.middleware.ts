import { NextRequest, NextResponse } from "next/server";
import { AuthUtils } from "@/lib/utils/auth.utils";
import { UserRole } from "@prisma/client";
import { UnauthorizedError, ForbiddenError } from "@/lib/utils/error.utils";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    role: UserRole;
  };
}

/**
 * Authentication middleware - verifies JWT token
 */
export function authenticate(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const token = AuthUtils.extractTokenFromHeader(authHeader);

  if (!token) {
    return NextResponse.json(
      {
        statusCode: 401,
        message: "Unauthorized",
        error: "No token provided",
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
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
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 401,
        message: "Unauthorized",
        error: "Invalid or expired token",
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
      { status: 401 }
    );
  }
}

/**
 * Authorization middleware - checks user role
 */
export function authorize(requiredRole: UserRole) {
  return (request: AuthenticatedRequest): NextResponse | null => {
    const user = request.user;

    if (!user) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: "Unauthorized",
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
        },
        { status: 401 }
      );
    }

    if (!AuthUtils.hasRole(user.role, requiredRole)) {
      return NextResponse.json(
        {
          statusCode: 403,
          message: "Forbidden",
          error: "Insufficient permissions",
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
        },
        { status: 403 }
      );
    }

    return null; // Continue to next middleware
  };
}

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export function optionalAuthenticate(
  request: NextRequest
): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const token = AuthUtils.extractTokenFromHeader(authHeader);

  if (!token) {
    return null; // No token, but that's okay
  }

  try {
    const payload = AuthUtils.verifyAccessToken(token);

    // Add user info to request
    (request as AuthenticatedRequest).user = {
      userId: payload.userId,
      role: payload.role,
    };

    return null; // Continue to next middleware
  } catch (error) {
    // Token is invalid, but we don't fail - just don't set user
    return null;
  }
}

/**
 * Admin-only middleware
 */
export function adminOnly(request: AuthenticatedRequest): NextResponse | null {
  return authorize(UserRole.ADMIN)(request);
}

/**
 * Manager or Admin middleware
 */
export function managerOrAdmin(
  request: AuthenticatedRequest
): NextResponse | null {
  return authorize(UserRole.MANAGER)(request);
}

/**
 * Get user from request (helper function)
 */
export function getUserFromRequest(
  request: AuthenticatedRequest
): { userId: string; role: UserRole } | null {
  return request.user || null;
}

/**
 * Check if user has specific role (helper function)
 */
export function hasRole(
  request: AuthenticatedRequest,
  role: UserRole
): boolean {
  if (!request.user) {
    return false;
  }
  return AuthUtils.hasRole(request.user.role, role);
}

/**
 * Check if user is admin (helper function)
 */
export function isAdmin(request: AuthenticatedRequest): boolean {
  return hasRole(request, UserRole.ADMIN);
}

/**
 * Check if user is manager or admin (helper function)
 */
export function isManagerOrAdmin(request: AuthenticatedRequest): boolean {
  return hasRole(request, UserRole.MANAGER);
}
