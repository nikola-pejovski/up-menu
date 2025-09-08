"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "./components";
import { useAdminProfile } from "@/use-queries/admin";

export default function AdminView() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useAdminProfile();

  useEffect(() => {
    // Debug logging
    console.log("AdminView - Profile state:", { profile, isLoading, error });

    // Redirect to login if not authenticated (but give it a moment to retry)
    if (error && !isLoading) {
      console.log("AdminView - Redirecting to login due to error:", error);
      const timer = setTimeout(() => {
        router.push("/admin/login");
      }, 1000); // Wait 1 second before redirecting

      return () => clearTimeout(timer);
    }
  }, [error, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo with elegant frame and animation */}
          <div className="relative">
            <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-0.5 animate-pulse">
              <img
                src="/logo.png"
                alt="Burger House Logo"
                className="w-full h-full object-contain rounded-lg animate-spin"
                style={{ animationDuration: "3s" }}
                onError={(e) => {
                  console.error("Logo failed to load:", e);
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-xl bg-brand-orange/20 blur-sm -z-10 animate-pulse"></div>
          </div>

          {/* Brand name with elegant styling */}
          <div className="flex flex-col items-center">
            <h1 className="font-coolvetica text-3xl font-light text-brand-dark tracking-wide animate-pulse">
              Burger House
            </h1>
            <div className="h-px w-20 bg-gradient-to-r from-brand-orange to-transparent mt-2 animate-pulse"></div>
          </div>

          {/* Loading dots */}
          <div className="flex space-x-2">
            <div
              className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!profile) {
    return null;
  }

  // If we have a profile, show the dashboard
  return <AdminDashboard />;
}
