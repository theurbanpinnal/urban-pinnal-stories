import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email must be less than 254 characters"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  // Honeypot field for spam protection
  _honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email must be less than 254 characters"),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;
