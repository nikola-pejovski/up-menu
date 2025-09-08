import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import {
  authenticate,
  AuthenticatedRequest,
} from "@/lib/middleware/auth.middleware";
import { handleApiError, createSuccessResponse } from "@/lib/utils/error.utils";

const authService = new AuthService();

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResponse = authenticate(request);
    if (authResponse) {
      return authResponse;
    }

    const user = (request as AuthenticatedRequest).user;
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get user profile
    const userProfile = await authService.getUserById(user.userId);

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return createSuccessResponse(userProfile, "Profile retrieved successfully");
  } catch (error) {
    return handleApiError(error, request);
  }
}
