import { NextRequest, NextResponse } from "next/server";

// Mock data for development
const mockMenuItems = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    description:
      "Our signature beef patty with melted cheddar cheese, fresh lettuce, tomato, and our special sauce on a toasted brioche bun.",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
    category: "burgers",
    isAvailable: true,
    ingredients: [
      "Beef Patty",
      "Cheddar Cheese",
      "Lettuce",
      "Tomato",
      "Special Sauce",
      "Brioche Bun",
    ],
    allergens: ["Dairy", "Gluten"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Bacon Deluxe",
    description:
      "Double beef patty with crispy bacon, Swiss cheese, caramelized onions, and BBQ sauce.",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=500&fit=crop",
    category: "burgers",
    isAvailable: true,
    ingredients: [
      "Double Beef Patty",
      "Bacon",
      "Swiss Cheese",
      "Caramelized Onions",
      "BBQ Sauce",
      "Brioche Bun",
    ],
    allergens: ["Dairy", "Gluten"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Veggie Supreme",
    description:
      "Plant-based patty with avocado, sprouts, cucumber, and vegan mayo on a whole grain bun.",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=500&fit=crop",
    category: "burgers",
    isAvailable: true,
    ingredients: [
      "Plant-based Patty",
      "Avocado",
      "Sprouts",
      "Cucumber",
      "Vegan Mayo",
      "Whole Grain Bun",
    ],
    allergens: ["Gluten"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Crispy Chicken Sandwich",
    description:
      "Hand-breaded chicken breast with coleslaw, pickles, and spicy mayo on a brioche bun.",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=500&fit=crop",
    category: "sandwiches",
    isAvailable: true,
    ingredients: [
      "Chicken Breast",
      "Coleslaw",
      "Pickles",
      "Spicy Mayo",
      "Brioche Bun",
    ],
    allergens: ["Dairy", "Gluten", "Eggs"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Loaded Fries",
    description:
      "Crispy golden fries topped with cheese sauce, bacon bits, and green onions.",
    price: 8.99,
    image:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&h=500&fit=crop",
    category: "sides",
    isAvailable: true,
    ingredients: ["Potatoes", "Cheese Sauce", "Bacon Bits", "Green Onions"],
    allergens: ["Dairy"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Onion Rings",
    description: "Beer-battered onion rings served with ranch dipping sauce.",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=500&fit=crop",
    category: "sides",
    isAvailable: true,
    ingredients: ["Onions", "Beer Batter", "Ranch Sauce"],
    allergens: ["Dairy", "Gluten"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "7",
    name: "Chocolate Milkshake",
    description:
      "Rich and creamy chocolate milkshake topped with whipped cream and chocolate shavings.",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=500&fit=crop",
    category: "beverages",
    isAvailable: true,
    ingredients: [
      "Chocolate Ice Cream",
      "Milk",
      "Whipped Cream",
      "Chocolate Shavings",
    ],
    allergens: ["Dairy"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    name: "Strawberry Smoothie",
    description: "Fresh strawberry smoothie with banana and yogurt.",
    price: 4.99,
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&h=500&fit=crop",
    category: "beverages",
    isAvailable: false,
    ingredients: ["Strawberries", "Banana", "Yogurt", "Honey"],
    allergens: ["Dairy"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let filteredItems = mockMenuItems;
  if (category && category !== "all") {
    filteredItems = mockMenuItems.filter((item) => item.category === category);
  }

  return NextResponse.json(filteredItems);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newItem = {
      id: (mockMenuItems.length + 1).toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockMenuItems.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
