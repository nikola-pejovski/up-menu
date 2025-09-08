import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import {
  authenticate,
  AuthenticatedRequest,
} from "@/lib/middleware/auth.middleware";
import { handleApiError, createSuccessResponse } from "@/lib/utils/error.utils";

const authService = new AuthService();

export async function POST(request: NextRequest) {
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

    // Get session ID from request (you might need to pass this from frontend)
    const { sessionId } = await request.json().catch(() => ({}));

    if (sessionId) {
      // Logout from specific session
      await authService.logout(user.userId, sessionId);
    } else {
      // Logout from all sessions
      await authService.logoutAllDevices(user.userId);
    }

    return createSuccessResponse(null, "Logged out successfully");
  } catch (error) {
    return handleApiError(error, request);
  }
}
