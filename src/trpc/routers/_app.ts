import { categoriesRouter } from "@/modules/categories/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter, // ✅ not "categoreis"
});

export type AppRouter = typeof appRouter;
