import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
// import { auth } from "@clerk/nextjs/server";
// import { TRPCError } from "@trpc/server";

export const appRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async (opts) => {
      // console.log({ dbUser: opts.ctx.user });
      console.log("ctx.clerkuserId:", opts.ctx.userId);
      console.log("db user:", opts.ctx.user);

      // const { userId } = await auth();
      // if (!userId) {
      //   throw new TRPCError({ code: "UNAUTHORIZED" });
      // }

      // console.log("helo worf", { userId });
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
