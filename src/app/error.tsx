"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-0.5 mx-auto">
            <img
              src="/logo.png"
              alt="Burger House Logo"
              className="w-full h-full object-cover rounded-lg scale-110"
            />
          </div>
        </div>

        <h1 className="font-coolvetica text-4xl font-light text-brand-dark tracking-wide mb-4">
          Something went wrong!
        </h1>

        <p className="text-brand-dark/70 mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try again or return to the
          menu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-gradient-to-r from-brand-orange to-brand-brown text-white font-medium rounded-xl hover:from-brand-brown hover:to-brand-orange transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Try again
          </button>

          <Link
            href="/"
            className="px-8 py-3 bg-white/80 backdrop-blur-sm text-brand-dark font-medium rounded-xl border border-brand-orange/20 hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
