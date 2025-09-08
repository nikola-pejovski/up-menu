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
    {
      id: "all",
      name: "All Items",
      description: "View all menu items",
    },
    ...categories.filter((cat) => cat.isActive),
  ];

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-2 justify-center">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? "bg-brand-orange text-white shadow-sm"
                : "bg-white/60 text-brand-brown hover:bg-brand-orange/10 hover:text-brand-dark border border-brand-orange/20"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
