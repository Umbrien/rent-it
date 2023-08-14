import { z } from "zod";

export const username = z
  .string()
  .min(1, { message: "username-required" })
  .max(20, { message: "max-username-length" })
  .refine(
    (username) =>
      username
        .split("")
        .every((char) =>
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-".includes(
            char
          )
        ),
    {
      message: "username-contains",
    }
  );

export const userSchema = z.object({
  id: z.number(),
  username,
  email: z.string(),
  password: z.string(),
  role: z.literal("USER").or(z.literal("ADMIN")),
  balance: z.number(),
});

export type InferredUser = z.infer<typeof userSchema>;
