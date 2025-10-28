// import { serverClient } from "@/utils/trpc-server";
import { HydrateClient } from "@/providers/hydrate-client";
// import { QueryClient, dehydrate } from "@tanstack/react-query";
import { PageClient } from "./client";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { trpc } from "@/utils/trpc";

export default async function Home() {
  // const queryClient = new QueryClient();

  // Fetch server-side
  // const data = await serverClient.hello.query({ text: "Shiva" });

  //
  void trpc.hello?.usePrefetchQuery({ text: "anntonio" });

  // queryClient.setQueryData(["hello", { text: "Shiva" }], data);

  // const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateClient>
      <Suspense fallback={<p>loading...</p>}>
        {/* <div>Server fetched: {data.greeting}</div> */}
        <ErrorBoundary fallback={<p>error...</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
