"use client";

import { trpc } from "@/utils/trpc";

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "shive cleint" });

  return (
    <div>
      Page Client says: {data?.greeting}
    </div>
  );
};
