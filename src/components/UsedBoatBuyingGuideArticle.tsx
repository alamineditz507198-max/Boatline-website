import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { BoatlineBoatLogo } from '@/components/BoatlineBoatLogo';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ClipboardCheck,
  Check,
  Search,
  Anchor,
  Compass,
  Gauge,
  Wrench,
  Zap,
  Flame,
  Truck,
  FileText,
  Printer,
} from 'lucide-react';

interface UsedBoatBuyingGuideArticleProps {
  article: {
    id: string;
    category: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    author: string;
    date: string;
    readTime?: string;
    image: string;
  };
}

// Helper for floated/inline images in used boat guide
function GuideInlineImage({
  src,
  alt,
  caption,
  align = 'right',
  size = 'small',
}: {
  src: string;
  alt: string;
  caption?: string;
  align?: 'left' | 'right' | 'wide';
  size?: 'small' | 'wide';
}) {
  if (size === 'wide' || align === 'wide') {
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-2.5 shadow-[var(--shadow-soft)]">
        <div className="overflow-hidden rounded-xl bg-[hsl(var(--muted))]">
          <img
            src={src}
            alt={alt}
            className="h-56 sm:h-72 md:h-84 w-full object-cover transition duration-300 hover:scale-[1.01]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/boats/deck-boat.jpg';
            }}
          />
        </div>
        {caption && (
          <figcaption className="mt-2.5 px-1 text-xs leading-normal text-[hsl(var(--muted-foreground))]">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure
      className={`my-5 w-full sm:w-[280px] md:w-[320px] rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-2.5 shadow-[var(--shadow-soft)] transition duration-200 hover:shadow-md ${
        align === 'left' ? 'sm:float-left sm:mr-6 sm:mb-4' : 'sm:float-right sm:ml-6 sm:mb-4'
      }`}
    >
      <div className="overflow-hidden rounded-xl bg-[hsl(var(--muted))]">
        <img
          src={src}
          alt={alt}
          className="h-40 sm:h-48 w-full object-cover transition duration-300 hover:scale-[1.02]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/boats/deck-boat.jpg';
          }}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 px-1 text-xs leading-normal text-[hsl(var(--muted-foreground))]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function UsedBoatBuyingGuideArticle({ article }: UsedBoatBuyingGuideArticleProps) {
  useEffect(() => {
    document.title = `${article.title} — Used Boat Buying Checklist & Guide | Boatline`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.title]);

  // Interactive Checklist State
  const initialChecklist = [
    { id: 'hull', text: 'Boat inspected (gelcoat, deck, transom, stringers, core)' },
    { id: 'engine', text: 'Engine checked (cold start, oil condition, smoke, cooling stream)' },
    { id: 'records', text: 'Service records reviewed (winterization, impellers, manifold dates)' },
    { id: 'structure', text: 'Hull inspected out of water (moisture, blisters, thru-hulls, seacocks)' },
    { id: 'electronics', text: 'Electronics tested (bilge pump float, nav lights, VHF, MFD, batteries)' },
    { id: 'trailer', text: 'Trailer checked where applicable (tires, bearings, brakes, frame, lights)' },
    { id: 'seatrial', text: 'Sea trial completed where possible (WOT RPM, planing time, steering)' },
    { id: 'paperwork', text: 'Ownership/title paperwork verified (clean title, no liens)' },
    { id: 'hin', text: 'VIN/HIN verified on hull transom against title and registration' },
    { id: 'survey', text: 'Professional inspection considered (certified SAMS or NAMS surveyor)' },
    { id: 'negotiation', text: 'Final price negotiated based on discovered maintenance needs' },
    { id: 'docs', text: 'Purchase documents reviewed (bill of sale, state transfer forms)' },
  ];

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lyman_used_boat_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('lyman_used_boat_checklist', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const isCompleted = checkedCount === initialChecklist.length;

  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Article Navigation bar */}
      <div className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--primary))]"
          >
            <ArrowLeft size={14} /> Back to Magazine
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
            >
              <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save Guide'}</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))]"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="mx-auto max-w-5xl px-5 pt-12 pb-8 sm:px-8 sm:pt-16 sm:pb-12">
        <div className="flex flex-wrap items-center gap-2 text-[hsl(var(--accent))]">
          <span className="fine-label font-bold tracking-widest text-[hsl(var(--accent))]">
            Boatline Field Guide
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">·</span>
          <span className="fine-label text-[hsl(var(--muted-foreground))]">Used Boat Buying</span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">·</span>
          <span className="fine-label text-[hsl(var(--muted-foreground))]">16 min read</span>
        </div>

        <h1 className="display-font mt-4 text-4xl leading-[1.02] tracking-[-.035em] text-[hsl(var(--primary))] sm:text-5xl md:text-6xl">
          10 Things to Check Before Buying a Used Boat
        </h1>

        <p className="mt-4 max-w-3xl text-lg font-medium leading-snug text-[hsl(var(--accent))] sm:text-xl md:text-2xl">
          A practical, field-tested inspection guide to avoiding expensive surprises, hidden structural rot, and catastrophic engine repairs.
        </p>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
          Whether you are looking at your first 18-foot runabout, an offshore center console, or a coastal cruiser, the cheapest-looking boat on the market is rarely the cheapest boat to own. Here is what to inspect with your own hands and eyes before making an offer.
        </p>

        {/* Byline & Metadata */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[hsl(var(--border))] py-4 text-xs text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-3">
            <BoatlineBoatLogo variant="pfp" size={38} />
            <div>
              <span className="font-bold text-[hsl(var(--primary))]">{article.author}</span>
              <span className="block text-[11px]">Editorial Inspection & Marine Standards Desk</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Published September 13, 2026</span>
            <span>·</span>
            <span>Applicable to Outboards, Sterndrives, Inboards & Sail</span>
          </div>
        </div>

        {/* Featured Editorial Photo */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--muted))] shadow-sm">
          <img
            src="/used-boat-cover.jpg"
            alt="Brown boat on ground"
            referrerPolicy="no-referrer"
            className="h-72 w-full object-cover sm:h-96 md:h-[480px]"
          />
        </div>
      </header>

      {/* Main Article Content */}
      <main className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        {/* Quick Jump Bar */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm sm:p-6">
          <span className="fine-label text-[hsl(var(--accent))]">Table of Contents & Quick Jump</span>
          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
            Jump directly to any inspection step or scroll through the complete 10-point checklist:
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-medium sm:grid-cols-3 md:grid-cols-5">
            {[
              { num: '01', title: 'Boat Condition', id: 'check-1' },
              { num: '02', title: 'Engine Condition', id: 'check-2' },
              { num: '03', title: 'Engine Hours', id: 'check-3' },
              { num: '04', title: 'Service History', id: 'check-4' },
              { num: '05', title: 'Hull & Structure', id: 'check-5' },
              { num: '06', title: 'Electronics', id: 'check-6' },
              { num: '07', title: 'Prop & Running Gear', id: 'check-7' },
              { num: '08', title: 'Fuel System', id: 'check-8' },
              { num: '09', title: 'Trailer', id: 'check-9' },
              { num: '10', title: 'Sea Trial & Survey', id: 'check-10' },
            ].map((item) => (
              <a
                key={item.num}
                href={`#${item.id}`}
                className="flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-2.5 py-2 text-[hsl(var(--primary))] transition hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--muted))]"
              >
                <span className="font-mono text-[10px] text-[hsl(var(--accent))]">{item.num}</span>
                <span className="truncate">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Introduction */}
        <section className="mt-10 space-y-4 border-b border-[hsl(var(--border))] pb-10 text-base leading-relaxed text-[hsl(var(--foreground))] sm:text-lg">
          <p className="display-font text-2xl text-[hsl(var(--primary))] sm:text-3xl">
            In boating, the phrase is legendary because it is true: <em className="text-[hsl(var(--accent))] font-serif italic">“The cheapest boat you can buy is often the most expensive boat you will ever own.”</em>
          </p>
          <p className="text-[hsl(var(--muted-foreground))]">
            Every marina and classified ad has them: glistening fiberglass hulls, fresh coats of wax, and price tags that look like steals. But fiberglass hides rotten plywood stringers beneath shiny gelcoat. Outboards can run for three minutes on a garden hose before overheating under load. And a fuel tank with pinhole corrosion under foaming foam can turn an $8,000 weekend project into a $14,000 financial headache.
          </p>
          <p className="text-[hsl(var(--muted-foreground))]">
            Buying used is still the smartest, most cost-effective way to get on the water—provided you inspect with method rather than emotion. This field guide walks you through the ten critical checkpoints every buyer should examine before signing a bill of sale.
          </p>
        </section>

        {/* Distinguish Boat Types Callout */}
        <aside className="my-8 rounded-2xl border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Compass size={22} className="shrink-0 text-[hsl(var(--accent))] mt-0.5" />
            <div>
              <h3 className="font-bold text-[hsl(var(--primary))] text-sm uppercase tracking-wider">
                A Note on Different Propulsion & Boat Types
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                No two boats have identical systems. As you read this guide, watch for specific distinctions:
              </p>
              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5">
                  <strong className="block text-[hsl(var(--primary))]">Outboards</strong>
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Tilt/trim rams, lower unit skeg, water telltale, cowl corrosion.</span>
                </div>
                <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5">
                  <strong className="block text-[hsl(var(--primary))]">Sterndrives (I/O)</strong>
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Exhaust manifolds, rubber bellows, gimbal bearing, trim pumps.</span>
                </div>
                <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5">
                  <strong className="block text-[hsl(var(--primary))]">Inboards</strong>
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Shaft packing/dripless seal, cutless bearing, bronze strut, heat exchanger.</span>
                </div>
                <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5">
                  <strong className="block text-[hsl(var(--primary))]">Sailboats & Trailers</strong>
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Keel bolts, chainplates, rigging, trailer bearings, brakes, and tires.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= 10 SECTIONS ================= */}

        {/* SECTION 1 */}
        <section id="check-1" className="mt-12 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              01
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Cosmetic vs. Structural Condition</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            Overall Boat Condition
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <p>
              Begin with a slow, deliberate walkaround before the seller starts the engine or pitches their story. Look closely at the gelcoat, hull sides, deck, and transom. Minor cosmetic dock rash and oxidation can be buffed out; deep structural scars cannot.
            </p>
            <p>
              <strong>Spider Cracks vs. Stress Cracks:</strong> Tiny hairline crazing in the gelcoat (spider cracks) near corners is common and often cosmetic. However, parallel or radiating stress cracks around engine mounts, cleats, bow eyes, and transom corners indicate the underlying fiberglass has flexed beyond its elastic limit.
            </p>
            <p>
              <strong>Signs of Water Intrusion & Neglect:</strong> Smell the bilge immediately when the hatch is opened. A sour, stagnant, musty odor indicates trapped water inside stringers, bulkheads, or foam. Look for waterline staining inside lockers, rust bleed through fasteners, and mismatched gelcoat patches indicating undocumented collision repairs.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/25 p-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[hsl(var(--primary))]">What to Check On Site:</h4>
            <ul className="mt-2 grid gap-2 text-xs text-[hsl(var(--muted-foreground))] sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-[hsl(var(--accent))] shrink-0" />
                <span>Rub rail alignment: gaps or bows often reveal impact damage.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-[hsl(var(--accent))] shrink-0" />
                <span>Keel and chines: look underneath for groundings, gouges, or exposed woven roving.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-[hsl(var(--accent))] shrink-0" />
                <span>Deck hardware: wiggle stanchions and cleats—movement means core rot below.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-[hsl(var(--accent))] shrink-0" />
                <span>Transom exterior: look for bulging, bowing, or brown weep lines from bolt holes.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 2 */}
        <section id="check-2" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              02
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Mechanical Health</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            Engine Condition
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <div className="overflow-hidden">
              <GuideInlineImage
                src="/used-boat-guide/engine-inspection.jpg"
                alt="Detailed inspection of a boat outboard engine block and mechanical components"
                caption="Engine block inspection: Pulling the cowling reveals whether the powerhead has been maintained or neglected with corroded wires and oil leaks."
                align="right"
              />
              <p>
                The powerplant is almost always the single most expensive component on a motorboat. Replacing an outboard or sterndrive engine often exceeds the resale value of the hull. Because mechanical issues can be easily disguised when the engine is pre-warmed, approaching the engine inspection methodically is your best defense against an immediate repower bill.
              </p>
            </div>
            <p>
              <strong>The Cold Start Rule:</strong> Always request that the engine be completely cold when you arrive. Place your hand on the engine block or outboard cowling before turning the key. Warm engines hide starting difficulty, worn starters, weak fuel pumps, and choke issues. A healthy modern marine engine should catch cleanly and settle into a smooth idle within seconds.
            </p>
            <p>
              <strong>Visual & Fluid Inspection:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Engine Oil:</strong> Pull the dipstick. Clean amber to dark brown is normal. <em>Milky, frothy, or café-au-lait colored oil</em> means water is entering the crankcase via a blown head gasket, cracked block, or failed oil cooler.</li>
              <li><strong>Cooling Stream (Outboards):</strong> Ensure a firm, unbroken water stream ("pisser") discharges immediately from the telltale at idle.</li>
              <li><strong>Exhaust Smoke:</strong> A brief puff on cold start is acceptable. Persistent white smoke indicates steam/water ingestion; blue smoke indicates burning oil (worn rings/valve guides); thick black smoke indicates unburned fuel or rich carburetion.</li>
              <li><strong>Sounds:</strong> Listen for sharp metallic ticking, rod knock, or whining alternator and water pump bearings.</li>
            </ul>
          </div>

          {/* Propulsion Comparison Table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-[hsl(var(--border))]">
            <div className="bg-[hsl(var(--muted))]/50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
              Engine Type Specifics Checklist
            </div>
            <div className="divide-y divide-[hsl(var(--border))] text-xs">
              <div className="grid grid-cols-[130px_1fr] p-3 sm:grid-cols-[160px_1fr]">
                <span className="font-bold text-[hsl(var(--accent))]">Outboards</span>
                <span className="text-[hsl(var(--muted-foreground))]">Inspect under the cowl for salt crust, oil drips, and brittle fuel lines. Cycle power tilt/trim through its full range under load—listen for groaning trim motors.</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] p-3 sm:grid-cols-[160px_1fr]">
                <span className="font-bold text-[hsl(var(--accent))]">Sterndrives (I/O)</span>
                <span className="text-[hsl(var(--muted-foreground))]">Check exhaust manifolds and risers for rust bleed at mating gaskets. If operated in saltwater, cast-iron risers generally require replacement every 4–6 years.</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] p-3 sm:grid-cols-[160px_1fr]">
                <span className="font-bold text-[hsl(var(--accent))]">Inboards (Gas / Diesel)</span>
                <span className="text-[hsl(var(--muted-foreground))]">Check raw water sea strainer cleanliness, transmission fluid color (pink/red, not burnt or brown), and engine mount rubber cushions for oil degradation.</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section id="check-3" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              03
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Metric Context</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            Engine Hours (And Why Hours Alone Lie)
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <p>
              Buyers frequently obsess over engine hours, treating a 200-hour boat as inherently superior to a 700-hour boat. In marine mechanics, this is one of the most dangerous assumptions you can make.
            </p>
            <p>
              <strong>Boats Hate Inactivity:</strong> An engine with only 120 hours on an eight-year-old boat has spent most of its life sitting idle. Fuel tanks collect condensation, ethanol separates into water and corrosive sludge, seals dry out, and cylinder walls can develop surface rust from humid sea air.
            </p>
            <p>
              Conversely, a commercial or enthusiastic recreational owner who logs 100 hours per season, changes fluids annually, and runs the engine up to operating temperature frequently will have a far more reliable motor.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]">
              <Gauge size={16} className="text-[hsl(var(--accent))]" />
              <span>How to Read Engine Hours Correctly:</span>
            </div>
            <div className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3">
                <strong className="block text-[hsl(var(--primary))]">Average Usage</strong>
                <span className="mt-1 block text-[hsl(var(--muted-foreground))]">Recreational boaters typically average 50 to 100 hours per season. Multiply years of age by 50–75 to gauge normal usage.</span>
              </div>
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3">
                <strong className="block text-[hsl(var(--primary))]">Computer Diagnostics</strong>
                <span className="mt-1 block text-[hsl(var(--muted-foreground))]">On modern EFI/DFI engines, an authorized technician can hook up a scanner to read true ECM hours, RPM breakdown, and stored overheat fault codes.</span>
              </div>
              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3">
                <strong className="block text-[hsl(var(--primary))]">Analog Hour Meters</strong>
                <span className="mt-1 block text-[hsl(var(--muted-foreground))]">Analog dash gauges can fail or be replaced. Never rely strictly on the dashboard meter without cross-referencing dated service invoices.</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section id="check-4" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              04
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Documentation</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            Maintenance & Service History
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <p>
              A thick binder of dated marina invoices is worth more than a fresh coat of hull wax. Responsible boaters keep receipts, winterization records, and work orders because they protect resale value.
            </p>
            <p>
              Ask the seller: <em>“Who serviced the boat, and where are the receipts?”</em> If the answer is “I did all the maintenance myself,” that isn’t necessarily a disqualifier—some owners are meticulous mechanics. However, they should be able to produce receipts for oil filters, water pump impeller kits, spark plugs, and lower unit lubricant.
            </p>
            <p>
              Pay special attention to scheduled consumable items that owners often neglect: water pump impellers (every 2–3 years), sacrificial zinc anodes, fuel-water separator canisters, and seasonal winterization drain downs in freezing climates.
            </p>
          </div>
        </section>

        {/* SECTION 5 */}
        <section id="check-5" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              05
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">The Core Skeleton</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            Hull & Structural Integrity
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <div className="overflow-hidden">
              <GuideInlineImage
                src="/used-boat-guide/transom-hull-inspection.jpg"
                alt="Boat hull and transom being inspected on land on a trailer"
                caption="Transom and structural inspection: Inspecting the hull and engine mounting points out of the water lets you check for core moisture, stress cracks, and flex."
                align="left"
              />
              <p>
                Cosmetic flaws are easily fixed; structural rot can condemn a boat to the salvage yard. The three critical structural components to inspect are the <strong>transom</strong>, the <strong>stringers</strong>, and the <strong>deck/bulkheads</strong>. Water penetrates through unsealed penetrations over years, turning internal plywood or balsa cores to wet mulch while looking deceptively clean from the outside.
              </p>
            </div>
            <p>
              <strong>The Transom Flex Test:</strong> For outboard boats, trim the engine up slightly, grasp the skeg or lower gearcase with both hands, and bounce firmly with your body weight. Watch the transom wall around the engine bracket. <em>There should be zero visible flex or movement of the fiberglass skin.</em> If the transom bends or you see brown water weeping from bolt holes, the internal wood core is rotted.
            </p>
            <p>
              <strong>The "Coin Tap" or Phenolic Hammer Test:</strong> Gently tap the hull, transom, and cockpit sole with the plastic handle of a screwdriver or a coin. Sound fiberglass produces a sharp, crisp, resonant ring. A hollow, dull thud indicates delamination, void, or waterlogged core material.
            </p>
            <p>
              <strong>Thru-Hulls & Seacocks:</strong> On boats kept in the water, check every through-hull fitting below the waterline. Seacocks must be bronze or Marelon, not cheap automotive plastic or hardware-store brass (which dezincifies and snaps). Exercise the valve handle: if it is seized, it must be replaced before launching.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
            <strong>Pro Tip on Deck Soft Spots:</strong> Walk firmly across every square foot of the cockpit sole, foredeck, and gunwales in flat boat shoes. Any spongy feeling underfoot indicates moisture intrusion around unsealed screws (cleats, seats, or rod holders) that has rotted the balsa or plywood core.
          </div>
        </section>

        {/* SECTION 6 */}
        <section id="check-6" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              06
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Power & Navigation</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            Electrical & Marine Electronics
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <p>
              Marine electrical issues are the number one cause of both underway breakdowns and dockside fires. Salt air corrodes copper wire from the inside out.
            </p>
            <p>
              <strong>Look Behind the Helm:</strong> Shine a flashlight behind the dash panel. What you want to see is clean, bundled, color-coded, tinned-marine wire secured with heat-shrink terminals. What you do <em>not</em> want to see is a "rat’s nest" of automotive wire, scotch-locks, household wire nuts, and dangling inline fuses added by previous owners.
            </p>
            <p>
              <strong>Test Every Single Switch:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Bilge Pump & Float Switch:</strong> Test both the manual helm switch AND lift the float switch manually. A pump that only works manually is a sinking hazard when unattended.</li>
              <li><strong>Navigation Lights:</strong> Red port, green starboard, and 360-degree white all-around light must function.</li>
              <li><strong>VHF Radio:</strong> Power on and perform a quick radio check on an authorized working channel or check NOAA weather frequencies.</li>
              <li><strong>GPS/Chartplotter/Sonar:</strong> Verify GPS satellite lock, screen brightness in sunlight, and that the transducer reads accurate water depth without blinking out.</li>
              <li><strong>Batteries:</strong> Check date stamp codes, terminal tightness, clean posts without white sulfuric acid buildup, and proper battery hold-down trays with covers.</li>
            </ul>
          </div>
        </section>

        {/* SECTION 7 */}
        <section id="check-7" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              07
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Drivetrain & Underwater Gear</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            Propeller & Running Gear
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <div className="overflow-hidden">
              <GuideInlineImage
                src="/used-boat-guide/propeller-running-gear.jpg"
                alt="Close-up of a propeller blade and sacrificial anode on the lower unit"
                caption="Propeller and running gear: Inspecting the prop blades, lower unit skeg, and zinc anodes reveals evidence of groundings, seal damage, and galvanic wear."
                align="right"
              />
              <p>
                Running gear operates completely out of sight underwater, bearing immense torque, hydrodynamic pressure, and vibration. A damaged propeller or bent shaft not only robs fuel economy and cruising speed, but will quickly destroy expensive lower unit bearings and gear sets.
              </p>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li><strong>Propeller Blades:</strong> Check for rolled edges, dings, or bent blades. Even a tiny 1/8-inch nick creates harmonic vibration that destroys lower unit propeller shaft seals and bearings over time.</li>
              <li><strong>Propeller Shaft:</strong> With the engine in neutral, spin the prop by hand. Sight along the hub to confirm the propshaft turns true without wobble. Look behind the thrust washer for fishing monofilament line melted around the oil seal.</li>
              <li><strong>Sacrificial Zinc Anodes:</strong> Check the anodes on the gearcase, trim tabs, and transom. If they are completely dissolved, galvanic corrosion may have attacked aluminum lower units or thru-hulls. If they look brand new after years in salt water, they may have lost electrical bonding contact.</li>
              <li><strong>Sterndrive Bellows:</strong> On Mercruiser Alpha/Bravo or Volvo Penta sterndrives, turn the drive hard to port and inspect the accordion rubber bellows (exhaust, u-joint, shift cable). Cracks, dry rot, or tears in these rubber boots will sink a boat at the dock.</li>
              <li><strong>Steering System:</strong> Check hydraulic steering helm cylinders for weeping seals and turn the wheel lock-to-lock. It should feel buttery smooth with zero spongy free-play or hydraulic shudder.</li>
            </ul>
          </div>
        </section>

        {/* SECTION 8 */}
        <section id="check-8" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              08
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Safety & Fire Hazards</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            Fuel System
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <p>
              Gasoline vapors in an enclosed bilge present a genuine explosion hazard. Inspect the fuel system thoroughly:
            </p>
            <p>
              <strong>The Bilge Sniff Test:</strong> Before turning on any electrical switches or blowers, lean your nose into the bilge. Any raw gasoline odor requires immediate shutdown and investigation.
            </p>
            <p>
              <strong>Fuel Tank Age & Condition:</strong> Aluminum fuel tanks foamed into fiberglass hulls have a typical lifespan of 15 to 25 years. Water trapped against the bare aluminum under the foam causes crevice corrosion and pinhole leaks. Inspect where the fuel sender mounts and look for white chalky aluminum oxide powder.
            </p>
            <p>
              <strong>Fuel Lines & Hoses:</strong> Check the rubber lines between the tank, primer bulb (if equipped), fuel-water separator, and engine. Lines should be stamped with USCG Type A1-15 (for enclosed spaces) or B1-15 (open outboards). If the hoses feel rock-hard, brittle, or cracked, they are degrading from modern ethanol-blended gasoline and must be replaced.
            </p>
          </div>
        </section>

        {/* SECTION 9 */}
        <section id="check-9" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              09
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Highway Safety</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            The Trailer (For Trailerable Boats)
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <p>
              A bad trailer can leave your boat stranded on the shoulder of the highway on day one. Buyers often forget to inspect the trailer until they try to tow the boat home.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li><strong>Tire Age (DOT Codes):</strong> Trailer tires rarely wear out their tread; they dry-rot from sun and age. Look for the 4-digit DOT date code (e.g., “2419” means 24th week of 2019). Any trailer tire over 5–6 years old should be replaced regardless of tread depth.</li>
              <li><strong>Wheel Bearings & Hubs:</strong> Jack up each wheel if possible and spin it. It should spin quietly without grinding. Wiggle the tire top-to-bottom: any play indicates loose or worn wheel bearings. Check the back of the wheel rim for grease slung from blown rear seals.</li>
              <li><strong>Frame Corrosion:</strong> On painted steel or galvanized trailers, check crossmembers, spring hangers, and axle tubes for rust perforation. Tap suspicious spots with a screwdriver.</li>
              <li><strong>Brake Actuator & Brakes:</strong> On surge brake trailers, check brake fluid level in the tongue coupler. Inspect brake calipers and rotors for heavy rust that seizes the pads.</li>
              <li><strong>Lights & Wiring:</strong> Plug the trailer harness into your tow vehicle and verify running lights, turn signals, and brake lights illuminate properly.</li>
            </ul>
          </div>
        </section>

        {/* SECTION 10 */}
        <section id="check-10" className="mt-14 scroll-mt-20 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] font-mono text-xs font-bold text-[hsl(var(--accent))]">
              10
            </span>
            <span className="fine-label text-[hsl(var(--accent))]">Verification on the Water</span>
          </div>
          <h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))] sm:text-4xl">
            The Sea Trial & Professional Marine Survey
          </h2>

          {/* Section 10 Wide Action Photo Transition */}
          <GuideInlineImage
            src="/used-boat-guide/sea-trial-running.jpg"
            alt="Boat running on plane during an on-water sea trial under sunny skies"
            caption="The sea trial: Running the vessel on the water under actual throttle and sea conditions is the ultimate test of engine cooling, hull balance, and transmission."
            size="wide"
          />

          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-base">
            <p>
              Never buy a boat without running it on the water under actual load, unless it is explicitly priced as a non-running project. Running on garden hose muffs at idle does not test the cooling system, torque, fuel delivery, or hull seaworthiness.
            </p>
            <p>
              <strong>During the Sea Trial:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Hole Shot & Planing Time:</strong> Apply full throttle from idle. Does the boat get on plane cleanly without bogging, hesitation, or blowing black smoke?</li>
              <li><strong>Wide-Open Throttle (WOT) RPM:</strong> Check the tachometer at full throttle against manufacturer specifications (usually 5,000–6,000 RPM for modern outboards). An engine that won't reach WOT is either over-propped, suffering from weak cylinders, or starving for fuel.</li>
              <li><strong>Engine Temperature Under Load:</strong> Run at cruise for 15 minutes. Watch the temperature gauge closely. An engine with bad water pump impellers or scaled exhaust risers will stay cool at idle but overheat at cruise.</li>
              <li><strong>Bilge Check After Run:</strong> Turn off the engine while still in the water. Open the bilge hatch and check for water leaking from shaft logs, rudder glands, transom fittings, or engine hose clamps.</li>
            </ul>

            <div className="mt-6 rounded-2xl border border-[hsl(var(--primary))] bg-[hsl(var(--card))] p-5 sm:p-6">
              <div className="flex items-center gap-2 font-bold text-[hsl(var(--primary))] text-sm">
                <Anchor size={18} className="text-[hsl(var(--accent))]" />
                <span>When to Hire a Professional Marine Surveyor</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                For boats over 24 feet, twin-engine vessels, or any purchase over $15,000–$20,000, hiring an independent surveyor accredited by <strong>SAMS (Society of Accredited Marine Surveyors)</strong> or <strong>NAMS (National Association of Marine Surveyors)</strong> is the best insurance policy you can buy. A surveyor uses professional ultrasonic moisture meters, oil analysis labs, and thermal imaging cameras to catch invisible rot and latent structural delamination.
              </p>
            </div>
          </div>
        </section>

        {/* ================= RED FLAGS SECTION ================= */}
        <section className="mt-16 rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-6 dark:border-rose-900/60 dark:bg-rose-950/20 sm:p-8">
          <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400">
            <AlertTriangle size={24} />
            <span className="fine-label font-bold uppercase tracking-wider">Crucial Warning Signs</span>
          </div>
          <h3 className="display-font mt-2 text-2xl text-[hsl(var(--primary))] sm:text-3xl">
            Red Flags That Should Make You Stop and Investigate
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-sm">
            If you encounter any of the following during your inspection, pause immediately. Do not make an emotional purchase hoping these are "easy fixes":
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                title: 'Major Unexplained Structural Damage',
                desc: 'Flexing transom, soft spongy deck spots, cracked engine stringers, or cracked keel seams.',
              },
              {
                title: 'Missing Maintenance Records & Reluctance',
                desc: 'Seller is vague about who serviced the boat, has zero receipts, or refuses to allow a cold start.',
              },
              {
                title: 'Significant Galvanic Corrosion',
                desc: 'Pitting on gearcases, white powder corrosion eating through engine blocks, or completely missing anodes.',
              },
              {
                title: 'Persistent Water Leaks or Waterline Stains',
                desc: 'Tideline stains high in the bilge indicating the boat took on water or sat submerged at some point.',
              },
              {
                title: 'Engine Problems & Milky Fluids',
                desc: 'Milky oil, persistent white/blue smoke, missing cooling stream, or uneven compression across cylinders.',
              },
              {
                title: 'Suspiciously Inconsistent History',
                desc: 'Engine hours that do not match the wear on helm controls, seats, and hull; missing or illegible HIN plates.',
              },
              {
                title: 'Signs of Poor Previous DIY Repairs',
                desc: 'Automotive silicone used in place of 3M 5200/4200 marine sealants, household wire nuts, or plumbing brass below waterline.',
              },
              {
                title: 'Refusal of a Water Sea Trial',
                desc: 'Seller insists the boat runs perfectly but makes excuses to prevent testing it in the water under load.',
              },
            ].map((flag, idx) => (
              <div key={idx} className="rounded-xl border border-rose-200/80 bg-[hsl(var(--card))] p-3.5 shadow-sm dark:border-rose-900/40">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400">⚠ {flag.title}</span>
                <p className="mt-1 text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">{flag.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= QUESTIONS TO ASK THE SELLER ================= */}
        <section className="mt-14 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 text-[hsl(var(--accent))]">
            <HelpCircle size={22} />
            <span className="fine-label font-bold uppercase tracking-wider">Buyer’s Interrogation Guide</span>
          </div>
          <h3 className="display-font mt-2 text-2xl text-[hsl(var(--primary))] sm:text-3xl">
            Questions to Ask the Seller
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-sm">
            Print or screenshot these questions to ask during your initial phone call and on-site inspection. Pay attention to how confident and transparent the answers are:
          </p>

          <div className="mt-5 space-y-3">
            {[
              { q: '“How long have you owned this boat, and why are you selling it?”', note: 'Short ownership (less than a season) often signals someone discovered an expensive problem they cannot afford to fix.' },
              { q: '“Where and how was the boat stored during the off-season?”', note: 'Indoor heated or shrink-wrapped storage protects hulls; backyard open storage allows leaves and rainwater to rot cores.' },
              { q: '“When were the water pump impeller, lower unit oil, and engine fluids last replaced?”', note: 'Gauges whether regular seasonal service was treated as a priority.' },
              { q: '“Has the boat ever taken on water, been in a collision, or run aground?”', note: 'Direct question that legally establishes seller disclosure in many jurisdictions.' },
              { q: '“On sterndrives: When were the exhaust manifolds, risers, and rubber bellows last changed?”', note: 'Essential question for any I/O boat operated in saltwater.' },
              { q: '“What is the newest item on the boat, and what is the oldest item that will need attention next?”', note: 'Reveals honest seller perspective on upcoming maintenance costs.' },
              { q: '“Do you have a clean, lien-free title in your name for BOTH the boat and the trailer?”', note: 'Confirm seller holds the title now before negotiating.' },
              { q: '“Can we conduct a cold start on muffs, followed by a sea trial on the water?”', note: 'A genuine seller with a sound boat will welcome a serious buyer’s water test.' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/25 p-3.5">
                <p className="text-xs font-bold text-[hsl(var(--primary))] sm:text-sm">{item.q}</p>
                <p className="mt-1 text-[11px] italic text-[hsl(var(--accent))]">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= INTERACTIVE FINAL CHECKLIST ================= */}
        <section className="mt-14 rounded-2xl border-2 border-[hsl(var(--primary))] bg-[hsl(var(--card))] p-6 shadow-md sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[hsl(var(--border))] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardCheck size={20} className="text-[hsl(var(--accent))]" />
                <span className="fine-label font-bold uppercase tracking-wider text-[hsl(var(--accent))]">
                  Field Ready Checklist
                </span>
              </div>
              <h3 className="display-font mt-1 text-2xl text-[hsl(var(--primary))] sm:text-3xl">
                Before You Hand Over the Money
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1 text-xs font-mono font-bold text-[hsl(var(--primary))]">
                {checkedCount} / {initialChecklist.length} Checked
              </span>
              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setCheckedItems({});
                    localStorage.removeItem('lyman_used_boat_checklist');
                  }}
                  className="text-[11px] text-[hsl(var(--muted-foreground))] underline hover:text-[hsl(var(--primary))]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-sm">
            Tap each step as you complete it during your evaluation. Do not release a cash payment or bank wire until every box below is satisfied:
          </p>

          <div className="mt-5 space-y-2.5">
            {initialChecklist.map((item) => {
              const checked = !!checkedItems[item.id];
              return (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    checked
                      ? 'border-emerald-500/50 bg-emerald-50/40 text-[hsl(var(--primary))] dark:bg-emerald-950/20'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--accent))]/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--accent))] focus:ring-[hsl(var(--accent))]"
                  />
                  <span className={`text-xs sm:text-sm ${checked ? 'line-through opacity-75' : 'font-medium'}`}>
                    {item.text}
                  </span>
                </label>
              );
            })}
          </div>

          {isCompleted && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-100 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 size={18} />
              <span>Inspection complete! All 12 critical checks have been reviewed. You are prepared to negotiate with confidence.</span>
            </div>
          )}
        </section>

        {/* ================= FINAL CALLOUT ================= */}
        <div className="my-12 rounded-2xl bg-[hsl(var(--primary))] p-6 text-center text-white shadow-md sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--accent))] text-[hsl(var(--primary))] shadow">
            <Anchor size={24} />
          </div>
          <blockquote className="display-font mt-4 text-xl sm:text-2xl leading-snug tracking-tight text-white/95 md:text-3xl max-w-2xl mx-auto">
            “Never judge a used boat by appearance alone. A clean-looking boat can still have expensive mechanical or structural problems.”
          </blockquote>
          <p className="mt-3 text-xs uppercase tracking-widest text-[hsl(var(--accent))] font-bold">
            — Boatline Editorial Field Rule
          </p>
        </div>

        {/* ================= SEO METADATA & INTERNAL LINKS ================= */}
        <section className="mt-14 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-6 sm:p-8">
          <span className="fine-label text-[hsl(var(--accent))] font-bold">Article Metadata & Search Indexing</span>
          
          <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
            <div>
              <strong className="block text-[hsl(var(--primary))] font-mono text-[11px] uppercase">SEO Title:</strong>
              <p className="mt-1 text-[hsl(var(--muted-foreground))]">
                10 Things to Check Before Buying a Used Boat | Complete Inspection Checklist — Boatline
              </p>
            </div>
            <div>
              <strong className="block text-[hsl(var(--primary))] font-mono text-[11px] uppercase">Canonical URL:</strong>
              <p className="mt-1 font-mono text-[hsl(var(--accent))]">
                /10-things-to-check-before-buying-a-used-boat/
              </p>
            </div>
            <div className="sm:col-span-2">
              <strong className="block text-[hsl(var(--primary))] font-mono text-[11px] uppercase">Meta Description:</strong>
              <p className="mt-1 text-[hsl(var(--muted-foreground))] leading-relaxed">
                Before buying a used boat, inspect these 10 critical checkpoints: hull integrity, cold engine start, compression, engine hours, electrical panels, steering, fuel tanks, trailer safety, and sea trials. Download the field checklist to avoid costly mistakes.
              </p>
            </div>
            <div className="sm:col-span-2">
              <strong className="block text-[hsl(var(--primary))] font-mono text-[11px] uppercase">Primary Search Targets:</strong>
              <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                {[
                  'things to check before buying a used boat',
                  'used boat buying checklist',
                  'what to inspect when buying a used boat',
                  'used boat inspection',
                  'boat buying checklist',
                  'buying a used boat',
                  'used boat red flags',
                ].map((keyword) => (
                  <span key={keyword} className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-0.5 text-[hsl(var(--muted-foreground))]">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Internal Links */}
          <div className="mt-6 border-t border-[hsl(var(--border))] pt-4">
            <strong className="block text-[hsl(var(--primary))] text-xs font-bold uppercase tracking-wider">
              Related Boatline Guides:
            </strong>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <Link
                href="/story/002"
                className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 transition hover:border-[hsl(var(--accent))]"
              >
                <div>
                  <span className="font-bold text-[hsl(var(--primary))]">The Complete Boat Maintenance Checklist</span>
                  <span className="block text-[11px] text-[hsl(var(--muted-foreground))]">Seasonal checks before, during, and after every season</span>
                </div>
                <ArrowRight size={14} className="text-[hsl(var(--accent))]" />
              </Link>
              <Link
                href="/community"
                className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 transition hover:border-[hsl(var(--accent))]"
              >
                <div>
                  <span className="font-bold text-[hsl(var(--primary))]">From the Water: Community Stories</span>
                  <span className="block text-[11px] text-[hsl(var(--muted-foreground))]">Real-world restoration and first-boat lessons from owners</span>
                </div>
                <ArrowRight size={14} className="text-[hsl(var(--accent))]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-xs font-bold text-white shadow transition hover:bg-[hsl(var(--accent))]"
          >
            <ArrowLeft size={14} /> Back to Boatline Home
          </Link>
        </div>
      </main>
    </div>
  );
}
