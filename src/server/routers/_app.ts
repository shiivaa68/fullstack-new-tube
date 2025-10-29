import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const appRouter = router({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      console.log({ dbUser: opts.ctx.user });
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
