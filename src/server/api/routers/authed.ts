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
});
