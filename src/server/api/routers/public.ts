import { z } from "zod";
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
  warehouseTypes: publicProcedure.query(async () => {
    return prisma.warehouseType.findMany();
  }),
  availableWarehouses: publicProcedure
    .input(
      z.object({
        typeId: z
          .string()
          .refine((val) => val.length === 25)
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const { typeId } = input;
      return prisma.warehouse.findMany({
        where: {
          status: "AVAILABLE",
          warehouseTypeId: typeId,
        },
        include: {
          warehouseType: true,
        },
      });
    }),
  warehouse: publicProcedure
    .input(
      z.string().refine((val) => val.length === 25, {
        message: "Invalid warehouse id",
      })
    )
    .query(async ({ input }) => {
      return prisma.warehouse.findUnique({
        where: { id: input },
        include: {
          warehouseType: true,
          owner: true,
        },
      });
    }),
});
