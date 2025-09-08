import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { createAdminUserSchema } from "@/lib/validations/auth.schema";
import {
  handleApiError,
  createSuccessResponse,
  handleValidationError,
} from "@/lib/utils/error.utils";
import { sanitizeBody } from "@/lib/middleware/security.middleware";
import {
  authenticate,
  adminOnly,
  AuthenticatedRequest,
} from "@/lib/middleware/auth.middleware";

const authService = new AuthService();

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResponse = authenticate(request);
    if (authResponse) {
      return authResponse;
    }

    // Check admin permissions
    const adminResponse = adminOnly(request as AuthenticatedRequest);
    if (adminResponse) {
      return adminResponse;
    }

    const users = await authService.getAllUsers();
    return createSuccessResponse(users, "Users retrieved successfully");
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResponse = authenticate(request);
    if (authResponse) {
      return authResponse;
    }

    // Check admin permissions
    const adminResponse = adminOnly(request as AuthenticatedRequest);
    if (adminResponse) {
      return adminResponse;
    }

    // Parse and validate request body
    const body = await request.json();
    const sanitizedBody = sanitizeBody(body);

    const validationResult = createAdminUserSchema.safeParse(sanitizedBody);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.issues, request);
    }

    const userData = validationResult.data;
    const newUser = await authService.createUser(userData);

    return createSuccessResponse(newUser, "User created successfully", 201);
  } catch (error) {
    return handleApiError(error, request);
  }
}
