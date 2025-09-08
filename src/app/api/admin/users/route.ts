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
  return NextResponse.json(mockAdminUsers);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newUser = {
      id: (mockAdminUsers.length + 1).toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAdminUsers.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
