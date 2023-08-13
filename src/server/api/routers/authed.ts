import { z } from "zod";
import { createTRPCRouter, authedProcedure } from "@/server/api/trpc";

export const authedRouter = createTRPCRouter({
  topUp: authedProcedure
    .input(z.number().positive())
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const updatedUser = await ctx.prisma.user.update({
        where: { id: user.id },
        data: { balance: { increment: input } },
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
            data: { balance: { decrement: rentalCost } },
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
              dailyRate: warehouse.dailyRate,
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
  warehouseRentals: authedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return ctx.prisma.rental.findMany({
        orderBy: {
          endDate: "asc",
        },
        where: {
          warehouseId: input,
        },
        include: {
          user: true,
        },
      });
    }),
  stopRental: authedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const rental = await ctx.prisma.rental.findUnique({
        where: {
          id: input,
        },
        include: {
          warehouse: true,
        },
      });
      if (!rental) {
        throw new Error("Rental not found");
      }
      if (rental.warehouse.ownerId !== ctx.user.id) {
        throw new Error("Not your rental");
      }
      const daysRented = Math.ceil(
        (Date.now() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const rentalDaysLeft = Math.ceil(
        (rental.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      const [updatedRental, updatedWarehouse, updatedUser, updatedAdmin] =
        await ctx.prisma.$transaction([
          ctx.prisma.rental.update({
            where: {
              id: input,
            },
            data: {
              endDate: new Date(),
              status: rental.endDate > new Date() ? "CANCELLED" : "COMPLETED",
              balance: 0,
            },
          }),
          ctx.prisma.warehouse.update({
            where: {
              id: rental.warehouseId,
            },
            data: {
              status: "AVAILABLE",
            },
          }),
          ctx.prisma.user.update({
            where: {
              id: rental.userId,
            },
            data: {
              balance: {
                increment: rentalDaysLeft * rental.dailyRate,
              },
            },
          }),
          ctx.prisma.user.update({
            where: {
              id: ctx.user.id,
            },
            data: {
              balance: {
                increment: daysRented * rental.dailyRate,
              },
            },
          }),
        ]);

      return {
        rental: updatedRental,
        warehouse: updatedWarehouse,
        user: updatedUser,
        admin: updatedAdmin,
      };
    }),
  updateWarehouseStatus: authedProcedure
    .input(
      z.object({
        warehouseId: z.string(),
        status: z.enum(["AVAILABLE", "UNAVAILABLE"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const warehouse = await ctx.prisma.warehouse.findUnique({
        where: {
          id: input.warehouseId,
        },
      });
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }
      if (warehouse.ownerId !== ctx.user.id) {
        throw new Error("Not your warehouse");
      }
      return ctx.prisma.warehouse.update({
        where: {
          id: input.warehouseId,
        },
        data: {
          status: input.status,
        },
      });
    }),
  deleteWarehouse: authedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const warehouse = await ctx.prisma.warehouse.findUnique({
        where: {
          id: input,
        },
      });
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }
      if (warehouse.ownerId !== ctx.user.id) {
        throw new Error("Not your warehouse");
      }
      return ctx.prisma.warehouse.delete({
        where: {
          id: input,
        },
      });
    }),
});
