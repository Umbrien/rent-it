import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { userSchema } from "@/utils/schemas";
import { prisma } from "@/server/db";

export const publicRouter = createTRPCRouter({
  login: publicProcedure
    .input(userSchema.pick({ email: true, password: true }))
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error("No user found");
      }
      if (user.password !== password) {
        throw new Error("Invalid password");
      }
      return {
        user,
      };
    }),
  register: publicProcedure
    .input(userSchema.pick({ email: true, password: true, username: true }))
    .mutation(async ({ input }) => {
      const { email, password, username } = input;

      const [existingUserEmail, existingUserUsername] = await Promise.all([
        prisma.user.findUnique({ where: { email } }),
        prisma.user.findUnique({ where: { username } }),
      ]);

      if (existingUserEmail && existingUserUsername) {
        throw new Error("Email and username already taken");
      }
      if (existingUserEmail) {
        throw new Error("Email already taken");
      }
      if (existingUserUsername) {
        throw new Error("Username already taken");
      }

      const user = await prisma.user.create({
        data: {
          email,
          password,
          username,
        },
      });
      return {
        user,
      };
    }),
});
