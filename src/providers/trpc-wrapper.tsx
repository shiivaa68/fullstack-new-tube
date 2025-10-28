'use client';

import { TRPCProvider } from './trpc-provider';

export function TRPCWrapper({ children }: { children: React.ReactNode }) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
