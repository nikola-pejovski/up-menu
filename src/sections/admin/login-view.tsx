"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminLogin } from "@/use-queries/admin";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      router.push("/admin");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-0.5">
              <img
                src="/logo.png"
                alt="Burger House Logo"
                className="w-full h-full object-cover rounded-lg scale-110"
              />
            </div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-xl bg-brand-orange/20 blur-sm -z-10"></div>
          </div>
        </div>
        <h2 className="mt-2 text-center font-coolvetica text-3xl font-light text-brand-dark tracking-wide">
          Burger House Admin
        </h2>
        <p className="mt-2 text-center text-sm text-brand-brown font-light">
          Sign in to access the admin panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-lg border border-gray-100/50 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-dark font-coolvetica"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register("email")}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200/50 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 bg-white/60 backdrop-blur-sm transition-all duration-200 sm:text-sm"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-dark font-coolvetica"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-200/50 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 bg-white/60 backdrop-blur-sm transition-all duration-200 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.error && (
              <div className="bg-red-50/80 border border-red-200/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-red-600 font-light">
                  {loginMutation.error.message || "Invalid email or password"}
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-brand-dark via-brand-brown to-brand-dark hover:from-brand-brown hover:via-brand-orange hover:to-brand-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-coolvetica"
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Credentials
                </span>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-600 mb-2">
                Use these credentials to sign in:
              </p>
              <div className="text-sm">
                <p className="text-gray-700">
                  <strong>Email:</strong> admin@upmenu.com
                </p>
                <p className="text-gray-700">
                  <strong>Password:</strong> admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
