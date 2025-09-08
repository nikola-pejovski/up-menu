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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = mockAdminUsers.find((user) => user.id === id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userIndex = mockAdminUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = {
      ...mockAdminUsers[userIndex],
      ...body,
      id: id,
      updatedAt: new Date().toISOString(),
    };

    mockAdminUsers[userIndex] = updatedUser;

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userIndex = mockAdminUsers.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  mockAdminUsers.splice(userIndex, 1);

  return NextResponse.json({ message: "User deleted successfully" });
}
