import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Invalid email or password. Please check your credentials and try again."
  ) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
  }
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  details?: unknown;
  timestamp: string;
  path: string;
  method: string;
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(
  error: unknown,
  request: NextRequest
): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString();
  const path = request.url;
  const method = request.method;

  let statusCode = 500;
  let message = "Internal server error";
  let errorType = "InternalServerError";
  let details: unknown = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorType = error.constructor.name;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    statusCode = 400;
    errorType = "DatabaseError";

    switch (error.code) {
      case "P2002":
        message = "Unique constraint violation";
        details = {
          field: error.meta?.target,
          code: error.code,
        };
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2003":
        message = "Foreign key constraint failed";
        break;
      case "P2014":
        message = "Invalid ID provided";
        break;
      default:
        message = "Database operation failed";
        details = { code: error.code };
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorType = "ValidationError";
    message = "Invalid database query parameters";
  } else if (error instanceof Error) {
    message = error.message;
    errorType = error.constructor.name;
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", {
      error,
      statusCode,
      message,
      path,
      method,
      timestamp,
    });
  }

  // Create user-friendly error response
  const errorResponse: ErrorResponse = {
    statusCode,
    message,
    timestamp,
    path,
    method,
  };

  // Only include technical details in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.error = errorType;
    if (details) {
      errorResponse.details = details;
    }
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Handle validation errors from Zod
 */
export function handleValidationError(
  errors: unknown[],
  request: NextRequest
): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString();
  const path = request.url;
  const method = request.method;

  // Create user-friendly error messages
  const userFriendlyErrors = errors.map((error: any) => {
    if (error.path && error.message) {
      const field = error.path.join(".");
      return `${field}: ${error.message}`;
    }
    return error.message || "Invalid input";
  });

  const errorResponse: ErrorResponse = {
    statusCode: 400,
    message: userFriendlyErrors.join("; "),
    timestamp,
    path,
    method,
  };

  // Only include technical details in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.error = "ValidationError";
    errorResponse.details = errors;
  }

  return NextResponse.json(errorResponse, { status: 400 });
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = "Success",
  statusCode: number = 200
): NextResponse<{
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}> {
  return NextResponse.json(
    {
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = "Success"
): NextResponse<{
  statusCode: number;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}> {
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    statusCode: 200,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}
