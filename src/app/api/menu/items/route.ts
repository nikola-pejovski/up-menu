import { NextRequest, NextResponse } from "next/server";
import { MenuService } from "@/lib/services/menu.service";
import {
  menuItemQuerySchema,
  createMenuItemSchema,
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
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      isAvailable: searchParams.get("isAvailable") || undefined,
      isFeatured: searchParams.get("isFeatured") || undefined,
      sortBy:
        (searchParams.get("sortBy") as
          | "name"
          | "price"
          | "createdAt"
          | "sortOrder") || "sortOrder",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    // Validate query parameters
    const validationResult = menuItemQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.issues, request);
    }

    // Get menu items
    const result = await menuService.getMenuItems(validationResult.data);

    return createPaginatedResponse(
      result.data,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      "Menu items retrieved successfully"
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

    const validationResult = createMenuItemSchema.safeParse(sanitizedBody);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.issues, request);
    }

    // Create menu item
    const menuItem = await menuService.createMenuItem(validationResult.data);

    return createSuccessResponse(
      menuItem,
      "Menu item created successfully",
      201
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
