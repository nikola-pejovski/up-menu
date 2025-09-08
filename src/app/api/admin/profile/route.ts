import { NextRequest, NextResponse } from "next/server";

// Mock admin users - in a real app, this would come from a database
const mockAdminUsers = [
  {
    id: "1",
    email: "admin@burgerhouse.com",
    name: "Admin User",
    role: "admin" as const,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "manager@burgerhouse.com",
    name: "Manager User",
    role: "manager" as const,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  // In a real app, you would verify the JWT token and get the user ID
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // For demo purposes, return the first admin user
  // In a real app, you would extract the user ID from the JWT token
  const user = mockAdminUsers[0];

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
