import { z } from "zod";

export const username = z
  .string()
  .min(1, { message: "Username is required" })
  .max(20, { message: "Maximum username length is 20" })
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
      message: "Username can only contain english letters, numbers, _ and -",
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
