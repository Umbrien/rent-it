import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { RentalStatus, WarehouseStatus } from "@prisma/client";

export const adminRouter = createTRPCRouter({
  allUsersWarehousesRentals: adminProcedure.query(async ({ ctx }) => {
    const [users, warehouses, rentals] = await Promise.all([
      ctx.prisma.user.findMany(),
      ctx.prisma.warehouse.findMany(),
      ctx.prisma.rental.findMany(),
    ]);
    return { users, warehouses, rentals };
  }),
  statistics: adminProcedure.query(async ({ ctx }) => {
    const rentalStatuses = Object.values(RentalStatus);
    const warehouseStatuses = Object.values(WarehouseStatus);

    const rentalsData = await ctx.prisma.rental.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const warehousesData = await ctx.prisma.warehouse.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    return {
      rentals: {
        statuses: rentalStatuses,
        data: rentalStatuses.map((status) => {
          const rental = rentalsData.find((r) => r.status === status);
          return rental ? rental._count.status : 0;
        }),
      },
      warehouses: {
        statuses: warehouseStatuses,
        data: warehouseStatuses.map((status) => {
          const warehouse = warehousesData.find((w) => w.status === status);
          return warehouse ? warehouse._count.status : 0;
        }),
      },
    };
  }),
});
