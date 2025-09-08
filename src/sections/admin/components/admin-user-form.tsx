"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminUser, CreateAdminUserDto, UpdateAdminUserDto } from "@/types/api";
import { useCreateAdminUser, useUpdateAdminUser } from "@/use-queries/admin";
import { X, Eye, EyeOff } from "lucide-react";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["admin", "manager"], {
    required_error: "Please select a role",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

interface AdminUserFormProps {
  user?: AdminUser;
  onClose: () => void;
}

export default function AdminUserForm({ user, onClose }: AdminUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "manager",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (user) {
        // Update existing user
        const updateData: UpdateAdminUserDto = {
          id: user.id,
          name: data.name,
          email: data.email,
          role: data.role,
        };

        // Only include password if it's provided
        if (data.password && data.password.trim()) {
          updateData.password = data.password;
        }

        await updateMutation.mutateAsync(updateData);
      } else {
        // Create new user
        if (!data.password) {
          throw new Error("Password is required for new users");
        }

        const createData: CreateAdminUserDto = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        };

        await createMutation.mutateAsync(createData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {user ? "Edit User" : "Add User"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="john@burgerhouse.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password {!user && "*"}
              {user && (
                <span className="text-gray-500 text-sm">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder={user ? "Enter new password" : "Enter password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Role *
            </label>
            <select
              {...register("role")}
              id="role"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            >
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {(createMutation.error || updateMutation.error) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {createMutation.error?.message ||
                  updateMutation.error?.message ||
                  "An error occurred. Please try again."}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : user ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
