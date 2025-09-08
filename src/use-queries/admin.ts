import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/api/admin";
import { LoginDto, CreateAdminUserDto, UpdateAdminUserDto } from "@/types/api";

// Auth Queries
export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDto) => adminLogin(data),
    onSuccess: (data) => {
      console.log("Login successful, data:", data);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_token", data.accessToken);
        localStorage.setItem("admin_refresh_token", data.refreshToken);
        console.log("Tokens stored in localStorage");
      }
      // Set the profile data and invalidate to refetch
      queryClient.setQueryData(["admin-profile"], data.user);
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      console.log("Profile data set in query cache");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminLogout,
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_refresh_token");
      }
      // Clear all queries and reset the profile
      queryClient.clear();
      queryClient.setQueryData(["admin-profile"], null);
    },
    onError: () => {
      // Even if the API call fails, clear local data
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_refresh_token");
      }
      queryClient.clear();
      queryClient.setQueryData(["admin-profile"], null);
    },
  });
}

export function useAdminProfile() {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Admin Users Queries
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getAdminUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminUserDto) => createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAdminUserDto) => updateAdminUser(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", variables.id] });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
