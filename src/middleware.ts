import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();

    // Get the origin from the request
    const origin = request.headers.get("origin");

    // Define allowed origins
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://up-menu.vercel.app", // Add your Vercel domain here
      "https://menu.nikolapejovski.com", // Add your production domain
      process.env.CORS_ORIGIN || "http://localhost:3000",
    ];

    // Check if origin is allowed
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else if (!origin) {
      // Allow requests without origin (like Postman, curl, etc.)
      response.headers.set("Access-Control-Allow-Origin", "*");
    }

    // Set CORS headers
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token, X-Requested-With"
    );

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
