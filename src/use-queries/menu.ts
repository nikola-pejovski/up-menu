import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuCategories,
  getMenuCategory,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
} from "@/api/menu";
import {
  MenuItem,
  MenuCategory,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/api";

// Menu Items Queries
export function useMenuItems(category?: string) {
  return useQuery({
    queryKey: ["menu-items", category],
    queryFn: () => getMenuItems(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ["menu-item", id],
    queryFn: () => getMenuItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuItemDto) => createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMenuItemDto) => updateMenuItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["menu-item", variables.id] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
}

// Menu Categories Queries
export function useMenuCategories() {
  return useQuery({
    queryKey: ["menu-categories"],
    queryFn: getMenuCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMenuCategory(id: string) {
  return useQuery({
    queryKey: ["menu-category", id],
    queryFn: () => getMenuCategory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => createMenuCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
    },
  });
}

export function useUpdateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryDto) => updateMenuCategory(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["menu-category", variables.id],
      });
    },
  });
}

export function useDeleteMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMenuCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
    },
  });
}
