import { useEffect, useRef } from 'react';

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
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;

    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // Check if ad was already requested/filled to prevent AdSense error: "All 'ins' elements in the DOM with class=adsbygoogle already have ads in them."
        const alreadyFilled = adRef.current.getAttribute('data-adsbygoogle-status');
        if (!alreadyFilled) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        }
      }
    } catch (err) {
      console.debug('AdSense request error:', err);
    }
  }, [clientId, slotId]);

  return (
    <div className={`my-8 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {label && (
        <span className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] opacity-60">
          Advertisement
        </span>
      )}
      <div className="w-full max-w-[1200px] overflow-hidden rounded-xl border border-[hsl(var(--border))]/50 bg-[hsl(var(--card))]/60 p-2 shadow-sm flex justify-center min-h-[100px]">
        {/* Home_top AdSense Unit */}
        <ins
          ref={adRef}
          className="adsbygoogle w-full"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}

export default AdSenseSlot;
