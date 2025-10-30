"use client";
import { trpc } from "@/trpc/client";

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "shive",
  });
  if (!data.greeting) return <div>Loading...</div>;
  return <div>page client says : {data.greeting}</div>;
};
