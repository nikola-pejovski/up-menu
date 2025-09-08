"use client";

import { useState } from "react";
import { CategorySelector, MenuItemCard } from "./components";
import MenuItemModal from "./components/menu-item-modal";
import { useMenuItems, useMenuCategories } from "@/use-queries/menu";
import { MenuItem } from "@/types/api";

export default function MenuView() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: categories = [] } = useMenuCategories();
  const { data: menuItems = [], isLoading } = useMenuItems(
    selectedCategory === "all" ? undefined : selectedCategory
  );

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Beautiful Aesthetic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-brand-dark via-brand-brown to-brand-dark backdrop-blur-md border-b border-brand-orange/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left side - Brand */}
          <div className="flex items-center space-x-4">
            {/* Logo with elegant frame */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-0.5">
                <img
                  src="/logo.png"
                  alt="Burger House Logo"
                  className="w-full h-full object-cover rounded-lg scale-110"
                />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl bg-brand-orange/20 blur-sm -z-10"></div>
            </div>

            {/* Brand name with elegant styling */}
            <div className="flex flex-col">
              <h1 className="font-coolvetica text-2xl font-light text-white tracking-wider">
                Burger House
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-brand-orange to-transparent mt-1"></div>
            </div>
          </div>

          {/* Right side - Decorative elements */}
          <div className="flex items-center space-x-3">
            {/* Elegant dots */}
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-brand-orange rounded-full opacity-80"></div>
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full opacity-60"></div>
              <div className="w-1.5 h-1.5 bg-brand-orange rounded-full opacity-80"></div>
            </div>

            {/* Subtle accent line */}
            <div className="w-px h-6 bg-white/20"></div>

            {/* Menu indicator */}
            <div className="text-white/80 text-sm font-light tracking-wide">
              MENU
            </div>
          </div>
        </div>

        {/* Subtle bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"></div>
      </header>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Beautiful Menu Introduction */}
        <div className="text-center mb-20">
          <div className="relative">
            {/* Decorative line above */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent mx-auto mb-8"></div>

            {/* Main title */}
            <h2 className="font-coolvetica text-4xl font-light text-brand-dark mb-6 tracking-wide">
              Our Menu
            </h2>

            {/* Decorative line below title */}
            <div className="w-16 h-px bg-brand-orange mx-auto mb-8"></div>

            {/* Beautiful description */}
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-brand-brown leading-relaxed mb-4">
                Carefully crafted dishes made with premium ingredients and
                attention to detail.
              </p>
              <p className="text-sm text-gray-500 italic">
                Each recipe tells a story of passion, quality, and culinary
                excellence
              </p>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
              <div className="w-1 h-1 bg-brand-brown rounded-full"></div>
              <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="font-coolvetica text-lg font-medium text-brand-dark mb-3">
              No items available
            </h3>
            <p className="text-brand-brown max-w-md mx-auto">
              {selectedCategory === "all"
                ? "Our menu is being updated. Please check back soon."
                : "No items available in this category."}
            </p>
          </div>
        )}
      </div>

      {/* Menu Item Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
