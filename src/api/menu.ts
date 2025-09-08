import {
  MenuItem,
  MenuCategory,
  PaginatedResponseDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/api";
import axios from "@/utils/axios";
import { endpoints } from "@/routes/endpoints";

// Menu Items API
export async function getMenuItems(category?: string): Promise<MenuItem[]> {
  const params = category ? `?category=${category}` : "";
  const response = await axios.get(`${endpoints.menu.items}${params}`);
  return response.data.data; // Extract data from the new API response format
}

export async function getMenuItem(id: string): Promise<MenuItem> {
  const response = await axios.get(endpoints.menu.item(id));
  return response.data.data; // Extract data from the new API response format
}

export async function createMenuItem(
  data: CreateMenuItemDto
): Promise<MenuItem> {
  const response = await axios.post(endpoints.menu.items, data);
  return response.data.data; // Extract data from the new API response format
}

export async function updateMenuItem(
  data: UpdateMenuItemDto
): Promise<MenuItem> {
  const response = await axios.put(endpoints.menu.item(data.id), data);
  return response.data.data; // Extract data from the new API response format
}

export async function deleteMenuItem(id: string): Promise<void> {
  await axios.delete(endpoints.menu.item(id));
}

// Menu Categories API
export async function getMenuCategories(): Promise<MenuCategory[]> {
  const response = await axios.get(endpoints.menu.categories);
  return response.data.data; // Extract data from the new API response format
}

export async function getMenuCategory(id: string): Promise<MenuCategory> {
  const response = await axios.get(endpoints.menu.category(id));
  return response.data.data; // Extract data from the new API response format
}

export async function createMenuCategory(
  data: CreateCategoryDto
): Promise<MenuCategory> {
  const response = await axios.post(endpoints.menu.categories, data);
  return response.data.data; // Extract data from the new API response format
}

export async function updateMenuCategory(
  data: UpdateCategoryDto
): Promise<MenuCategory> {
  const response = await axios.put(endpoints.menu.category(data.id), data);
  return response.data.data; // Extract data from the new API response format
}

export async function deleteMenuCategory(id: string): Promise<void> {
  await axios.delete(endpoints.menu.category(id));
}
