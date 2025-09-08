"use client";

import { useState } from "react";
import { MenuCategory } from "@/types/api";

interface CategorySelectorProps {
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  const allCategories = [
    { id: "all", name: "All Items", description: "View all menu items" },
    ...categories.filter((cat) => cat.isActive),
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {allCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
            selectedCategory === category.id
              ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-orange-300"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
