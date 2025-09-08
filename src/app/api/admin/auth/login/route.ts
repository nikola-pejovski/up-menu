import { NextRequest, NextResponse } from "next/server";

// Mock admin users - in a real app, this would come from a database
const mockAdminUsers = [
  {
    id: "1",
    email: "admin@burgerhouse.com",
    password: "admin123", // In real app, this would be hashed
    name: "Admin User",
    role: "admin" as const,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "manager@burgerhouse.com",
    password: "manager123", // In real app, this would be hashed
    name: "Manager User",
    role: "manager" as const,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = mockAdminUsers.find(
      (u) => u.email === email && u.password === password && u.isActive
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // In a real app, you would generate a proper JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
