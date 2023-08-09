import { z } from "zod";
import { createTRPCRouter, authedProcedure } from "@/server/api/trpc";

export const authedRouter = createTRPCRouter({
  topUp: authedProcedure
    .input(z.number().positive())
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const updatedUser = await ctx.prisma.user.update({
        where: { id: user.id },
        data: { balance: user.balance + input },
      });
      return {
        user: updatedUser,
        amount: input,
      };
    }),
  rentWarehouse: authedProcedure
    .input(
      z.object({
        warehouseId: z.string(),
        days: z.number().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const warehouse = await ctx.prisma.warehouse.findUnique({
        where: { id: input.warehouseId },
      });
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }
      if (warehouse.status === "UNAVAILABLE") {
        throw new Error("Warehouse not available");
      }
      if (warehouse.status === "RENTED") {
        throw new Error("Warehouse already rented");
      }
      const rentalCost = warehouse.dailyRate * input.days;
      if (rentalCost > user.balance) {
        throw new Error("Not enough money");
      }
      const [updatedUser, updatedWarehouse, rental] =
        await ctx.prisma.$transaction([
          ctx.prisma.user.update({
            where: { id: user.id },
            data: { balance: user.balance - rentalCost },
          }),
          ctx.prisma.warehouse.update({
            where: { id: input.warehouseId },
            data: {
              status: "RENTED",
            },
          }),
          ctx.prisma.rental.create({
            data: {
              startDate: new Date(),
              endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * input.days),
              balance: rentalCost,
              user: {
                connect: {
                  id: user.id,
                },
              },
              warehouse: {
                connect: {
                  id: input.warehouseId,
                },
              },
            },
          }),
        ]);

      return {
        user: updatedUser,
        warehouse: updatedWarehouse,
        rental,
      };
    }),
  yourWarehouses: authedProcedure
    .input(
      z.object({
        typeId: z.string().optional(),
        status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { user } = ctx;
      return ctx.prisma.warehouse.findMany({
        where: {
          ownerId: user.id,
          warehouseTypeId: input.typeId,
          status: input.status,
        },
        include: {
          warehouseType: true,
        },
      });
    }),
  addWarehouse: authedProcedure
    .input(
      z.object({
        nameUk: z.string(),
        nameEn: z.string().optional(),
        addressUk: z.string(),
        dailyRate: z.number().positive(),
        warehouseTypeId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.warehouse.create({
        data: {
          nameUk: input.nameUk,
          nameEn: input.nameEn,
          addressUk: input.addressUk,
          dailyRate: input.dailyRate,
          warehouseType: {
            connect: {
              id: input.warehouseTypeId,
            },
          },
          owner: { connect: { id: ctx.user.id } },
        },
      });
    }),
});
