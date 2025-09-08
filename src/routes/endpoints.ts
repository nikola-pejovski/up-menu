export const endpoints = {
  menu: {
    items: "/api/menu/items",
    item: (id: string) => `/api/menu/items/${id}`,
    categories: "/api/menu/categories",
    category: (id: string) => `/api/menu/categories/${id}`,
  },
  admin: {
    login: "/api/admin/auth/login",
    logout: "/api/admin/auth/logout",
    profile: "/api/admin/profile",
    users: "/api/admin/users",
    user: (id: string) => `/api/admin/users/${id}`,
  },
} as const;
