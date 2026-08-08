import * as z from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least two characters")
    .max(50, "Name must be less than 50 characters"),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must be less that 50 characters"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;
