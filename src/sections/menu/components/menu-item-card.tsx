import { MenuItem } from "@/types/api";
import FallbackImage from "@/components/fallback-image";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="aspect-square relative overflow-hidden">
        <FallbackImage
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium text-lg">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
          <span className="text-2xl font-bold text-orange-600">
            ${parseFloat(item.price.toString()).toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {item.description}
        </p>

        {item.ingredients && item.ingredients.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">Ingredients:</p>
            <div className="flex flex-wrap gap-1">
              {item.ingredients.slice(0, 3).map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {ingredient}
                </span>
              ))}
              {item.ingredients.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{item.ingredients.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {item.allergens && item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.allergens.map((allergen, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
