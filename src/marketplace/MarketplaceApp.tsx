import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ShipWheel,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Bell,
  Compass,
  ArrowRight,
  BookOpen,
  Waves,
  Wrench,
} from 'lucide-react';

export function MarketplaceApp() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    document.title = 'Marketplace — Coming Soon · Lyman Marine';
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <div className="paper-grain min-h-screen flex flex-col justify-between bg-[#07131f] text-white">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#06101a]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-white/70 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Lyman Marine</span>
          </Link>

          <Link href="/" className="text-center" aria-label="Lyman Marine home">
            <span className="display-font text-[19px] leading-none tracking-[.08em] text-white">
              LYMAN{' '}
              <span className="font-sans text-[9px] font-semibold tracking-[.38em] text-[hsl(var(--accent))]">
                MARINE
              </span>
            </span>
          </Link>

          <div className="flex items-center">
            <span className="rounded-full border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
              In Development
            </span>
          </div>
        </div>
      </header>

      {/* Main Coming Soon Content */}
      <main className="flex-1 flex items-center justify-center px-5 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge & Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[hsl(var(--accent))]/30 bg-gradient-to-br from-[#0d2238] to-[#081524] text-[hsl(var(--accent))] shadow-2xl">
            <ShipWheel size={40} className="animate-spin-slow" />
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Lyman Marine Marketplace</span>
          </div>

          <h1 className="display-font mt-5 text-5xl leading-[.92] tracking-[-.04em] text-white sm:text-6xl md:text-7xl">
            Coming Soon
          </h1>

          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg max-w-xl mx-auto font-light">
            We are currently building our curated marine marketplace. Verified boat listings, certified dealer inventories, and accurate marine valuations will be launching soon.
          </p>

          {/* Email Notification Form */}
          <div className="mt-10 max-w-md mx-auto">
            {subscribed ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-5 text-center text-emerald-200">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={22} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">You're on the list!</h3>
                <p className="mt-1 text-xs text-emerald-300/80">
                  We'll send you an early notification as soon as boat listings open to the public.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for launch alerts"
                    className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-white/40 focus:border-[hsl(var(--accent))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--accent))]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#07131f] hover:brightness-110 transition shrink-0"
                >
                  <Bell size={14} />
                  <span>Notify Me</span>
                </button>
              </form>
            )}
            <p className="mt-3 text-[11px] text-white/40">
              Zero spam. Only an alert when the marketplace opens.
            </p>
          </div>

          {/* Return Home & Explore Editorial Sections */}
          <div className="mt-12 pt-10 border-t border-white/10">
            <p className="text-xs uppercase tracking-[.15em] font-semibold text-white/50 mb-4">
              Explore Lyman Marine while you wait
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-5 py-2.5 text-xs font-semibold text-white transition border border-white/15"
              >
                <span>Return to Home</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/buying"
                className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/15 px-4 py-2.5 text-xs font-semibold text-white/80 transition"
              >
                <BookOpen size={13} className="text-[hsl(var(--accent))]" />
                <span>Boat Buying Guide</span>
              </Link>
              <Link
                href="/conditions"
                className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/15 px-4 py-2.5 text-xs font-semibold text-white/80 transition"
              >
                <Waves size={13} className="text-[hsl(var(--accent))]" />
                <span>Marine Conditions</span>
              </Link>
              <Link
                href="/maintenance"
                className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/15 px-4 py-2.5 text-xs font-semibold text-white/80 transition"
              >
                <Wrench size={13} className="text-[hsl(var(--accent))]" />
                <span>Maintenance Guides</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} Lyman Marine. Built for the boating life.</p>
      </footer>
    </div>
  );
}
