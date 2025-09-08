import { NextRequest, NextResponse } from "next/server";

// Mock data for categories
const mockCategories = [
  {
    id: "burgers",
    name: "Burgers",
    description: "Our signature burgers made with premium ingredients",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop",
    order: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "sandwiches",
    name: "Sandwiches",
    description: "Delicious sandwiches and wraps",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=300&fit=crop",
    order: 2,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "sides",
    name: "Sides",
    description: "Perfect sides to complement your meal",
    image:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&h=300&fit=crop",
    order: 3,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Refreshing drinks and shakes",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop",
    order: 4,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  return NextResponse.json(mockCategories);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newCategory = {
      id: body.name.toLowerCase().replace(/\s+/g, "-"),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCategories.push(newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
