"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminUser, CreateAdminUserDto, UpdateAdminUserDto } from "@/types/api";
import { useCreateAdminUser, useUpdateAdminUser } from "@/use-queries/admin";
import { X, Eye, EyeOff } from "lucide-react";
import CustomSelect from "@/components/ui/custom-select";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If password is provided, validate it
        if (val && val.trim()) {
          return val.length >= 8 && val.length <= 128;
        }
        // If empty, it's valid (optional)
        return true;
      },
      {
        message:
          "Password must be at least 8 characters and less than 128 characters",
      }
    )
    .refine(
      (val) => {
        // If password is provided, validate complexity
        if (val && val.trim()) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
            val
          );
        }
        // If empty, it's valid (optional)
        return true;
      },
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
  role: z.enum(["ADMIN", "MANAGER"]),
});

type UserFormData = z.infer<typeof userSchema>;

interface AdminUserFormProps {
  user?: AdminUser;
  onClose: () => void;
}

export default function AdminUserForm({ user, onClose }: AdminUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "ADMIN",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      setErrorMessage(""); // Clear previous errors

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
          setErrorMessage("Password is required for new users");
          return;
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
    } catch (error: unknown) {
      console.error("Form submission error:", error);

      // Extract user-friendly error message
      let message = "An unexpected error occurred";

      if (error && typeof error === "object" && "response" in error) {
        const errorWithResponse = error as {
          response?: { data?: { message?: string } };
        };
        if (errorWithResponse.response?.data?.message) {
          message = errorWithResponse.response.data.message;
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const errorWithMessage = error as { message: string };
        message = errorWithMessage.message;
      }

      setErrorMessage(message);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-brand-orange/20">
          <div>
            <h2 className="font-coolvetica text-2xl font-light text-brand-dark tracking-wide">
              {user ? "Edit User" : "Add User"}
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-brand-orange to-transparent mt-2"></div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-brand-cream/50 rounded-xl transition-all duration-200 text-brand-brown/60 hover:text-brand-brown"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {errorMessage && (
            <div className="bg-red-50/80 border border-red-200/50 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-brand-dark font-coolvetica mb-2"
            >
              Full Name *
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-200/50 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 bg-white/60 backdrop-blur-sm transition-all duration-200"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-dark font-coolvetica mb-2"
            >
              Email Address *
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-200/50 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 bg-white/60 backdrop-blur-sm transition-all duration-200"
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
              className="block text-sm font-medium text-brand-dark font-coolvetica mb-2"
            >
              Password {!user && "*"}
              {user && (
                <span className="text-brand-brown/60 text-sm">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-3 pr-12 border border-gray-200/50 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 bg-white/60 backdrop-blur-sm transition-all duration-200"
                placeholder={user ? "Enter new password" : "Enter password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-brand-cream/50 rounded-xl transition-all duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-brand-brown/60" />
                ) : (
                  <Eye className="w-5 h-5 text-brand-brown/60" />
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
              className="block text-sm font-medium text-brand-dark font-coolvetica mb-2"
            >
              Role *
            </label>
            <CustomSelect
              options={[
                { value: "MANAGER", label: "Manager" },
                { value: "ADMIN", label: "Admin" },
              ]}
              value={watch("role") || "ADMIN"}
              onChange={(value) =>
                setValue("role", value as "ADMIN" | "MANAGER")
              }
              placeholder="Select a role"
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {(createMutation.error || updateMutation.error) && (
            <div className="p-4 bg-red-50/80 border border-red-200/50 rounded-xl backdrop-blur-sm">
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
              className="flex-1 px-6 py-3 border border-gray-200/50 text-brand-dark rounded-xl hover:bg-brand-cream/50 transition-all duration-200 font-coolvetica"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-brand-dark via-brand-brown to-brand-dark text-white py-3 px-6 rounded-xl font-medium hover:from-brand-brown hover:via-brand-orange hover:to-brand-brown focus:ring-2 focus:ring-brand-orange/50 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-coolvetica"
            >
              {isLoading ? "Saving..." : user ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
