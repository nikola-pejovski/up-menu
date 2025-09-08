import { NextRequest, NextResponse } from "next/server";
import { MenuService } from "@/lib/services/menu.service";
import {
  categoryQuerySchema,
  createCategorySchema,
} from "@/lib/validations/menu.schema";
import {
  handleApiError,
  createSuccessResponse,
  createPaginatedResponse,
  handleValidationError,
} from "@/lib/utils/error.utils";
import { sanitizeBody } from "@/lib/middleware/security.middleware";

const menuService = new MenuService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters (keep as strings for validation)
    const queryParams = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      isActive: searchParams.get("isActive") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "name" | "createdAt" | "sortOrder") ||
        "sortOrder",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    // Validate query parameters
    const validationResult = categoryQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.issues, request);
    }

    // Get categories
    const result = await menuService.getCategories(validationResult.data);

    return createPaginatedResponse(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      "Categories retrieved successfully"
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const sanitizedBody = sanitizeBody(body);

    const validationResult = createCategorySchema.safeParse(sanitizedBody);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.issues, request);
    }

    // Create category
    const category = await menuService.createCategory(validationResult.data);

    return createSuccessResponse(
      category,
      "Category created successfully",
      201
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
