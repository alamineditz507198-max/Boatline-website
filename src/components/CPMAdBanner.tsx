import { useEffect, useRef } from 'react';

interface CPMAdBannerProps {
  className?: string;
}

export function CPMAdBanner({ className = '' }: CPMAdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous scripts if any to allow fresh execution
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
      className={`w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 py-2 px-3 text-center ${className}`}
    >
      <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-center">
        {/* Subtle Ad label */}
        <span className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]/70">
          Advertisement
        </span>

        {/* Dynamic Adsterra / CPM Network Container */}
        <div
          ref={containerRef}
          className="flex min-h-[60px] w-full max-w-[728px] items-center justify-center overflow-hidden"
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
