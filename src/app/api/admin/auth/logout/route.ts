import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // In a real app, you would invalidate the JWT token
  return NextResponse.json({ message: "Logged out successfully" });
}
