import { MenuItem } from "@/types/api";
import FallbackImage from "@/components/fallback-image";

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

export default function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  return (
    <div
      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container - Shorter aspect ratio */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <FallbackImage
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {item.isFeatured && (
          <div className="absolute top-3 left-3 bg-brand-orange/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            Featured
          </div>
        )}

        {/* Unavailable Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-medium">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-coolvetica text-lg font-medium text-brand-dark group-hover:text-brand-orange transition-colors">
            {item.name}
          </h3>
          <span className="font-coolvetica text-lg font-medium text-brand-orange">
            ${parseFloat(item.price.toString()).toFixed(2)}
          </span>
        </div>

        {/* Category */}
        {item.category && (
          <p className="text-sm text-brand-brown mb-2 font-light">
            {item.category.name}
          </p>
        )}

        {/* Description - Truncated */}
        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Ingredients - Show only first 2 */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {item.ingredients.slice(0, 2).map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-brand-orange/10 text-brand-brown text-xs rounded-full font-light"
                >
                  {ingredient}
                </span>
              ))}
              {item.ingredients.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-100/60 text-gray-600 text-xs rounded-full font-light">
                  +{item.ingredients.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Allergens - Show only first 2 */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.allergens.slice(0, 2).map((allergen, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-red-50/60 text-red-700 text-xs rounded-full border border-red-200/50 font-light"
              >
                {allergen}
              </span>
            ))}
            {item.allergens.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100/60 text-gray-600 text-xs rounded-full font-light">
                +{item.allergens.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
