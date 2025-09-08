"use client";

import { useEffect } from "react";

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
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                console.error("Logo failed to load:", e);
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        <h1 className="font-coolvetica text-6xl font-light text-brand-dark tracking-wide mb-4">
          Oops!
        </h1>
        <p className="text-brand-brown text-lg mb-8 max-w-md mx-auto">
          Something went wrong. Don&apos;t worry, our chefs are working on it!
        </p>
        <button
          onClick={reset}
          className="bg-brand-orange text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-orange/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
