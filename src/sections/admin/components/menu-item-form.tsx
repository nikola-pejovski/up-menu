"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MenuItem,
  MenuCategory,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from "@/types/api";
import { useCreateMenuItem, useUpdateMenuItem } from "@/use-queries/menu";
import { X, Plus, Trash2 } from "lucide-react";

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  image: z.string().url("Please enter a valid image URL"),
  category: z.string().min(1, "Category is required"),
  isAvailable: z.boolean(),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  item?: MenuItem;
  categories: MenuCategory[];
  onClose: () => void;
}

export default function MenuItemForm({
  item,
  categories,
  onClose,
}: MenuItemFormProps) {
  const [ingredients, setIngredients] = useState<string[]>(
    item?.ingredients || []
  );
  const [allergens, setAllergens] = useState<string[]>(item?.allergens || []);
  const [newIngredient, setNewIngredient] = useState("");
  const [newAllergen, setNewAllergen] = useState("");

  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 0,
      image: item?.image || "",
      category: item?.category || "",
      isAvailable: item?.isAvailable ?? true,
      ingredients: item?.ingredients || [],
      allergens: item?.allergens || [],
    },
  });

  const onSubmit = async (data: MenuItemFormData) => {
    const formData = {
      ...data,
      ingredients,
      allergens,
    };

    try {
      if (item) {
        await updateMutation.mutateAsync({ ...formData, id: item.id });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !allergens.includes(newAllergen.trim())) {
      setAllergens([...allergens, newAllergen.trim()]);
      setNewAllergen("");
    }
  };

  const removeAllergen = (index: number) => {
    setAllergens(allergens.filter((_, i) => i !== index));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {item ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                {...register("name")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Burger Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe the menu item..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              {...register("image")}
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                {...register("isAvailable")}
                type="checkbox"
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Available
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Add ingredient"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addIngredient())
                }
              />
              <button
                type="button"
                onClick={addIngredient}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergens
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Add allergen"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAllergen())
                }
              />
              <button
                type="button"
                onClick={addAllergen}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allergens.map((allergen, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                >
                  {allergen}
                  <button
                    type="button"
                    onClick={() => removeAllergen(index)}
                    className="hover:text-red-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : item ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
