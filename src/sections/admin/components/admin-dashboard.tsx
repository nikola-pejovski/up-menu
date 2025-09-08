"use client";

import { useState } from "react";
import {
  useMenuItems,
  useMenuCategories,
  useDeleteMenuItem,
} from "@/use-queries/menu";
import { useAdminUsers, useDeleteAdminUser } from "@/use-queries/admin";
import { MenuItem, AdminUser } from "@/types/api";
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
import { useRouter } from "next/navigation";

type TabType = "menu" | "users";

export default function AdminDashboard() {
  const router = useRouter();
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
    <div className="min-h-screen bg-brand-cream">
      {/* Beautiful Aesthetic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-brand-dark via-brand-brown to-brand-dark backdrop-blur-md border-b border-brand-orange/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left side - Brand */}
          <div className="flex items-center space-x-4">
            {/* Logo with elegant frame - Clickable */}
            <button
              onClick={() => router.push("/")}
              className="relative group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-0.5 group-hover:bg-white/20 transition-all duration-200">
                <img
                  src="/logo.png"
                  alt="Burger House Logo"
                  className="w-full h-full object-cover rounded-lg scale-110"
                />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl bg-brand-orange/20 blur-sm -z-10 group-hover:bg-brand-orange/30 transition-all duration-200"></div>
            </button>

            {/* Brand name with elegant styling */}
            <div className="flex flex-col">
              <h1 className="font-coolvetica text-2xl font-light text-white tracking-wide">
                Burger House
              </h1>
              <div className="h-px w-16 bg-gradient-to-r from-brand-orange to-transparent mt-1"></div>
            </div>
          </div>

          {/* Right side - Logout */}
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-coolvetica">
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* Elegant Tabs */}
        <div className="flex space-x-2 bg-white/60 backdrop-blur-sm p-2 rounded-2xl mb-8 border border-white/20 shadow-lg">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "menu"
                ? "bg-gradient-to-r from-brand-dark via-brand-brown to-brand-dark text-white shadow-lg"
                : "text-brand-dark hover:text-brand-brown hover:bg-white/40"
            }`}
          >
            <MenuIcon className="w-5 h-5" />
            <span className="font-coolvetica">Menu Items</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === "users"
                ? "bg-gradient-to-r from-brand-dark via-brand-brown to-brand-dark text-white shadow-lg"
                : "text-brand-dark hover:text-brand-brown hover:bg-white/40"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-coolvetica">Admin Users</span>
          </button>
        </div>

        {/* Menu Items Tab */}
        {activeTab === "menu" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-coolvetica text-3xl font-light text-brand-dark tracking-wide mb-2">
                  Menu Items
                </h2>
                <div className="h-px w-20 bg-gradient-to-r from-brand-orange to-transparent"></div>
              </div>
              <button
                onClick={handleAddItem}
                className="flex items-center space-x-3 bg-gradient-to-r from-brand-dark via-brand-brown to-brand-dark text-white px-6 py-3 rounded-xl hover:from-brand-brown hover:via-brand-orange hover:to-brand-brown transition-all duration-300 shadow-lg font-coolvetica"
              >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </div>

            {menuLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse"
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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-coolvetica text-xl font-light text-brand-dark tracking-wide">
                        {item.name}
                      </h3>
                      <span className="font-coolvetica text-xl font-light text-brand-brown">
                        ${parseFloat(item.price.toString()).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-brand-brown/80 text-sm mb-4 line-clamp-2 font-light flex-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? "bg-green-50/80 text-green-700 border border-green-200/50"
                            : "bg-red-50/80 text-red-700 border border-red-200/50"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2.5 text-brand-brown/60 hover:text-brand-brown hover:bg-brand-cream/50 rounded-xl transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all duration-200"
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-coolvetica text-3xl font-light text-brand-dark tracking-wide mb-2">
                  Admin Users
                </h2>
                <div className="h-px w-20 bg-gradient-to-r from-brand-orange to-transparent"></div>
              </div>
              <button
                onClick={handleAddUser}
                className="flex items-center space-x-3 bg-gradient-to-r from-brand-dark via-brand-brown to-brand-dark text-white px-6 py-3 rounded-xl hover:from-brand-brown hover:via-brand-orange hover:to-brand-brown transition-all duration-300 shadow-lg font-coolvetica"
              >
                <Plus className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>

            {usersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-pulse"
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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-coolvetica text-xl font-light text-brand-dark tracking-wide mb-1">
                          {user.name}
                        </h3>
                        <p className="text-brand-brown/80 font-light mb-3">
                          {user.email}
                        </p>
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-50/80 text-purple-700 border border-purple-200/50"
                              : "bg-blue-50/80 text-blue-700 border border-blue-200/50"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2.5 text-brand-brown/60 hover:text-brand-brown hover:bg-brand-cream/50 rounded-xl transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all duration-200"
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
