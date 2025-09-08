import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { loginSchema } from "@/lib/validations/auth.schema";
import {
  handleApiError,
  createSuccessResponse,
  handleValidationError,
} from "@/lib/utils/error.utils";
import { sanitizeBody } from "@/lib/middleware/security.middleware";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    // Get client IP and user agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Parse and validate request body
    const body = await request.json();
    const sanitizedBody = sanitizeBody(body);

    const validationResult = loginSchema.safeParse(sanitizedBody);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.issues, request);
    }

    const { email, password } = validationResult.data;

    // Authenticate user
    const authResult = await authService.login(
      { email, password },
      ipAddress,
      userAgent
    );

    return createSuccessResponse(
      {
        user: authResult.user,
        accessToken: authResult.tokens.accessToken,
        refreshToken: authResult.tokens.refreshToken,
      },
      "Login successful"
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
