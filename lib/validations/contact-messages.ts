import { z } from "zod";

// ============================================================
// CREATE CONTACT MESSAGE
// ============================================================

export const createContactMessageSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name is required")
      .max(100),

    email: z
      .string()
      .email("Please provide a valid email"),

    phone: z
      .string()
      .trim()
      .max(30)
      .optional(),

    subject: z
      .string()
      .trim()
      .max(200)
      .optional(),

    message: z
      .string()
      .trim()
      .min(
        10,
        "Message must be at least 10 characters",
      )
      .max(
        5000,
        "Message is too long",
      ),
  });

// ============================================================
// UPDATE CONTACT MESSAGE
// ============================================================

export const updateContactMessageSchema =
  z.object({
    isRead: z.boolean(),
  });

// ============================================================
// CONTACT MESSAGE PARAMS
// ============================================================

export const contactMessageIdParamSchema =
  z.object({
    id: z
      .string()
      .uuid("Invalid message ID"),
  });
