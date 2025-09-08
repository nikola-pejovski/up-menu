import {
  AdminUser,
  PaginatedResponseDto,
  CreateAdminUserDto,
  UpdateAdminUserDto,
  LoginDto,
  AuthResponse,
} from "@/types/api";
import axios from "@/utils/axios";
import { endpoints } from "@/routes/endpoints";

// Auth API
export async function adminLogin(data: LoginDto): Promise<AuthResponse> {
  const response = await axios.post(endpoints.admin.login, data);
  return response.data;
}

export async function adminLogout(): Promise<void> {
  await axios.post(endpoints.admin.logout);
}

export async function getAdminProfile(): Promise<AdminUser> {
  const response = await axios.get(endpoints.admin.profile);
  return response.data;
}

// Admin Users API
export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await axios.get(endpoints.admin.users);
  return response.data;
}

export async function getAdminUser(id: string): Promise<AdminUser> {
  const response = await axios.get(endpoints.admin.user(id));
  return response.data;
}

export async function createAdminUser(
  data: CreateAdminUserDto
): Promise<AdminUser> {
  const response = await axios.post(endpoints.admin.users, data);
  return response.data;
}

export async function updateAdminUser(
  data: UpdateAdminUserDto
): Promise<AdminUser> {
  const response = await axios.put(endpoints.admin.user(data.id), data);
  return response.data;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await axios.delete(endpoints.admin.user(id));
}
