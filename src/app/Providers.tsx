'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';
import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/shared/ui/toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { AnalyticsProvider } from '@/shared/ui/AnalyticsProvider';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const CosmosCursor = dynamic(
  () => import('@/widgets/home/ui/CosmosCursor').then((mod) => mod.CosmosCursor),
  { ssr: false },
);

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

const HomeOnlyCosmosCursor = () => {
  const pathname = usePathname();
  if (pathname !== '/') {
    return null;
  }
  return <CosmosCursor />;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ToastProvider maxToasts={5}>
          <SessionProvider>
            <HomeOnlyCosmosCursor />
            <AnalyticsProvider />
            {children}
          </SessionProvider>
        </ToastProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
