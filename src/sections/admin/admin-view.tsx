"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "./components";
import { useAdminProfile } from "@/use-queries/admin";

export default function AdminView() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useAdminProfile();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (error && !isLoading) {
      router.push("/admin/login");
    }
  }, [error, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-sm font-bold">🍔</span>
          </div>
          <p className="text-gray-600">Loading...</p>
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
