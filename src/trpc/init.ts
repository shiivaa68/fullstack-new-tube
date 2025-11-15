import { db } from "@/db";
import { users } from "@/db/schema";
import { ratelimit } from "@/lib/ratelimit";
import { auth } from "@clerk/nextjs/server";

import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  // console.log(userId, "i am in the createTRPCContext");
  return { userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  // console.log(ctx.userId, "i am inside the protectedprocedure");
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.userId))
    .limit(1);

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
    // console.log(user, "user doest exist");
  }

  const { success } = await ratelimit.limit(user.id);
  // console.log(success, "into success");
  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  // console.log(ctx, "ctx");
  // console.log(user, "user");
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
