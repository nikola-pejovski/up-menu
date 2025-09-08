import { Category, MenuItem, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "@/lib/utils/error.utils";
import { SanitizationUtils } from "@/lib/utils/sanitization.utils";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateMenuItemInput,
  UpdateMenuItemInput,
  MenuItemQueryInput,
  CategoryQueryInput,
  BulkUpdateMenuItemsInput,
  BulkDeleteMenuItemsInput,
} from "@/lib/validations/menu.schema";

export interface MenuItemWithCategory extends MenuItem {
  category?: Category | null;
}

export interface CategoryWithItems extends Category {
  menuItems?: MenuItem[];
  _count?: {
    menuItems: number;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class MenuService {
  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryInput): Promise<Category> {
    // Sanitize input data
    const sanitizedData = SanitizationUtils.sanitizeObject(data, {
      name: "text",
      description: "text",
      image: "url",
    });

    // Generate slug from name
    const slug = this.generateSlug(sanitizedData.name);

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: sanitizedData.name }, { slug }],
      },
    });

    if (existingCategory) {
      throw new ConflictError("Category with this name already exists");
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        ...sanitizedData,
        slug,
      },
    });

    return category;
  }

  /**
   * Get all categories with pagination
   */
  async getCategories(
    query: CategoryQueryInput
  ): Promise<PaginatedResult<CategoryWithItems>> {
    const { page, limit, isActive, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.CategoryWhereInput = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Build order by clause
    const orderBy: Prisma.CategoryOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    // Get categories with count
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              menuItems: true,
            },
          },
        },
      }),
      prisma.category.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<CategoryWithItems> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<CategoryWithItems> {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  /**
   * Update category
   */
  async updateCategory(
    id: string,
    data: UpdateCategoryInput
  ): Promise<Category> {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundError("Category not found");
    }

    // Sanitize input data
    const sanitizedData = SanitizationUtils.sanitizeObject(data, {
      name: "text",
      description: "text",
      image: "url",
    });

    // Generate slug if name is being updated
    if (sanitizedData.name && sanitizedData.name !== existingCategory.name) {
      const slug = this.generateSlug(sanitizedData.name);

      // Check if slug already exists
      const existingSlug = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingSlug) {
        throw new ConflictError("Category with this name already exists");
      }

      (sanitizedData as Record<string, unknown>).slug = slug;
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: sanitizedData,
    });

    return category;
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string): Promise<void> {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    // Check if category has menu items
    if (category._count.menuItems > 0) {
      throw new ValidationError(
        "Cannot delete category with existing menu items"
      );
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Create a new menu item
   */
  async createMenuItem(
    data: CreateMenuItemInput
  ): Promise<MenuItemWithCategory> {
    // Sanitize input data
    const sanitizedData = SanitizationUtils.sanitizeObject(data, {
      name: "text",
      description: "text",
      image: "url",
    });

    // Generate slug from name
    const slug = this.generateSlug(sanitizedData.name);

    // Check if menu item with same name or slug already exists
    const existingItem = await prisma.menuItem.findFirst({
      where: {
        OR: [{ name: sanitizedData.name }, { slug }],
      },
    });

    if (existingItem) {
      throw new ConflictError("Menu item with this name already exists");
    }

    // Validate category exists if provided
    if (sanitizedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: sanitizedData.categoryId },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }
    }

    // Create menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        ...sanitizedData,
        slug,
      },
      include: {
        category: true,
      },
    });

    return menuItem;
  }

  /**
   * Get all menu items with pagination and filtering
   */
  async getMenuItems(
    query: MenuItemQueryInput
  ): Promise<PaginatedResult<MenuItemWithCategory>> {
    const {
      page,
      limit,
      category,
      search,
      isAvailable,
      isFeatured,
      sortBy,
      sortOrder,
    } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.MenuItemWhereInput = {};

    if (category) {
      where.categoryId = category;
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { ingredients: { has: search } },
      ];
    }

    // Build order by clause
    const orderBy: Prisma.MenuItemOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    // Get menu items with count
    const [menuItems, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      prisma.menuItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: menuItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get menu item by ID
   */
  async getMenuItemById(id: string): Promise<MenuItemWithCategory> {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundError("Menu item not found");
    }

    return menuItem;
  }

  /**
   * Get menu item by slug
   */
  async getMenuItemBySlug(slug: string): Promise<MenuItemWithCategory> {
    const menuItem = await prisma.menuItem.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundError("Menu item not found");
    }

    return menuItem;
  }

  /**
   * Update menu item
   */
  async updateMenuItem(
    id: string,
    data: UpdateMenuItemInput
  ): Promise<MenuItemWithCategory> {
    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      throw new NotFoundError("Menu item not found");
    }

    // Sanitize input data
    const sanitizedData = SanitizationUtils.sanitizeObject(data, {
      name: "text",
      description: "text",
      image: "url",
    });

    // Generate slug if name is being updated
    if (sanitizedData.name && sanitizedData.name !== existingItem.name) {
      const slug = this.generateSlug(sanitizedData.name);

      // Check if slug already exists
      const existingSlug = await prisma.menuItem.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingSlug) {
        throw new ConflictError("Menu item with this name already exists");
      }

      (sanitizedData as Record<string, unknown>).slug = slug;
    }

    // Validate category exists if provided
    if (sanitizedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: sanitizedData.categoryId },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }
    }

    // Update menu item
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: sanitizedData,
      include: {
        category: true,
      },
    });

    return menuItem;
  }

  /**
   * Delete menu item
   */
  async deleteMenuItem(id: string): Promise<void> {
    // Check if menu item exists
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      throw new NotFoundError("Menu item not found");
    }

    // Delete menu item
    await prisma.menuItem.delete({
      where: { id },
    });
  }

  /**
   * Bulk update menu items
   */
  async bulkUpdateMenuItems(
    data: BulkUpdateMenuItemsInput
  ): Promise<{ updated: number }> {
    const { ids, updates } = data;

    // Validate all IDs exist
    const existingItems = await prisma.menuItem.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (existingItems.length !== ids.length) {
      throw new NotFoundError("One or more menu items not found");
    }

    // Validate category exists if provided
    if (updates.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updates.categoryId },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }
    }

    // Update menu items
    const result = await prisma.menuItem.updateMany({
      where: { id: { in: ids } },
      data: updates,
    });

    return { updated: result.count };
  }

  /**
   * Bulk delete menu items
   */
  async bulkDeleteMenuItems(
    data: BulkDeleteMenuItemsInput
  ): Promise<{ deleted: number }> {
    const { ids } = data;

    // Validate all IDs exist
    const existingItems = await prisma.menuItem.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (existingItems.length !== ids.length) {
      throw new NotFoundError("One or more menu items not found");
    }

    // Delete menu items
    const result = await prisma.menuItem.deleteMany({
      where: { id: { in: ids } },
    });

    return { deleted: result.count };
  }

  /**
   * Get featured menu items
   */
  async getFeaturedMenuItems(
    limit: number = 6
  ): Promise<MenuItemWithCategory[]> {
    return prisma.menuItem.findMany({
      where: {
        isFeatured: true,
        isAvailable: true,
      },
      take: limit,
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
      },
    });
  }

  /**
   * Get menu items by category
   */
  async getMenuItemsByCategory(
    categoryId: string,
    limit?: number
  ): Promise<MenuItemWithCategory[]> {
    return prisma.menuItem.findMany({
      where: {
        categoryId,
        isAvailable: true,
      },
      take: limit,
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
      },
    });
  }

  /**
   * Search menu items
   */
  async searchMenuItems(
    searchTerm: string,
    limit: number = 10
  ): Promise<MenuItemWithCategory[]> {
    return prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { ingredients: { has: searchTerm } },
        ],
      },
      take: limit,
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
      },
    });
  }

  /**
   * Generate URL-friendly slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }
}
