import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  allUsersWarehousesRentals: adminProcedure.query(async ({ ctx }) => {
    const [users, warehouses, rentals] = await Promise.all([
      ctx.prisma.user.findMany(),
      ctx.prisma.warehouse.findMany(),
      ctx.prisma.rental.findMany(),
    ]);
    return { users, warehouses, rentals };
  }),
});
