import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 to-red-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-600 rounded-full mb-4">
              <span className="text-white text-2xl font-bold">🍔</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Burger House
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Crafting the perfect burger experience with premium ingredients
              and authentic flavors
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-red-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
}
