import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { updateAdminUserSchema } from "@/lib/validations/auth.schema";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const user = await authService.getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return createSuccessResponse(user, "User retrieved successfully");
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const sanitizedBody = sanitizeBody(body);

    const validationResult = updateAdminUserSchema.safeParse(sanitizedBody);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.issues, request);
    }

    const userData = validationResult.data;
    const updatedUser = await authService.updateUser(id, userData);

    return createSuccessResponse(updatedUser, "User updated successfully");
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await authService.deleteUser(id);

    return createSuccessResponse(null, "User deleted successfully");
  } catch (error) {
    return handleApiError(error, request);
  }
}
