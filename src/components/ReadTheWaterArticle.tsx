import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Compass,
  Waves,
  Droplets,
  Fish,
  Thermometer,
  Wind,
  Eye,
  Radar,
  Layers,
  Navigation,
  ExternalLink,
  Printer,
  Check,
  ChevronRight,
  Anchor,
  Sun,
  CloudRain,
  Activity,
  Maximize2,
} from 'lucide-react';

interface ReadTheWaterArticleProps {
  article: {
    id: string;
    slug?: string;
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

// Inline image component with elegant framing and captions
function ArticleInlineImage({
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
      <figure className="my-8 overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-3 shadow-[var(--shadow-soft)]">
        <div className="overflow-hidden rounded-xl bg-[hsl(var(--muted))]">
          <img
            src={src}
            alt={alt}
            className="h-64 sm:h-80 md:h-96 w-full object-cover transition duration-300 hover:scale-[1.01]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/boats/deck-boat.jpg';
            }}
          />
        </div>
        {caption && (
          <figcaption className="mt-3 px-1 text-xs leading-normal text-[hsl(var(--muted-foreground))] flex items-center justify-between">
            <span>{caption}</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--accent))]">Lyman Field Notes</span>
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure
      className={`my-6 w-full sm:w-[310px] md:w-[350px] rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-2.5 shadow-[var(--shadow-soft)] transition duration-200 hover:shadow-md ${
        align === 'left' ? 'sm:float-left sm:mr-7 sm:mb-5' : 'sm:float-right sm:ml-7 sm:mb-5'
      }`}
    >
      <div className="overflow-hidden rounded-xl bg-[hsl(var(--muted))]">
        <img
          src={src}
          alt={alt}
          className="h-44 sm:h-52 w-full object-cover transition duration-300 hover:scale-[1.02]"
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

// Callout component for field tips
function FieldTipCallout({
  icon: Icon,
  eyebrow,
  title,
  children,
  variant = 'default',
}: {
  icon?: any;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'warning';
}) {
  const borderStyles = {
    default: 'border-[hsl(var(--border))] bg-[hsl(var(--card))]',
    accent: 'border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/5',
    warning: 'border-amber-500/40 bg-amber-500/5',
  };

  const badgeStyles = {
    default: 'text-[hsl(var(--muted-foreground))]',
    accent: 'text-[hsl(var(--accent))]',
    warning: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <aside className={`my-8 rounded-2xl border p-5 md:p-6 shadow-[var(--shadow-soft)] ${borderStyles[variant]}`}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={16} className={badgeStyles[variant]} />}
        <span className={`text-[11px] font-bold uppercase tracking-wider ${badgeStyles[variant]}`}>
          {eyebrow}
        </span>
      </div>
      <h4 className="display-font text-xl md:text-2xl font-bold text-[hsl(var(--primary))] mb-3">
        {title}
      </h4>
      <div className="text-sm md:text-base leading-relaxed text-[hsl(var(--muted-foreground))] space-y-2">
        {children}
      </div>
    </aside>
  );
}

// Reference anchor helper
function Cite({ id, num }: { id?: string; num: number }) {
  return (
    <a
      href={`#ref-${num}`}
      className="inline-block text-[11px] font-mono font-medium text-[hsl(var(--accent))] hover:underline px-0.5"
      title={`Reference [${num}]`}
    >
      [{num}]
    </a>
  );
}

