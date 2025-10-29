"use client";

import { trpc } from "@/utils/trpc";
import { ClerkLoaded, useUser } from "@clerk/nextjs";
import { Suspense } from "react";

export default function Home() {
  return (
    <ClerkLoaded>
      <AuthenticatedContent />
    </ClerkLoaded>
  );
}

function AuthenticatedContent() {
  const { isSignedIn } = useUser();

  const query = trpc.hello.useQuery({ text: "Shiva" }, { enabled: isSignedIn });

  if (!isSignedIn) {
    return <div>Please sign in to see this content</div>;
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>Server fetched (client-side): {query.data?.greeting}</div>
    </Suspense>
  );
}
