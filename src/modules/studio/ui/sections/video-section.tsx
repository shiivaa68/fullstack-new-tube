"use client";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

export const VideoSection = () => {
  //data {} and usequeru istefade kon age nemikhay prefetch koni
  // const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
      const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(

    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return <div>{JSON.stringify(data)}</div>;
};
