import { publicRouter } from "@/server/api/routers/public";
import { createTRPCRouter } from "@/server/api/trpc";
import { authedRouter } from "@/server/api/routers/authed";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  public: publicRouter,
  authed: authedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
