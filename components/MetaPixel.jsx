import { FB_PIXEL_ID } from "@/lib/meta-config";
import MetaPixelRoutes from "@/components/MetaPixelRoutes";

/*
 * Meta's Pixel base code, served in the document <head> on every storefront page.
 * Admin pages are skipped so staff browsing doesn't count as shopper traffic.
 */
const BASE_CODE = `
if (!location.pathname.startsWith('/admin')) {
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');
}`;

/** Goes inside <head>. */
export function MetaPixelHead() {
  return <script id="meta-pixel-base" dangerouslySetInnerHTML={{ __html: BASE_CODE }} />;
}

/** Goes inside <body>: the no-JavaScript fallback, and PageView on in-site navigation. */
export function MetaPixelBody() {
  return (
    <>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <MetaPixelRoutes />
    </>
  );
}
