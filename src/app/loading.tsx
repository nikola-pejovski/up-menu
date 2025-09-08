export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo with elegant frame and animation */}
        <div className="relative">
          <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-0.5 animate-pulse">
            <img
              src="/logo.png"
              alt="Burger House Logo"
              className="w-full h-full object-cover rounded-lg scale-110 animate-spin"
              style={{ animationDuration: "3s" }}
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
