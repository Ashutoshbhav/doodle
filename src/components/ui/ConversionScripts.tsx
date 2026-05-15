"use client";

import Script from "next/script";
import { env } from "@/env";

/**
 * Ad-platform base tags for the /drop campaign LP (Live Campaign Lab).
 *
 * Renders nothing when the matching env var is unset, so the app builds and
 * deploys before the Meta / Google Ads accounts hand over their IDs. The
 * conversion events themselves fire from WaitlistForm on a successful signup
 * (see its `conversionTrack` prop) — this component only loads the base SDKs
 * and records the PageView.
 */
export function ConversionScripts() {
  const pixelId = env.NEXT_PUBLIC_META_PIXEL_ID;
  const gadsId = env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  return (
    <>
      {pixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {gadsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gadsId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${gadsId}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
