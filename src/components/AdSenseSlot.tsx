import { useEffect } from 'react';

interface AdSenseSlotProps {
  slotId?: string;
  clientId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

/**
 * Google AdSense banner and responsive ad unit component.
 * Safely renders AdSense ins tag and triggers push.
 */
export function AdSenseSlot({
  slotId,
  clientId,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseSlotProps) {
  const effectiveClientId = clientId || (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID || '';

  useEffect(() => {
    try {
      if (effectiveClientId && typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      // AdSense push error can occur in preview sandbox or with ad blockers
      console.debug('AdSense initialization:', err);
    }
  }, [effectiveClientId, slotId]);

  if (!effectiveClientId) {
    // In dev / preview before AdSense publisher ID is connected: show unobtrusive editorial placeholder
    return null;
  }

  return (
    <div className={`my-6 flex justify-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90 }}
        data-ad-client={effectiveClientId}
        data-ad-slot={slotId || ''}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

export default AdSenseSlot;
