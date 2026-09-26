import { useEffect, useRef, useState } from 'react';

interface AdSenseSlotProps {
  slotId?: string;
  clientId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
  label?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const DEFAULT_ADSENSE_CLIENT_ID = 'ca-pub-9043483767704653';

/**
 * Google AdSense banner and responsive ad unit component.
 * Safely renders AdSense ins tag and triggers adsbygoogle push.
 */
export function AdSenseSlot({
  slotId = '1733624695',
  clientId = DEFAULT_ADSENSE_CLIENT_ID,
  format = 'auto',
  responsive = true,
  className = '',
  label = true,
}: AdSenseSlotProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adStatus, setAdStatus] = useState<'loading' | 'unfilled' | 'filled'>('loading');
  const [isLiveDomain, setIsLiveDomain] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hostname = window.location.hostname;
    const isProd = hostname.includes('boatline.cyou');
    setIsLiveDomain(isProd);

    // Give the DOM element a moment to measure layout width before calling adsbygoogle
    const timer = setTimeout(() => {
      try {
        if (adRef.current) {
          const currentStatus = adRef.current.getAttribute('data-adsbygoogle-status');
          const adStatusAttr = adRef.current.getAttribute('data-ad-status');

          if (!currentStatus) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }

          // Check if ad was filled or unfilled by AdSense
          setTimeout(() => {
            if (adRef.current) {
              const updatedStatus = adRef.current.getAttribute('data-ad-status');
              if (updatedStatus === 'unfilled') {
                setAdStatus('unfilled');
              } else if (adRef.current.querySelector('iframe')) {
                setAdStatus('filled');
              }
            }
          }, 1500);
        }
      } catch (err) {
        console.debug('AdSense slot initialization:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [clientId, slotId]);

  return (
    <div className={`my-8 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {label && (
        <span className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] opacity-60">
          Advertisement
        </span>
      )}
      <div className="relative w-full max-w-[1200px] overflow-hidden rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--card))] p-3 shadow-sm min-h-[110px] flex items-center justify-center">
        {/* Google AdSense Unit */}
        <ins
          ref={adRef}
          className="adsbygoogle w-full"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />

        {/* Development & Staging Domain Notice when AdSense returns unfilled */}
        {!isLiveDomain && adStatus !== 'filled' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[hsl(var(--muted))]/70 p-4 text-center backdrop-blur-xs pointer-events-none">
            <div className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google AdSense Slot Ready (Slot #{slotId})</span>
            </div>
            <p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))] max-w-md">
              Live ads are active and will display on your verified production domain (<strong>boatline.cyou</strong>). In development/preview URLs, Google AdSense holds live inventory until loaded on the approved domain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdSenseSlot;
