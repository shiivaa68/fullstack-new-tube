"use client";

import React, { useState } from "react";
import { trpc, trpcClientOptions } from "../utils/trpc";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";

export function TRPCWrapper({
  children,
  state,
}: {
  children: React.ReactNode;
  state?: DehydratedState | null; // ✅ correct type
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient(trpcClientOptions));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={state}>{children}</HydrationBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
