'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';
import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { LiquidCursor } from '@/shared/ui';
import { ToastProvider } from '@/shared/ui/toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ToastProvider maxToasts={5}>
          <SessionProvider>
            <LiquidCursor size={44} />
            {children}
          </SessionProvider>
        </ToastProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
