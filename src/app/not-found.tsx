import Link from "next/link";

export default function NotFound() {
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

        <h1 className="font-coolvetica text-6xl font-light text-brand-dark tracking-wide mb-4">
          404
        </h1>

        <h2 className="font-coolvetica text-2xl font-light text-brand-brown mb-6">
          Page Not Found
        </h2>

        <p className="text-brand-dark/70 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-brand-orange to-brand-brown text-white font-medium rounded-xl hover:from-brand-brown hover:to-brand-orange transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
