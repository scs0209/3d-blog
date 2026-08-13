'use client';

import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const AnalyticsProvider = () => {
  return (
    <>
      <Analytics />
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy='afterInteractive' />
          <Script id='ga4-init' strategy='afterInteractive'>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
    </>
  );
};
