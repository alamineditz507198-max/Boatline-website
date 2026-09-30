import { useEffect, useRef } from 'react';

interface CPMAdBannerProps {
  className?: string;
}

export function CPMAdBanner({ className = '' }: CPMAdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if script has already been added to this container
    const existingScript = container.querySelector(
      'script[src*="profitableratecpmnetwork.com"]'
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src =
        'https://pl31588180.profitableratecpmnetwork.com/62fabac9f34c7be0cccc5f35c934bfb3/invoke.js';

      container.appendChild(script);
    }
  }, []);

  return (
    <aside
      aria-label="Advertisement Banner"
      className={`my-8 overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-3 sm:p-5 text-center shadow-sm ${className}`}
    >
      <div className="mx-auto flex max-w-[728px] flex-col items-center justify-center">
        {/* Subtle Ad label */}
        <div className="mb-2 flex items-center justify-center gap-1.5 opacity-60">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            Advertisement
          </span>
        </div>

        {/* Dynamic Adsterra / CPM Network Container */}
        <div
          ref={containerRef}
          className="flex min-h-[60px] w-full max-w-[728px] items-center justify-center overflow-hidden rounded-lg bg-[hsl(var(--muted))]/20"
        >
          <div
            id="container-62fabac9f34c7be0cccc5f35c934bfb3"
            className="flex w-full items-center justify-center min-h-[50px]"
          />
        </div>
      </div>
    </aside>
  );
}
