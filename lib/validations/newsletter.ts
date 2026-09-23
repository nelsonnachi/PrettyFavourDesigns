import { z } from "zod";

// ============================================================
// SUBSCRIBE
// ============================================================

export const subscribeNewsletterSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});

// ============================================================
// UNSUBSCRIBE
// ============================================================

export const unsubscribeNewsletterSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});
