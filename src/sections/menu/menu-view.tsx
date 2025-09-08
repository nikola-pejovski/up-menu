"use client";

import { useState } from "react";
import { HeroSection, CategorySelector, MenuItemCard } from "./components";
import { useMenuItems, useMenuCategories } from "@/use-queries/menu";

export default function MenuView() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: categories = [] } = useMenuCategories();
  const { data: menuItems = [], isLoading } = useMenuItems(
    selectedCategory === "all" ? undefined : selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Menu Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully crafted selection of burgers, sides, and
            beverages. Each item is prepared with the finest ingredients and
            attention to detail.
          </p>
        </div>

        {/* Category Selector */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍔</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              {selectedCategory === "all"
                ? "Our menu is being updated. Please check back soon!"
                : "No items available in this category at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
