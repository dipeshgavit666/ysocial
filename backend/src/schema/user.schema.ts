import * as z from "zod";

// Name, email and avatar are managed by Clerk, so only app-owned profile
// fields can be edited here.
export const updateProfileSchema = z.object({
  bio: z.string().trim().max(200, "Bio cannot exceed 200 characters").optional(),
  website: z
    .union([z.literal(""), z.url("Invalid website URL").max(200)])
    .optional(),
  isPrivate: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
