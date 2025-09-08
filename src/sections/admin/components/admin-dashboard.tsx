"use client";

import { useState } from "react";
import {
  useMenuItems,
  useMenuCategories,
  useDeleteMenuItem,
} from "@/use-queries/menu";
import { useAdminUsers, useDeleteAdminUser } from "@/use-queries/admin";
import { MenuItem, MenuCategory, AdminUser } from "@/types/api";
import MenuItemForm from "./menu-item-form";
import AdminUserForm from "./admin-user-form";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Menu as MenuIcon,
  LogOut,
} from "lucide-react";
import { useAdminLogout } from "@/use-queries/admin";

type TabType = "menu" | "users";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("menu");
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>();

  const { data: menuItems = [], isLoading: menuLoading } = useMenuItems();
  const { data: categories = [] } = useMenuCategories();
  const { data: adminUsers = [], isLoading: usersLoading } = useAdminUsers();

  const deleteMenuItemMutation = useDeleteMenuItem();
  const deleteUserMutation = useDeleteAdminUser();
  const logoutMutation = useAdminLogout();

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowMenuItemForm(true);
  };

  const handleAddItem = () => {
    setEditingItem(undefined);
    setShowMenuItemForm(true);
  };

  const handleCloseForm = () => {
    setShowMenuItemForm(false);
    setEditingItem(undefined);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      await deleteMenuItemMutation.mutateAsync(id);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUserMutation.mutateAsync(id);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleAddUser = () => {
    setEditingUser(undefined);
    setShowUserForm(true);
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
    setEditingUser(undefined);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Even if logout fails, we still want to clear local data
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🍔</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Burger House Admin
              </h1>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              <span>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "menu"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <MenuIcon className="w-4 h-4" />
            <span>Menu Items</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "users"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Admin Users</span>
          </button>
        </div>

        {/* Menu Items Tab */}
        {activeTab === "menu" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
              <button
                onClick={handleAddItem}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            {menuLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-orange-600">
                        ${parseFloat(item.price.toString()).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Admin Users</h2>
              <button
                onClick={handleAddUser}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            {usersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {adminUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Item Form Modal */}
      {showMenuItemForm && (
        <MenuItemForm
          item={editingItem}
          categories={categories}
          onClose={handleCloseForm}
        />
      )}

      {/* Admin User Form Modal */}
      {showUserForm && (
        <AdminUserForm user={editingUser} onClose={handleCloseUserForm} />
      )}
    </div>
  );
}
