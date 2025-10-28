import { z } from "zod";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      if (!opts.input.text) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Text is required",
        });
      }

      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
