"use client";

import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { trpcClientOptions } from "@/utils/trpc";

interface HydrateClientProps {
  children: React.ReactNode;
  state?: DehydratedState; // Use correct type here
}

export function HydrateClient({ children, state }: HydrateClientProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient(trpcClientOptions));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Hydrate applies server-fetched data (if any) */}
        <HydrationBoundary state={state}>{children}</HydrationBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
