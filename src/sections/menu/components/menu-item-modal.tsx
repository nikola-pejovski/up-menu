import { MenuItem } from "@/types/api";
import FallbackImage from "@/components/fallback-image";
import { X } from "lucide-react";

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuItemModal({
  item,
  isOpen,
  onClose,
}: MenuItemModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100/50 max-w-4xl w-full h-[400px] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg border border-gray-200/50"
        >
          <X className="w-5 h-5 text-gray-600 hover:text-brand-brown transition-colors duration-200" />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section */}
          <div className="lg:w-1/2 relative">
            <div className="aspect-[4/3] lg:aspect-square relative overflow-hidden">
              <FallbackImage
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />

              {/* Featured Badge */}
              {item.isFeatured && (
                <div className="absolute top-6 left-6 bg-brand-orange/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  Featured
                </div>
              )}

              {/* Unavailable Overlay */}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-between h-full relative">
            {/* Section 1: Title, Category, Description */}
            <div>
              {/* Title */}
              <h1 className="font-coolvetica text-2xl font-light text-brand-dark tracking-wide mb-3">
                {item.name}
              </h1>

              {/* Category */}
              {item.category && (
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-brown text-xs rounded-full font-light border border-brand-orange/20">
                    {item.category.name}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Elegant divider line between sections 1 and 2 */}
            <div className="w-full h-px mt-1 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent"></div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent"></div>

            {/* Section 2: Ingredients and Allergens */}
            <div className="flex-1 flex flex-col justify-center space-y-3 relative">
              {/* Elegant bottom line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent"></div>
              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <h3 className="font-coolvetica text-sm font-medium text-brand-dark mb-2 tracking-wide">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {item.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-brand-orange/10 text-brand-brown text-xs rounded-full font-light border border-brand-orange/20"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              <div>
                <h3 className="font-coolvetica text-sm font-medium text-brand-dark mb-2 tracking-wide">
                  Allergens
                </h3>
                <div className="flex flex-wrap gap-1">
                  {item.allergens && item.allergens.length > 0 ? (
                    item.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-red-50/80 text-red-700 text-xs rounded-full border border-red-200/50 font-light"
                      >
                        {allergen}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 bg-brand-cream/80 text-brand-brown text-xs rounded-full border border-brand-orange/30 font-light">
                      No Allergens
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Elegant divider line between sections 2 and 3 */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent"></div>

            {/* Section 3: Price and Availability */}
            <div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-light">
                    Price
                  </span>
                  <div className="font-coolvetica text-2xl font-medium text-brand-orange">
                    ${parseFloat(item.price.toString()).toFixed(2)}
                  </div>
                </div>
                {item.isAvailable ? (
                  <div className="text-right">
                    <div className="text-xs text-green-600 font-medium">
                      Available
                    </div>
                    <div className="text-xs text-gray-500">Ready to order</div>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-xs text-red-600 font-medium">
                      Unavailable
                    </div>
                    <div className="text-xs text-gray-500">
                      Currently out of stock
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
