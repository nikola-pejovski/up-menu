import { z } from "zod";

// Category validation schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .trim()
    .optional(),
  image: z.string().url("Please enter a valid image URL").optional(),
  isActive: z.boolean().default(true),
  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be non-negative")
    .default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// Menu item validation schemas
export const createMenuItemSchema = z.object({
  name: z
    .string()
    .min(1, "Item name is required")
    .min(2, "Item name must be at least 2 characters")
    .max(100, "Item name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .trim()
    .optional(),
  price: z
    .number()
    .positive("Price must be positive")
    .max(9999.99, "Price must be less than $10,000")
    .transform((val) => Math.round(val * 100) / 100), // Round to 2 decimal places
  image: z.string().url("Please enter a valid image URL").optional(),
  categoryId: z.string().cuid("Invalid category ID").optional(),
  ingredients: z
    .array(z.string().trim().min(1, "Ingredient cannot be empty"))
    .max(20, "Maximum 20 ingredients allowed")
    .default([]),
  allergens: z
    .array(z.string().trim().min(1, "Allergen cannot be empty"))
    .max(10, "Maximum 10 allergens allowed")
    .default([]),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z
    .number()
    .int("Sort order must be an integer")
    .min(0, "Sort order must be non-negative")
    .default(0),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

// Query parameter validation schemas
export const menuItemQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be positive"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
  category: z.string().cuid("Invalid category ID").optional(),
  search: z
    .string()
    .min(1, "Search term cannot be empty")
    .max(100, "Search term must be less than 100 characters")
    .trim()
    .optional(),
  isAvailable: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
  isFeatured: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
  sortBy: z
    .enum(["name", "price", "createdAt", "sortOrder"])
    .default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const categoryQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be positive"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
  sortBy: z.enum(["name", "createdAt", "sortOrder"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Bulk operations validation schemas
export const bulkUpdateMenuItemsSchema = z.object({
  ids: z
    .array(z.string().cuid("Invalid item ID"))
    .min(1, "At least one item ID is required")
    .max(100, "Maximum 100 items can be updated at once"),
  updates: z.object({
    isAvailable: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    categoryId: z.string().cuid("Invalid category ID").optional(),
  }),
});

export const bulkDeleteMenuItemsSchema = z.object({
  ids: z
    .array(z.string().cuid("Invalid item ID"))
    .min(1, "At least one item ID is required")
    .max(100, "Maximum 100 items can be deleted at once"),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type MenuItemQueryInput = z.infer<typeof menuItemQuerySchema>;
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>;
export type BulkUpdateMenuItemsInput = z.infer<
  typeof bulkUpdateMenuItemsSchema
>;
export type BulkDeleteMenuItemsInput = z.infer<
  typeof bulkDeleteMenuItemsSchema
>;
