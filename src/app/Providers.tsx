'use client';

import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type * as React from 'react';
import { AssetCacheRegistrar } from '@/app/AssetCacheRegistrar';
import { createQueryPersister, getQueryPersistOptions, QUERY_PERSIST_GC_TIME } from '@/shared/lib/query-persist';
import { AnalyticsProvider } from '@/shared/ui/AnalyticsProvider';
import { ToastProvider } from '@/shared/ui/toast';

const CosmosCursor = dynamic(() => import('@/widgets/home/ui/CosmosCursor').then((mod) => mod.CosmosCursor), {
  ssr: false,
});

const queryPersister = createQueryPersister();
const queryPersistOptions = getQueryPersistOptions(queryPersister);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: QUERY_PERSIST_GC_TIME,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

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
    <PersistQueryClientProvider client={queryClient} persistOptions={queryPersistOptions}>
      <NuqsAdapter>
        <ToastProvider maxToasts={5}>
          <SessionProvider>
            <AssetCacheRegistrar />
            <HomeOnlyCosmosCursor />
            <AnalyticsProvider />
            {children}
          </SessionProvider>
        </ToastProvider>
      </NuqsAdapter>
    </PersistQueryClientProvider>
  );
}