export function ReadTheWaterArticle({ article }: ReadTheWaterArticleProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('sec-01');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'sec-01', 'sec-02', 'sec-03', 'sec-04', 'sec-05',
        'sec-06', 'sec-07', 'sec-08', 'sec-09', 'sec-10',
        'sec-11', 'sec-12', 'sec-sources',
      ];
      const scrollY = window.scrollY;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop - 180 <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tableOfContents = [
    { id: 'sec-01', num: '01', title: 'When the Bite Suddenly Dies' },
    { id: 'sec-02', num: '02', title: 'Check the Conditions' },
    { id: 'sec-03', num: '03', title: 'Read the Surface' },
    { id: 'sec-04', num: '04', title: 'Water Clarity & Temperature' },
    { id: 'sec-05', num: '05', title: 'Find Structure & Depth' },
    { id: 'sec-06', num: '06', title: 'Follow the Bait' },
    { id: 'sec-07', num: '07', title: 'Use Electronics' },
    { id: 'sec-08', num: '08', title: 'Current & Tide' },
    { id: 'sec-09', num: '09', title: 'Adjust Presentation & Tactics' },
    { id: 'sec-10', num: '10', title: 'Stealth & Fishing Pressure' },
    { id: 'sec-11', num: '11', title: 'Diagnostic Protocol: Stay or Move?' },
    { id: 'sec-12', num: '12', title: 'Checklist & Rules of Thumb' },
    { id: 'sec-sources', num: '13', title: 'References & Sources' },
  ];

  const referencesList = [
    { num: 1, title: 'Action Fishing Trips', desc: 'Troubleshooting Inactive Fish Behavior and Environmental Fronts', url: 'https://actionfishingtrips.com' },
    { num: 2, title: 'The Fishing Wire', desc: 'Adjusting Presentations and Cadence When the Bite Ceases', url: 'https://thefishingwire.com' },
    { num: 3, title: 'Baitium Tackle Journal', desc: 'Why Fish Stop Biting and How to Trigger Neutral Strikes', url: 'https://baitium.com/blogs/news/why-fish-arent-biting' },
    { num: 4, title: 'Salt Strong Inshore Guide', desc: 'Reading Coastal Inshore Tides, Funnels, and Current Breaks', url: 'https://saltstrong.com' },
    { num: 5, title: 'Wired2Fish', desc: 'Seasonal Water Temperature Transitions and Structure Relationships', url: 'https://wired2fish.com' },
    { num: 6, title: 'Reddit Anglers Forum', desc: 'Field Troubleshooting Techniques for Sudden Slowdowns on the Water', url: 'https://reddit.com/r/Fishing/comments/1c4it7g/how_do_you_troubleshoot_when_fish_doesnt_bite/' },
    { num: 7, title: 'Tackle Theory', desc: 'Hydrodynamic Edges, Current Seams, and Predator Ambush Geometry', url: 'https://tackletheory.com' },
    { num: 8, title: 'Motion Fishing Co.', desc: 'Tracking Forage Schools and Interpreting Thermal Thermoclines', url: 'https://motionfishingco.com' },
    { num: 9, title: 'Orvis Fishing Insights', desc: 'Water Clarity, Light Penetration, and Visual vs. Lateral Sensory Hunt', url: 'https://orvis.com' },
    { num: 10, title: 'Buzzer Fish Journal', desc: 'Environmental Triggers, Barometric Pressure, and Feeding Windows', url: 'https://buzzerfish.com' },
    { num: 11, title: 'Bass Resource', desc: 'Deciphering Post-Frontal Bluebird Skies and Deep Fallbacks', url: 'https://bassresource.com' },
    { num: 12, title: 'Thayers Marine', desc: 'Contour Interpretation and Offshore GPS Route Navigation', url: 'https://thayersmarine.com' },
    { num: 13, title: 'Coastal Angler Magazine', desc: 'Transitional Structure: Points, Saddles, and Ledges', url: 'https://coastalanglermag.com' },
    { num: 14, title: 'Guidesly', desc: 'River Seams, Eddies, and Slack Current Behavioral Shifts', url: 'https://guidesly.com' },
    { num: 15, title: 'Fishing.net.nz', desc: 'Stealth Principles, Hull Slap, and Acoustic Dissipation in Shallows', url: 'https://fishing.net.nz' },
    { num: 16, title: 'Feather Craft', desc: 'Surface Clues: Birds, Nervous Water, and Hydrocarbon Slicks', url: 'https://feather-craft.com' },
    { num: 17, title: 'WindRider Marine', desc: 'Reading Windward Banks, Foam Accumulation, and Phytoplankton Drift', url: 'https://windrider.com' },
    { num: 18, title: 'Coastal Fishing Essentials', desc: 'Oil Slicks from Crushed Prey and Saltwater Flat Indications', url: 'https://coastalfishing.com' },
    { num: 19, title: 'High Class Tackle Co.', desc: 'Tidal Inflows, Outflow Funnels, and Conveyor Feeding Behavior', url: 'https://highclasstackleco.com' },
    { num: 20, title: 'Lowrance & Navionics Field Docs', desc: '2D CHIRP, DownScan, and SideScan Acoustic Interpretation', url: 'https://lowrance.com' },
    { num: 21, title: 'In-Fisherman Tech Series', desc: 'Acoustic Sound Frequencies vs. Ghost Finesse Profiles', url: 'https://in-fisherman.com' },
    { num: 22, title: 'Purina Mills Fisheries', desc: 'Dissolved Oxygen Turnover, Stratification, and Fish Welfare', url: 'https://purinamills.com' },
    { num: 23, title: 'Fish & Boat Australia', desc: 'Prey Migration Dynamics and Seasonal Forage Identification', url: 'https://fishandboat.com.au' },
    { num: 24, title: 'Garmin Marine Sonar Docs', desc: 'Surface Temperature Sensors and Thermocline Boundary Mapping', url: 'https://garmin.com' },
    { num: 25, title: 'Just Tides UK', desc: 'Estuarine Flow Velocity and Slack Water Fish Inactivity', url: 'https://justtides.co.uk' },
    { num: 26, title: 'Cleaner Seas Project', desc: 'Tidal Flushing and Marine Biological Redistribution Cycles', url: 'https://cleanerseas.com' },
    { num: 27, title: 'Fishing World Australia', desc: 'Mangrove Outflow Seams and Estuary Bottlenecks', url: 'https://fishingworld.com.au' },
    { num: 28, title: 'Florida Sportsman', desc: 'Downsizing Finesse Profiles Under High Barometric Pressure', url: 'https://floridasportsman.com' },
    { num: 29, title: 'Lures Edge Technical Series', desc: 'Vibration Propagation and Colorado vs. Willow Blade Physics', url: 'https://luresedge.com' },
    { num: 30, title: 'Bassmaster Conservation & Tech', desc: 'Acoustic Footprint of Trolling Motors in Shallow Bays', url: 'https://bassmaster.com' },
    { num: 31, title: 'Reddit Anglers In-Depth', desc: 'Decision Matrix: Run Time vs. Soaking High-Percentage Cover', url: 'https://reddit.com/r/Fishing' },
    { num: 32, title: 'Baitium Masterclass', desc: 'Diagnosing Tough Days on Freshwater Lakes and Coastal Sounds', url: 'https://baitium.com' },
  ];

  return (
    <article className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] pb-24">
      {/* Top Breadcrumb & Metadata Navigation */}
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--primary))]"
            >
              <ArrowLeft size={14} />
              <span>Back to Magazine</span>
            </Link>
            <span className="text-[hsl(var(--border))]">/</span>
            <Link
              href="/fishing"
              className="text-xs font-semibold text-[hsl(var(--accent))] transition hover:underline"
            >
              {article.category}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                saved
                  ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]'
              }`}
              title="Save story"
            >
              <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]"
              title="Share article"
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--primary))]"
              title="Print article"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="rounded-full bg-[hsl(var(--accent))]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[hsl(var(--accent))]">
            {article.category} Special Feature
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">•</span>
          <span className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
            <Compass size={13} className="text-[hsl(var(--accent))]" />
            Practical Inshore & Lake Diagnostics
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">•</span>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">{article.readTime || '15 min read'}</span>
        </div>

        <h1 className="display-font text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.02] tracking-[-0.035em] text-[hsl(var(--primary))]">
          {article.title}
        </h1>

        <p className="mt-4 text-xl sm:text-2xl leading-relaxed text-[hsl(var(--muted-foreground))] max-w-3xl">
          {article.subtitle || 'Diagnosing Environmental Shifts, Reading Surface Cues, and Adapting When the Bite Suddenly Dies'}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[hsl(var(--border))] py-4 text-xs text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center font-bold text-[hsl(var(--accent))]">
              RB
            </div>
            <div>
              <p className="font-semibold text-[hsl(var(--primary))]">{article.author}</p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">Senior Fisheries Contributor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>{article.date}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Peer-verified field guide</span>
          </div>
        </div>
      </div>

      {/* Hero Image Showcase */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <figure className="overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-3 shadow-[var(--shadow-lift)]">
          <div className="overflow-hidden rounded-xl bg-[hsl(var(--muted))] relative">
            <img
              src="/reading-the-water/reading-water-cover.jpg"
              alt="Angler observing the water surface on a calm morning from a boat deck"
              className="h-[320px] sm:h-[440px] md:h-[500px] w-full object-cover transition duration-500 hover:scale-[1.01]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = article.image || '/boats/deck-boat.jpg';
              }}
            />
            <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[11px] text-white/90">
              Casting Deck Observation • Dawn Transition
            </div>
          </div>
          <figcaption className="mt-3 px-2 text-xs text-[hsl(var(--muted-foreground))] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span>When the bite halts, your first instinct should be reading the environment rather than frantically cycling through tackle trays.</span>
            <span className="text-[11px] font-mono text-[hsl(var(--accent))] shrink-0">Photo: Lyman Field Desk</span>
          </figcaption>
        </figure>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
          {/* Table of Contents Sticky Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[hsl(var(--border))]">
                <Navigation size={16} className="text-[hsl(var(--accent))]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[hsl(var(--primary))]">
                  Guide Navigation
                </h3>
              </div>
              <nav className="space-y-1 text-xs">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`group flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 transition ${
                      activeSection === item.id
                        ? 'bg-[hsl(var(--accent))]/15 font-semibold text-[hsl(var(--accent))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--primary))]'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-[hsl(var(--accent))] shrink-0 pt-0.5">
                      {item.num}
                    </span>
                    <span className="leading-snug">{item.title}</span>
                  </a>
                ))}
              </nav>

              {/* Real-time Marine Conditions Promo Box */}
              <div className="mt-6 pt-5 border-t border-[hsl(var(--border))]">
                <div className="rounded-xl bg-[hsl(var(--muted))]/70 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))] mb-1.5">
                    <Waves size={14} className="text-[hsl(var(--accent))]" />
                    <span>Real-Time Weather</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] mb-3">
                    Check live water temp, wind speed, tides, and barometer readings before heading out.
                  </p>
                  <Link
                    href="/conditions"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[hsl(var(--primary))] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[hsl(var(--primary))]/90"
                  >
                    <span>Marine Conditions</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Article Body */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Quick Executive Summary */}
            <div className="not-prose mb-10 rounded-2xl border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5 p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--accent))] flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} />
                Key Takeaway for Anglers
              </h2>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                Fish don&apos;t simply &ldquo;get bored&rdquo; of your bait. When a hot bite dies in minutes, it is almost always triggered by an identifiable change in physical variables: a shifting tidal current, high overhead sun, sudden wind shifts, or water clarity variations. The angler who stops blindly casting and systematically audits the water will consistently turn a slow day into a productive one.
              </p>
            </div>

            {/* Section 01 */}
            <section id="sec-01" className="scroll-mt-24 pt-4 border-t border-[hsl(var(--border))] first:border-0 first:pt-0">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">01</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  When the Bite Suddenly Dies
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-[hsl(var(--foreground))]">
                Every angler has experienced the frustration of a sudden halt in activity. One moment you are catching fish regularly, and the next, the water feels completely barren. When this happens, the knee-jerk reaction is often to start digging through your tackle box to change your lure pattern, size, or color.
              </p>
              <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] mt-4">
                However, changing lures is rarely a long-term solution. Fish generally do not stop biting because they suddenly grow tired of a specific lure profile; they stop because something in their environment has changed. To consistently catch fish when conditions get tough, you must learn to diagnose environmental shifts and understand how they alter fish positioning and feeding behavior.
                <Cite num={1} />
                <Cite num={2} />
                <Cite num={3} />
                <Cite num={4} />
                <Cite num={5} />
                <Cite num={6} />
                <Cite num={7} />
                <Cite num={8} />
              </p>

              <FieldTipCallout
                icon={AlertTriangle}
                eyebrow="Common Angler Pitfall"
                title="The 5-Minute Tackle Trap"
                variant="warning"
              >
                Tying on four different lures in fifteen minutes rarely solves the puzzle. If fish have shifted from the windblown flat down to the 12-foot drop-off, a different colored jerkbait will still pass right over their heads. Diagnose location and depth before you change hardware.
              </FieldTipCallout>
            </section>

            {/* Section 02 */}
            <section id="sec-02" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">02</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Check the Conditions
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                Environmental adjustments can happen gradually or in a matter of minutes. When troubleshooting a slow day, your first move should be evaluating the physical parameters of your environment. You can check real-time indicators on the comprehensive{' '}
                <Link
                  href="/conditions"
                  className="font-semibold text-[hsl(var(--accent))] underline decoration-[hsl(var(--accent))]/40 underline-offset-4 hover:decoration-[hsl(var(--accent))]"
                >
                  Marine Conditions Page
                </Link>{' '}
                (as well as live NOAA offshore telemetry) to track how shifting weather systems are altering the aquatic ecosystem.
              </p>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))] mt-4">
                Keep a close eye on these shifting variables:
              </p>

              {/* Detailed Variable Cards Grid */}
              <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))] text-sm mb-1.5">
                    <Thermometer size={16} className="text-red-500" />
                    <span>Water Temperature</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    Drives a fish&apos;s metabolic rate and dissolved oxygen requirements. Cold snaps slow digestion; extreme heat drives fish to deeper thermoclines.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))] text-sm mb-1.5">
                    <Droplets size={16} className="text-sky-500" />
                    <span>Water Clarity</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    Dictates whether fish rely on visual tracking or their lateral lines to hunt. Runoff shifts fish from sight-feeding to structure-hugging vibration hunters.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))] text-sm mb-1.5">
                    <Wind size={16} className="text-teal-500" />
                    <span>Wind Direction & Speed</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    Stirs up the food chain by pushing plankton, breaking up surface light, and creating localized currents along windward shorelines.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))] text-sm mb-1.5">
                    <Sun size={16} className="text-amber-500" />
                    <span>Sun / Cloud Cover</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    Shifting light levels force fish to change depth or seek out overhead cover for safety. High noon bluebird skies collapse strike zones.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))] text-sm mb-1.5">
                    <CloudRain size={16} className="text-blue-500" />
                    <span>Rain & Runoff</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    Rapidly alters water levels, introduces sediment mudlines, drops surface temperatures, and washes terrestrial nutrients into creek mouths.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))] text-sm mb-1.5">
                    <Waves size={16} className="text-indigo-500" />
                    <span>Current & Tide</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    Acts as the natural conveyor belt dictating precisely where predatory fish position themselves to ambush prey. Slack tide halts the belt.
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                <strong>Water Level:</strong> Fluctuations shift the accessible shorelines, forcing fish off shallow flats or drawing them out of newly exposed vegetation.
                <Cite num={4} />
                <Cite num={5} />
                <Cite num={7} />
                <Cite num={8} />
                <Cite num={9} />
                <Cite num={10} />
                <Cite num={11} />
                <Cite num={12} />
                <Cite num={13} />
                <Cite num={14} />
                <Cite num={15} />
              </p>
            </section>

            {/* Section 03 */}
            <section id="sec-03" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">03</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Read the Surface
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                The surface of the water acts as a mirror reflecting what is happening directly underneath. Instead of blindly casting, take a moment to scan the water&apos;s surface for subtle biological clues:
                <Cite num={16} />
              </p>

              {/* Floated Image: Surface Cues */}
              <ArticleInlineImage
                src="/reading-the-water/water-surface-cues.jpg"
                alt="Close-up of calm water with nervous water ripples and subtle current seam"
                caption="&ldquo;Nervous water&rdquo; and delicate current seams reveal bait schools and underlying terrain breaks."
                align="right"
              />

              <ul className="space-y-3 text-sm md:text-base leading-relaxed text-[hsl(var(--foreground))] my-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">Baitfish (&ldquo;Nervous Water&rdquo;):</strong> Look closely for small dimples, shimmers, V-shaped wakes, or ripples. This &ldquo;nervous water&rdquo; indicates bait schools are panicking or fleeing predators just beneath the surface.
                    <Cite num={17} />
                    <Cite num={18} />
                    <Cite num={19} />
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">Birds as Natural Spotters:</strong> Pay attention to wading birds like blue herons along banks, or diving birds like gulls and loons out in the open. If birds are actively diving or hunting a specific shoreline, you can guarantee baitfish are concentrated in the area.
                    <Cite num={16} />
                    <Cite num={17} />
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">Surface Activity:</strong> Look for splashing or swirling. Even a single distant swirl indicates active predators feeding higher in the water column.
                    <Cite num={13} />
                    <Cite num={17} />
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">Wind-Blown Areas & Mud Lines:</strong> Mud lines created by waves crashing against clay banks or accumulation zones where foam and debris collect often concentrate bait and active fish.
                    <Cite num={10} />
                    <Cite num={17} />
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">Calm/Slick Water:</strong> While more difficult to fish due to high visibility, smooth water lets you locate expanding oily slicks—a telltale sign of predatory fish feeding below and releasing organic oils from crushed prey.
                    <Cite num={18} />
                  </div>
                </li>
              </ul>
              <div className="clear-both" />
            </section>

            {/* Section 04 */}
            <section id="sec-04" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">04</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Water Clarity & Temperature
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                Water clarity and temperature are closely linked factors that determine where fish migrate and how they perceive your presentations. There are no absolute rules in fishing—such as &ldquo;fish always go deeper when it gets cold&rdquo;—but understanding general fish biology will help you make better assumptions on the water.
                <Cite num={9} />
                <Cite num={11} />
                <Cite num={20} />
              </p>
              <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] mt-4">
                When water clarity changes due to sudden wind or heavy rain runoff, fish must adapt. In clear water, fish are highly visual hunters. Increased clarity allows them to inspect your lure from far away, meaning longer leaders, lighter lines, and natural color profiles become essential to avoid spooking them. When water turns stained or muddy, fish rely more on their lateral lines and olfactory senses. In these conditions, they will pull tight against vertical structures (like stumps or rocks) and respond much better to slower presentations, dark profiles, or lures that output heavy vibrations.
                <Cite num={5} />
                <Cite num={8} />
                <Cite num={9} />
                <Cite num={21} />
              </p>
              <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] mt-4">
                Temperature swings heavily dictate energy conservation. In the heat of summer, a lack of wind can lead to stagnant, oxygen-deprived shallow water, driving fish down to the thermocline or into moving currents where oxygen levels are higher. Conversely, a late-winter warm rain or a couple of degrees of solar warming on a shallow mud flat can suddenly activate a dormant fishery overnight.
                <Cite num={10} />
                <Cite num={11} />
                <Cite num={17} />
                <Cite num={22} />
              </p>

              <FieldTipCallout
                icon={Thermometer}
                eyebrow="Field Science"
                title="The Two-Degree Rule"
                variant="accent"
              >
                In early spring and late autumn, a difference of just 2°F to 3°F between the main lake basin and a protected north-bank bay will determine whether fish are sluggish or ravenous. Use your boat&apos;s surface temp gauge to hunt for these thermal pockets.
              </FieldTipCallout>
            </section>

            {/* Section 05 */}
            <section id="sec-05" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">05</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Find Structure & Depth
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                When fish stop biting in open water, they are usually seeking out relief or safety around distinct underwater structural changes. Focus your efforts on these high-percentage target zones:
                <Cite num={13} />
                <Cite num={20} />
              </p>

              {/* Clean Editorial Table */}
              <div className="not-prose my-6 overflow-hidden rounded-2xl border border-[hsl(var(--border))] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[hsl(var(--muted))] text-xs uppercase tracking-wider text-[hsl(var(--primary))] border-b border-[hsl(var(--border))]">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">Structure Type</th>
                        <th className="px-5 py-3.5 font-bold">Why Fish Relate to It</th>
                        <th className="px-5 py-3.5 font-bold">How to Approach</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))] bg-[hsl(var(--card))]">
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Drop-Offs
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Provide rapid access to deeper water safety when weather fronts move through.
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[hsl(var(--accent))] font-medium">
                          Position boat shallow and cast deep or parallel
                        </td>
                      </tr>
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Points & Ledges
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Act as natural intercept zones for traveling schools and break strong currents.
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[hsl(var(--accent))] font-medium">
                          Work both the upstream and downstream eddy edges
                        </td>
                      </tr>
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Flats
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Ideal feeding grounds during low-light periods, warm afternoons, or rising tides.
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[hsl(var(--accent))] font-medium">
                          Use search lures or drift with stealth
                        </td>
                      </tr>
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Channels
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Act as underwater highways that concentrate baitfish moving through a body of water.
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[hsl(var(--accent))] font-medium">
                          Target channel bends and neck-downs
                        </td>
                      </tr>
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Weed Edges
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Provide excellent oxygenation, shade, and complex cover for ambush predators.
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[hsl(var(--accent))] font-medium">
                          Punch thick canopy or rip along the outside deep wall
                        </td>
                      </tr>
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Rocks & Boulders
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Hold thermal heat in cold water and create pockets of calm water in heavy currents.
                        </td>
                        <td className="px-5 py-3.5 text-xs text-[hsl(var(--accent))] font-medium">
                          Bounce bottom contact jigs off current-facing faces
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 06 */}
            <section id="sec-06" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">06</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Follow the Bait
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                Predatory fish are governed by two primary drivers: security and food. If you cannot find the fish, stop looking for them directly and start hunting their food source. Locating schools of forage—whether it is threadfin shad, bluegill, crayfish, or saltwater baitfish—is the fastest way to put yourself back over game fish.
              </p>
              <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] mt-4">
                Large schools of bait rarely wander aimlessly; they are driven by the exact same environmental factors (plankton drift, water temperature, wind direction) that influence sport fish. When the bite slows down, tracking these forage schools will tell you exactly what depth and zone you need to target.
                <Cite num={8} />
                <Cite num={10} />
                <Cite num={17} />
                <Cite num={20} />
                <Cite num={22} />
                <Cite num={23} />
              </p>
            </section>

            {/* Section 07 */}
            <section id="sec-07" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">07</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Use Electronics
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                Modern marine electronics are incredibly powerful tools for diagnosing a slow bite, but only if you interpret the screen correctly. Rather than treating every arch or pixel mark on your screen as a target fish, use your electronics to analyze the broader underwater scene:
                <Cite num={8} />
                <Cite num={20} />
                <Cite num={24} />
              </p>

              {/* Floated Image: Sonar Screen */}
              <ArticleInlineImage
                src="/reading-the-water/sonar-electronics.jpg"
                alt="Modern marine chartplotter fish finder displaying underwater contour drop-off and bait clouds"
                caption="High-frequency sonar separates bait balls from bottom substrate and reveals whether game fish are tight to cover."
                align="left"
              />

              <ul className="space-y-3 text-sm md:text-base leading-relaxed text-[hsl(var(--foreground))] my-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">Traditional 2D Sonar & CHIRP:</strong> Excellent for identifying bottom hardness, separating bait fish from larger game fish, and tracking structural changes directly under your boat.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">Down & Side Imaging:</strong> These high-frequency scans reveal the exact layout of underwater structure. Side imaging allows you to scan expansive areas to see if fish have transitioned away from a drop-off and tucked directly into submerged timber or rock piles.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">GPS & Chartplotters:</strong> Use high-definition contour maps to identify subtle underwater highways, humps, and saddles that aren&apos;t visible from the surface.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[hsl(var(--accent))]">•</span>
                  <div>
                    <strong className="text-[hsl(var(--primary))]">Water-Temperature Readings:</strong> A built-in surface temperature sensor helps you pinpoint localized microclimates, such as a cooler spring inflow or a shallow creek arm that is warming up faster than the main lake body.
                    <Cite num={11} />
                    <Cite num={13} />
                    <Cite num={17} />
                    <Cite num={20} />
                    <Cite num={24} />
                  </div>
                </li>
              </ul>
              <div className="clear-both" />
            </section>

            {/* Section 08 */}
            <section id="sec-08" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">08</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Current & Tide
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                Moving water dictates how fish position themselves to feed. In saltwater and tidal estuaries, the movement of the tide is everything. A strong incoming or outgoing tide concentrates baitfish into narrow passes, channels, and around points. Fish will sit behind current breaks (like bridge pylons or rock ledges) facing into the current, waiting to ambush disoriented prey. If the tide goes slack, the bite often stops completely because the natural conveyor belt of food has halted.
                <Cite num={2} />
                <Cite num={19} />
                <Cite num={25} />
                <Cite num={26} />
                <Cite num={27} />
              </p>
              <p className="text-base leading-relaxed text-[hsl(var(--muted-foreground))] mt-4">
                In freshwater rivers, lakes, and reservoirs, current operates on identical principles. Dam discharges, tailrace flows, tributary inflows, and wind-driven surface currents create definite current seams—where fast water meets slow water. Fish rarely expend precious energy battling heavy current directly; instead, they hover on the soft side of the eddy line, darting out into the conveyor belt when forage sweeps past. When current slackens or switches, fish reposition immediately to the nearest structural depression or downstream eddy pocket.
                <Cite num={4} />
                <Cite num={7} />
                <Cite num={10} />
                <Cite num={14} />
                <Cite num={25} />
              </p>
            </section>

            {/* Section 09 */}
            <section id="sec-09" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">09</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Adjust Presentation & Tactics
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                When environmental conditions change, continuing to cast high-speed, aggressive search baits into empty water is a recipe for frustration. If you have confirmed fish are present via structure, bait, or electronics, the problem is usually your presentation profile:
                <Cite num={1} />
                <Cite num={2} />
                <Cite num={3} />
                <Cite num={14} />
                <Cite num={28} />
              </p>

              <div className="not-prose my-6 space-y-3">
                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                  <h4 className="font-semibold text-sm text-[hsl(var(--primary))] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
                    Downsize the Profile
                  </h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">
                    High-pressure frontal systems make fish cautious. Dropping from a 5-inch lure to a 3-inch finesse bait frequently triggers hesitant strikes from fish refusing larger offerings.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                  <h4 className="font-semibold text-sm text-[hsl(var(--primary))] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
                    Slow Down the Cadence & Prolong Pauses
                  </h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">
                    Extend pauses between twitches. Neutral or negative-buoyancy suspending jerkbaits held motionless for 5 to 10 seconds often prompt bites from inactive predators that refuse fast-moving baits.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                  <h4 className="font-semibold text-sm text-[hsl(var(--primary))] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
                    Shift the Depth Column
                  </h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">
                    If fish have hunkered down into the thermocline or hugged the bottom mudline, topwater or shallow cranks will go ignored. Drop vertical jigs, weighted drop-shots, or carolina rigs directly into their strike zone.
                  </p>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                  <h4 className="font-semibold text-sm text-[hsl(var(--primary))] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
                    Switch Vibration & Sound (Loud vs. Silent)
                  </h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">
                    In muddied runoff or low light, silent baits get missed—switch to Colorado blades or internal tungsten rattles. Conversely, in gin-clear, heavily pressured water, loud rattles can actively spook fish—switch to silent, translucent soft plastics.
                    <Cite num={5} />
                    <Cite num={8} />
                    <Cite num={21} />
                    <Cite num={29} />
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section id="sec-10" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">10</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  The Stealth Factor & Fishing Pressure
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                On heavily trafficked lakes, coastal bays, or popular weekend spots, recreational boat traffic and repeated angler pressure can shut down an active bite in minutes:
                <Cite num={15} />
                <Cite num={30} />
                <Cite num={31} />
              </p>

              <div className="space-y-4 text-base leading-relaxed text-[hsl(var(--muted-foreground))] mt-4">
                <p>
                  <strong className="text-[hsl(var(--primary))]">Hull Slap & Trolling Motor Noise:</strong> Sound travels nearly five times faster through water than air. Abruptly kicking an electric trolling motor up to high speed or slamming locker hatches sends acoustic shockwaves across shallow flats. Run trolling motors on a constant low whisper rather than intermittent surges, or drift with the wind.
                </p>
                <p>
                  <strong className="text-[hsl(var(--primary))]">Shadow & Silhouette:</strong> High overhead sun casts boat and angler silhouettes deep into the water column. Position your boat so the sun is in the quarry&apos;s face or make long, parallel casts across structure edges rather than standing directly above fish.
                </p>
                <p>
                  <strong className="text-[hsl(var(--primary))]">Line Diameter & Leader Material:</strong> Switch to fluorocarbon leaders that match water clarity. Fluorocarbon&apos;s light refractive index closely matches water, virtually eliminating visible line glare in clear conditions.
                  <Cite num={15} />
                  <Cite num={30} />
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section id="sec-11" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">11</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  The Troubleshooting Protocol: Stay or Move?
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                The age-old angler dilemma when the bite dies: do you continue dissecting a proven honey hole, or pull up the trolling motor and run elsewhere? Use this diagnostic protocol:
                <Cite num={1} />
                <Cite num={6} />
                <Cite num={13} />
                <Cite num={31} />
                <Cite num={32} />
              </p>

              {/* Protocol Matrix Table */}
              <div className="not-prose my-6 overflow-hidden rounded-2xl border border-[hsl(var(--border))] shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[hsl(var(--muted))] text-xs uppercase tracking-wider text-[hsl(var(--primary))] border-b border-[hsl(var(--border))]">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">Diagnostic Step</th>
                        <th className="px-5 py-3.5 font-bold">What You Observe</th>
                        <th className="px-5 py-3.5 font-bold">Recommended Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))] bg-[hsl(var(--card))]">
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Step 1: Bait Check
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Zero bait visible on surface or sonar
                        </td>
                        <td className="px-5 py-3.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                          Move immediately. Without forage, predators have transitioned to new zones.
                        </td>
                      </tr>
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Step 2: Current Status
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Slack tide or dam outflow shut off
                        </td>
                        <td className="px-5 py-3.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                          Reposition to deeper channel bends or wait out the slack window; resume when flow returns.
                        </td>
                      </tr>
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Step 3: Fish on Screen
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          Marks tucked tight to timber/bottom
                        </td>
                        <td className="px-5 py-3.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          Stay, but downsize to finesse bottom presentations (drop-shot, Ned rig, micro jigs).
                        </td>
                      </tr>
                      <tr className="hover:bg-[hsl(var(--muted))]/40 transition">
                        <td className="px-5 py-3.5 font-semibold text-[hsl(var(--primary))] whitespace-nowrap">
                          Step 4: Weather Shift
                        </td>
                        <td className="px-5 py-3.5 text-[hsl(var(--muted-foreground))]">
                          High bluebird skies following cold front
                        </td>
                        <td className="px-5 py-3.5 text-xs text-purple-600 dark:text-purple-400 font-semibold">
                          Target shaded docks, thick weed mats, or steep deep drop-offs where light is filtered.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 12 */}
            <section id="sec-12" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">12</span>
                <h2 className="display-font text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  Summary Checklist & Rules of Thumb
                </h2>
              </div>
              <p className="text-base leading-relaxed text-[hsl(var(--foreground))]">
                Keep these core principles top of mind whenever you are faced with a challenging bite:
                <Cite num={1} />
                <Cite num={8} />
                <Cite num={17} />
                <Cite num={32} />
              </p>

              {/* Checklist Box */}
              <div className="not-prose my-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
                <ul className="space-y-3.5">
                  {[
                    'Never blame the lure first—diagnose water temperature, clarity, current, and light shifts.',
                    'Scan for "nervous water," foraging birds, and hydrocarbon slicks before making your first cast.',
                    'Structure provides security; forage provides food. Always find the intersection of both.',
                    'Finesse down in profile and slow your cadence during post-frontal conditions and slack tides.',
                    'When current dies, fish tight to bottom relief; when current surges, fish current seams and eddy boundaries.',
                    'Eliminate dead water quickly: if there is no bait and no structural edge, move to fresh territory.',
                  ].map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))]">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 13: Sources & References */}
            <section id="sec-sources" className="scroll-mt-24 pt-10 border-t border-[hsl(var(--border))]">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">13</span>
                <h2 className="display-font text-2xl md:text-3xl font-bold tracking-tight text-[hsl(var(--primary))]">
                  References & Sources
                </h2>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-6">
                This comprehensive field guide compiles empirical fisheries research, tournament troubleshooting protocols, and marine telemetry resources:
              </p>

              <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {referencesList.map((ref) => (
                  <div
                    key={ref.num}
                    id={`ref-${ref.num}`}
                    className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 transition hover:border-[hsl(var(--accent))]/50"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold text-[hsl(var(--accent))] shrink-0">
                        [{ref.num}]
                      </span>
                      <div className="min-w-0">
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] inline-flex items-center gap-1 group"
                        >
                          <span className="truncate">{ref.title}</span>
                          <ExternalLink size={10} className="shrink-0 opacity-60 group-hover:opacity-100" />
                        </a>
                        <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">
                          {ref.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Next Story / Related Reading Footer */}
            <div className="not-prose mt-16 pt-10 border-t border-[hsl(var(--border))]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--accent))] mb-6">
                More Essential Guides from Lyman Marine
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  href="/story/002"
                  className="group rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent))]">
                    Maintenance Guide
                  </span>
                  <h4 className="display-font text-xl font-bold text-[hsl(var(--primary))] mt-2 group-hover:text-[hsl(var(--accent))] transition">
                    The Complete Boat Maintenance Checklist
                  </h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 line-clamp-2">
                    What to check before, during, and after every boating season to protect engine life and safety.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))]">
                    <span>Read checklist</span>
                    <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link
                  href="/10-things-to-check-before-buying-a-used-boat"
                  className="group rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent))]">
                    Boat Buying Guide
                  </span>
                  <h4 className="display-font text-xl font-bold text-[hsl(var(--primary))] mt-2 group-hover:text-[hsl(var(--accent))] transition">
                    10 Things to Check Before Buying a Used Boat
                  </h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 line-clamp-2">
                    Avoid expensive surprises with our field inspection guide covering engines, transoms, and sea trials.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[hsl(var(--primary))]">
                    <span>Read guide</span>
                    <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
