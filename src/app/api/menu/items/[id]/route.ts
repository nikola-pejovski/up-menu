import { NextRequest, NextResponse } from "next/server";
import { MenuService } from "@/lib/services/menu.service";
import { updateMenuItemSchema } from "@/lib/validations/menu.schema";
import {
  handleApiError,
  createSuccessResponse,
  handleValidationError,
} from "@/lib/utils/error.utils";
import { sanitizeBody } from "@/lib/middleware/security.middleware";
import {
  authenticate,
  managerOrAdmin,
  AuthenticatedRequest,
} from "@/lib/middleware/auth.middleware";

const menuService = new MenuService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await menuService.getMenuItemById(id);

    if (!item) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return createSuccessResponse(item, "Menu item retrieved successfully");
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

    // Check manager/admin permissions
    const managerResponse = managerOrAdmin(request as AuthenticatedRequest);
    if (managerResponse) {
      return managerResponse;
    }

    const { id } = await params;
    const body = await request.json();
    const sanitizedBody = sanitizeBody(body);

    const validationResult = updateMenuItemSchema.safeParse(sanitizedBody);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error.issues, request);
    }

    const itemData = validationResult.data;
    const updatedItem = await menuService.updateMenuItem(id, itemData);

    return createSuccessResponse(updatedItem, "Menu item updated successfully");
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

    // Check manager/admin permissions
    const managerResponse = managerOrAdmin(request as AuthenticatedRequest);
    if (managerResponse) {
      return managerResponse;
    }

    const { id } = await params;
    await menuService.deleteMenuItem(id);

    return createSuccessResponse(null, "Menu item deleted successfully");
  } catch (error) {
    return handleApiError(error, request);
  }
}
