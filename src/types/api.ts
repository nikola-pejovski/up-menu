export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: MenuCategory;
  isAvailable: boolean;
  isFeatured: boolean;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  ingredients?: string[];
  allergens?: string[];
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {
  id: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: string;
}

export interface CreateAdminUserDto {
  email: string;
  name: string;
  password: string;
  role: "ADMIN" | "MANAGER";
}

export interface UpdateAdminUserDto extends Partial<CreateAdminUserDto> {
  id: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
}
