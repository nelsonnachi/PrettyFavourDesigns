// lib/APIs/api-errors.ts

import { ZodError } from "zod";
import { NextResponse } from "next/server";

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    details?: unknown,
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ============================================================
// HANDLE API ERRORS
// ============================================================

export function handleApiError(error: unknown) {
  // ----------------------------------------------------------
  // Our custom API errors
  // ----------------------------------------------------------

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        ...(error.details !== undefined && {
          details: error.details,
        }),
      },
      {
        status: error.statusCode,
      },
    );
  }

  // ----------------------------------------------------------
  // Zod validation errors
  // ----------------------------------------------------------

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: error.issues,
      },
      {
        status: 422,
      },
    );
  }

  // ----------------------------------------------------------
  // Unknown errors
  // ----------------------------------------------------------

  console.error("Unhandled API error:", error);

  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
    },
    {
      status: 500,
    },
  );
}