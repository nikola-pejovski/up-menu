import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const managerPassword = await bcrypt.hash("manager123", 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@upmenu.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@upmenu.com",
      password: adminPassword,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
  });

  const manager = await prisma.adminUser.upsert({
    where: { email: "manager@upmenu.com" },
    update: {},
    create: {
      name: "Manager User",
      email: "manager@upmenu.com",
      password: managerPassword,
      role: UserRole.MANAGER,
      status: "ACTIVE",
    },
  });

  console.log("✅ Created admin users:", {
    admin: admin.email,
    manager: manager.email,
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "appetizers" },
      update: {},
      create: {
        name: "Appetizers",
        slug: "appetizers",
        description: "Start your meal with our delicious appetizers",
        image:
          "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop",
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "main-courses" },
      update: {},
      create: {
        name: "Main Courses",
        slug: "main-courses",
        description: "Hearty main dishes to satisfy your hunger",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "desserts" },
      update: {},
      create: {
        name: "Desserts",
        slug: "desserts",
        description: "Sweet treats to end your meal perfectly",
        image:
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop",
        isActive: true,
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "beverages" },
      update: {},
      create: {
        name: "Beverages",
        slug: "beverages",
        description: "Refreshing drinks to complement your meal",
        image:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=600&fit=crop",
        isActive: true,
        sortOrder: 4,
      },
    }),
  ]);

  console.log(
    "✅ Created categories:",
    categories.map((c) => c.name)
  );

  // Create menu items
  const menuItems = await Promise.all([
    // Appetizers
    prisma.menuItem.upsert({
      where: { slug: "bruschetta" },
      update: {},
      create: {
        name: "Bruschetta",
        slug: "bruschetta",
        description:
          "Toasted bread topped with fresh tomatoes, basil, and garlic",
        image:
          "https://images.unsplash.com/photo-1572441713132-51c75654db73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        price: 8.99,
        categoryId: categories[0].id,
        isAvailable: true,
        isFeatured: true,
        sortOrder: 1,
        ingredients: ["Bread", "Tomatoes", "Basil", "Garlic", "Olive Oil"],
        allergens: ["Gluten"],
        nutritionInfo: {
          calories: 180,
          protein: 6,
          carbs: 24,
          fat: 7,
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { slug: "caesar-salad" },
      update: {},
      create: {
        name: "Caesar Salad",
        slug: "caesar-salad",
        description: "Crisp romaine lettuce with parmesan cheese and croutons",
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop",
        price: 12.99,
        categoryId: categories[0].id,
        isAvailable: true,
        isFeatured: false,
        sortOrder: 2,
        ingredients: [
          "Romaine Lettuce",
          "Parmesan",
          "Croutons",
          "Caesar Dressing",
        ],
        allergens: ["Dairy", "Gluten"],
        nutritionInfo: {
          calories: 220,
          protein: 8,
          carbs: 12,
          fat: 16,
        },
      },
    }),

    // Main Courses
    prisma.menuItem.upsert({
      where: { slug: "grilled-salmon" },
      update: {},
      create: {
        name: "Grilled Salmon",
        slug: "grilled-salmon",
        description: "Fresh Atlantic salmon grilled to perfection with herbs",
        image:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
        price: 24.99,
        categoryId: categories[1].id,
        isAvailable: true,
        isFeatured: true,
        sortOrder: 1,
        ingredients: ["Salmon", "Herbs", "Lemon", "Olive Oil"],
        allergens: ["Fish"],
        nutritionInfo: {
          calories: 320,
          protein: 35,
          carbs: 2,
          fat: 18,
        },
      },
    }),
    prisma.menuItem.upsert({
      where: { slug: "beef-burger" },
      update: {},
      create: {
        name: "Classic Beef Burger",
        slug: "beef-burger",
        description:
          "Juicy beef patty with lettuce, tomato, and our special sauce",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
        price: 16.99,
        categoryId: categories[1].id,
        isAvailable: true,
        isFeatured: true,
        sortOrder: 2,
        ingredients: [
          "Beef Patty",
          "Bun",
          "Lettuce",
          "Tomato",
          "Special Sauce",
        ],
        allergens: ["Gluten", "Dairy"],
        nutritionInfo: {
          calories: 580,
          protein: 28,
          carbs: 45,
          fat: 32,
        },
      },
    }),

    // Desserts
    prisma.menuItem.upsert({
      where: { slug: "chocolate-cake" },
      update: {},
      create: {
        name: "Chocolate Lava Cake",
        slug: "chocolate-cake",
        description:
          "Warm chocolate cake with molten center, served with vanilla ice cream",
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
        price: 9.99,
        categoryId: categories[2].id,
        isAvailable: true,
        isFeatured: true,
        sortOrder: 1,
        ingredients: [
          "Chocolate",
          "Flour",
          "Eggs",
          "Butter",
          "Vanilla Ice Cream",
        ],
        allergens: ["Gluten", "Dairy", "Eggs"],
        nutritionInfo: {
          calories: 450,
          protein: 8,
          carbs: 52,
          fat: 24,
        },
      },
    }),

    // Beverages
    prisma.menuItem.upsert({
      where: { slug: "fresh-lemonade" },
      update: {},
      create: {
        name: "Fresh Lemonade",
        slug: "fresh-lemonade",
        description: "House-made lemonade with fresh lemons and mint",
        image:
          "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&h=600&fit=crop",
        price: 4.99,
        categoryId: categories[3].id,
        isAvailable: true,
        isFeatured: false,
        sortOrder: 1,
        ingredients: ["Fresh Lemons", "Sugar", "Mint", "Water"],
        allergens: [],
        nutritionInfo: {
          calories: 120,
          protein: 0,
          carbs: 32,
          fat: 0,
        },
      },
    }),
  ]);

  console.log(
    "✅ Created menu items:",
    menuItems.map((m) => m.name)
  );

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
