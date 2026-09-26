import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  getGetMarineConditionsQueryKey,
  getSearchMarineLocationsQueryKey,
  useGetMarineConditions,
  useSearchMarineLocations,
} from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import {
  ArrowDownRight,
  ArrowRight,
  AlertTriangle,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Compass,
  Droplets,
  Facebook,
  Fish,
  Instagram,
  Linkedin,
  Loader2,
  MapPin,
  Menu,
  RefreshCw,
  Search,
  ShipWheel,
  Sparkles,
  Star,
  Thermometer,
  Umbrella,
  Waves,
  Wind,
  X,
  Youtube,
} from 'lucide-react';
import { FromTheWaterSection } from '@/components/FromTheWaterSection';
import { CommunityPage } from '@/components/CommunityPage';
import { CommunityStoryDetailPage } from '@/components/CommunityStoryDetailPage';
import { UsedBoatBuyingGuideArticle } from '@/components/UsedBoatBuyingGuideArticle';
import { ReadTheWaterArticle } from '@/components/ReadTheWaterArticle';
import { MarketplaceApp } from '@/marketplace/MarketplaceApp';
import { subscribeNewsletter } from '@/lib/community-store';

const queryClient = new QueryClient();

const images = {
  hero: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1800',
  wake: 'https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg?auto=compress&cs=tinysrgb&w=1400',
  sunset: 'https://images.pexels.com/photos/163236/lake-water-sky-sunset-163236.jpeg?auto=compress&cs=tinysrgb&w=1400',
  fishing: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1100',
  marina: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1100',
  sail: 'https://images.pexels.com/photos/1025469/pexels-photo-1025469.jpeg?auto=compress&cs=tinysrgb&w=1100',
  deck: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1100',
};

const articles = [
  {
    id: '002',
    category: 'Maintenance',
    title: 'The Complete Boat Maintenance Checklist',
    subtitle: 'What to Check Before, During & After Every Season',
    excerpt: 'A practical year-round guide to keeping your boat ready, reliable, and prepared for the water.',
    author: 'Lyman Marine Editorial Desk',
    date: 'Published September 13, 2026',
    readTime: '18 min read',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '003',
    slug: '10-things-to-check-before-buying-a-used-boat',
    category: 'Boat Buying',
    title: '10 Things to Check Before Buying a Used Boat',
    subtitle: 'A Practical Field Guide to Avoiding Costly Surprises on the Water',
    excerpt: 'How to inspect hull integrity, engines, hours, electronics, running gear, and trailers before making an offer.',
    author: 'Lyman Marine Editorial Desk',
    date: 'Published September 13, 2026',
    readTime: '16 min read',
    image: '/used-boat-cover.jpg',
  },
  {
    id: '004',
    slug: 'how-to-read-the-water-when-fishing-slows-down',
    category: 'Fishing',
    title: 'How to Read the Water When Fishing Slows Down',
    subtitle: 'Diagnosing Environmental Shifts, Reading Surface Cues, and Adapting When the Bite Suddenly Dies',
    excerpt: 'Tide, temperature, structure, and the subtle environmental signals experienced anglers notice first when activity grinds to a halt.',
    author: 'Rosa Bennett',
    date: 'Published September 24, 2026',
    readTime: '15 min read',
    image: '/reading-the-water/reading-water-cover.jpg',
  },
];

const quickLinks = [
  { label: 'Boat Buying', id: 'buying', path: '/buying' },
  { label: 'Maintenance', id: 'maintenance', path: '/maintenance' },
  { label: 'Marine Electronics', id: 'gear', path: '/gear' },
  { label: 'Fishing', id: 'fishing', path: '/fishing' },
  { label: 'Boat Reviews', id: 'reviews', path: '/reviews' },
  { label: 'Lifestyle', id: 'lifestyle', path: '/lifestyle' },
  { label: 'News', id: 'news', path: '/news' },
  { label: 'Community', id: 'community', path: '/community' },
  { label: 'Marine Conditions', id: 'conditions', path: '/conditions' },
] as const;

const primaryNavLeft = [
  { label: 'Home', id: 'home', path: '/' },
  { label: 'Maintenance', id: 'maintenance', path: '/maintenance' },
  { label: 'Fishing', id: 'fishing', path: '/fishing' },
  { label: 'Lifestyle', id: 'lifestyle', path: '/lifestyle' },
  { label: 'Community', id: 'community', path: '/community' },
] as const;

const primaryNavRight = [
  { label: 'Boat Buying', id: 'buying', path: '/buying', featured: false },
  { label: 'Marine Electronics', id: 'gear', path: '/gear', featured: false },
  { label: 'Boat Reviews', id: 'reviews', path: '/reviews', featured: false },
  { label: 'News', id: 'news', path: '/news', featured: false },
  { label: 'Marine Conditions', id: 'conditions', path: '/conditions', featured: true },
] as const;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Mark() {
  return (
    <span className="relative inline-flex items-center justify-center" aria-label="Lyman Marine mark">
      <span className="absolute h-7 w-7 rotate-45 border border-[hsl(var(--accent))]" />
      <span className="relative text-[11px] font-bold tracking-[.18em] text-[hsl(var(--accent))]">LM</span>
    </span>
  );
}

function Header({ onSearch, solid = false, compact = false }: { onSearch: () => void; solid?: boolean; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const isCurrent = (path: string) => path === '/' ? location === '/' : location.startsWith(path);
  const navLinkClass = (path: string, featured = false) => `nav-link whitespace-nowrap text-[9px] font-semibold uppercase tracking-[.12em] transition hover:text-white ${featured ? 'font-bold text-white' : 'text-white/65'} ${isCurrent(path) ? 'text-[hsl(var(--accent))]' : ''}`;
  return (
    <header className={`${solid ? 'relative bg-[#080b0d]' : 'absolute left-0 right-0 top-0 bg-[#080b0d]/85 backdrop-blur-sm'} z-30 text-white`}>
      <div className={`relative mx-auto flex ${compact ? 'h-[68px] lg:h-[70px]' : 'h-[76px]'} max-w-[1320px] items-center justify-between px-5 lg:px-10`}>
        <button data-testid="button-menu" onClick={() => setOpen(!open)} className="rounded-full border border-white/20 p-2.5 transition hover:border-[hsl(var(--accent))] hover:bg-white/10" aria-label={open ? 'Close sections menu' : 'Open sections menu'} aria-expanded={open}>
          {open ? <X size={18} /> : <Menu size={19} />}
        </button>
        <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center gap-2.5 pr-4 xl:flex">
          {primaryNavLeft.map(({ label, id, path }) => (
            <Link data-testid={`link-nav-${id}`} href={path} key={id} className={navLinkClass(path)} aria-current={isCurrent(path) ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>
        <Link href="/" data-testid="link-centered-brand" className="shrink-0 text-center xl:mx-6" aria-label="Lyman Marine home">
          <span className="display-font text-[18px] leading-none tracking-[.08em]">LYMAN <span className="font-sans text-[9px] font-semibold tracking-[.38em] text-[hsl(var(--accent))]">MARINE</span></span>
        </Link>
        <div className="ml-auto hidden min-w-0 flex-1 items-center justify-end gap-2 pl-4 xl:flex">
          <nav aria-label="Boating navigation" className="flex min-w-0 items-center gap-2.5">
            {primaryNavRight.map(({ label, id, path, featured }) => (
              <Link data-testid={`link-nav-${id}`} href={path} key={id} className={navLinkClass(path, featured)} aria-current={isCurrent(path) ? 'page' : undefined}>{label}</Link>
            ))}
          </nav>
          <button data-testid="button-search" onClick={onSearch} className="ml-1 rounded-full border border-white/20 p-2.5 transition hover:border-white hover:bg-white/10" aria-label="Open search"><Search size={16} /></button>
        </div>
        <button data-testid="button-search-mobile" onClick={onSearch} className="ml-auto rounded-full border border-white/20 p-3 transition hover:border-white hover:bg-white/10 xl:hidden" aria-label="Open search"><Search size={17} /></button>
      </div>
      {open && (
        <div className="glass-dark border-t border-white/15 px-5 py-5" data-testid="menu-sections">
          <div className="mx-auto grid max-w-[1320px] gap-7 sm:grid-cols-2">
            <div>
              <p className="fine-label text-[hsl(var(--accent))]">The magazine</p>
              <div className="mt-2 grid grid-cols-2 gap-x-5">
                {primaryNavLeft.map(({ label, id, path }) => (
                  <Link data-testid={`link-mobile-${id}`} href={path} key={id} className={`border-b border-white/10 py-3 text-left text-xs uppercase tracking-[.13em] transition hover:text-[hsl(var(--accent))] ${isCurrent(path) ? 'text-[hsl(var(--accent))]' : 'text-white/80'}`} onClick={() => setOpen(false)}>{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="fine-label text-[hsl(var(--accent))]">On the water</p>
              <div className="mt-2 grid grid-cols-2 gap-x-5">
                {primaryNavRight.map(({ label, id, path, featured }) => (
                  <Link data-testid={`link-mobile-${id}`} href={path} key={id} className={`border-b border-white/10 py-3 text-left text-xs uppercase tracking-[.13em] transition hover:text-[hsl(var(--accent))] ${featured ? 'font-bold text-white' : isCurrent(path) ? 'text-[hsl(var(--accent))]' : 'text-white/80'}`} onClick={() => setOpen(false)}>{label}</Link>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 border-t border-white/15 pt-5 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-[#0d2238] to-[#0a1628] p-4 border border-[hsl(var(--accent))]/30 shadow-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-400 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#0a1628]">Coming Soon</span>
                    <span className="text-xs font-extrabold tracking-wider uppercase text-white">Lyman Marine Marketplace</span>
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    Curated boat marketplace, certified marine dealers, and boat valuation tools launching soon.
                  </p>
                </div>
                <Link
                  data-testid="link-menu-marketplace"
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-5 py-2.5 text-xs font-bold uppercase tracking-[.14em] text-[#0a1628] hover:brightness-110 transition shrink-0"
                  onClick={() => setOpen(false)}
                >
                  <ShipWheel size={15} />
                  <span>MARKETPLACE</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();
  const results = useMemo(() => {
    const searchableStories = [
      ...articles.map((article) => ({ ...article, path: `/story/${article.id}` })),
      {
        id: 'beginner-guide',
        category: 'Boat Buying',
        title: beginnerBoatGuide.title,
        excerpt: beginnerBoatGuide.copy,
        author: 'Lyman Marine desk',
        date: 'Updated seasonally',
        image: images.sail,
        path: `/topic/buying/${slugify(beginnerBoatGuide.title)}`,
      },
      {
        id: 'buyer-field-guide',
        category: 'Boat Buying',
        title: buyerFieldGuide.title,
        excerpt: buyerFieldGuide.copy,
        author: 'Lyman Marine desk',
        date: 'Updated seasonally',
        image: images.wake,
        path: `/topic/buying/${slugify(buyerFieldGuide.title)}`,
      },
    ];
    if (!query.trim()) return searchableStories.slice(0, 4);
    return searchableStories.filter((article) => `${article.title} ${article.category} ${article.excerpt}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgba(12,35,50,.72)] px-4 pt-20 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search Lyman Marine">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[hsl(var(--card))] shadow-2xl animate-scale">
        <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-5 py-4">
          <Search size={19} className="text-[hsl(var(--accent))]" />
          <input data-testid="input-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search boat buying, tides, engines..." className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[hsl(var(--muted-foreground))]" />
          <button data-testid="button-close-search" onClick={onClose} className="rounded-full p-1.5 hover:bg-[hsl(var(--muted))]" aria-label="Close search"><X size={18} /></button>
        </div>
        <div className="p-3">
          <p className="fine-label px-3 pb-2 pt-1 text-[hsl(var(--muted-foreground))]">{query ? `${results.length} stories found` : 'Popular in the magazine'}</p>
          {results.map((article) => (
              <button data-testid={`result-search-${article.id}`} key={article.id} onClick={() => { onClose(); setLocation(article.path); }} className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-[hsl(var(--muted))]">
              <SafeImage src={article.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
              <span><span className="fine-label text-[hsl(var(--accent))]">{article.category}</span><span className="mt-1 block display-font text-lg leading-tight">{article.title}</span></span>
            </button>
          ))}
          {!results.length && <p className="px-3 py-8 text-sm text-[hsl(var(--muted-foreground))]">No stories yet. Try “engine” or “fishing”.</p>}
        </div>
      </div>
    </div>
  );
}

type MarineLocation = {
  name: string;
  label: string;
  state?: string;
  latitude: number;
  longitude: number;
};

type MarineForecast = {
  date?: string;
  name?: string | null;
  temperatureF?: number | null;
  shortForecast?: string | null;
  windSpeed?: { value?: number | null; range?: string | null } | null;
  windDirection?: string | null;
  precipitationChance?: number | null;
};

type MarinePayload = {
  location: MarineLocation;
  fetchedAt: string;
  current: {
    temperatureF?: number | null;
    description?: string | null;
    windMph?: number | null;
    windRange?: string | null;
    windDirection?: string | null;
    humidity?: number | null;
    precipitationChance?: number | null;
  };
  waves: {
    heightFt?: number | null;
    periodSeconds?: number | null;
    conditions?: string | null;
    source?: string | null;
  };
  water: { temperatureF?: number | null; source?: string | null };
  tide?: {
    stationName?: string | null;
    distanceMiles?: number | null;
    phase?: string | null;
    nextHigh?: { time?: string | null; heightFt?: number | null } | null;
    nextLow?: { time?: string | null; heightFt?: number | null } | null;
    source?: string | null;
  } | null;
  alerts: Array<{
    event?: string | null;
    headline?: string | null;
    severity?: string | null;
    expires?: string | null;
  }>;
  forecast: MarineForecast[];
  rating: { label?: string; tone?: string; reasons?: string[] };
  sources: Array<{ name?: string; url?: string; note?: string }>;
};

function formatValue(value: number | null | undefined, suffix: string) {
  return value === null || value === undefined || !Number.isFinite(value)
    ? "—"
    : `${Math.round(value * 10) / 10}${suffix}`;
}

function formatTimestamp(value?: string) {
  if (!value) return "Waiting for live data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Timestamp unavailable";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatForecastDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

function formatTideTime(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function ConditionMetric({
  label,
  value,
  detail,
  icon,
  source,
}: {
  label: string;
  value: string;
  detail?: string;
  icon: ReactNode;
  source?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
      <div className="flex items-center justify-between gap-3 text-[hsl(var(--muted-foreground))]">
        <span className="fine-label">{label}</span>
        <span className="text-[hsl(var(--accent))]">{icon}</span>
      </div>
      <div className="mt-5 display-font text-4xl text-[hsl(var(--primary))]">{value}</div>
      <p className="mt-2 min-h-5 text-sm text-[hsl(var(--muted-foreground))]">{detail ?? "Live reading unavailable"}</p>
      {source && <p className="mt-3 text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">{source}</p>}
    </div>
  );
}

function MarineConditionsPage() {
  const defaultLocation = "Miami, Florida";
  const [locationQuery, setLocationQuery] = useState(defaultLocation);
  const [searchDraft, setSearchDraft] = useState(defaultLocation);
  const [searchRequested, setSearchRequested] = useState(false);
  const [isTypingLocation, setIsTypingLocation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const locationSearchValue = isTypingLocation ? searchTerm : searchDraft.trim();
  const typedLocationValue = searchDraft.trim();
  const locationSearch = useSearchMarineLocations(
    { q: locationSearchValue },
    {
      query: {
        queryKey: getSearchMarineLocationsQueryKey({ q: locationSearchValue }),
        enabled: (isTypingLocation || searchRequested) && locationSearchValue.length >= 2,
        staleTime: 5 * 60 * 1000,
        retry: false,
      },
    },
  );
  const conditionsQuery = useGetMarineConditions(
    { query: locationQuery },
    {
      query: {
        queryKey: getGetMarineConditionsQueryKey({ query: locationQuery }),
        enabled: Boolean(locationQuery),
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
        refetchInterval: 15 * 60 * 1000,
        refetchIntervalInBackground: false,
        retry: 1,
      },
    },
  );
  const data = conditionsQuery.data as unknown as MarinePayload | undefined;
  const ratingTone =
    data?.rating?.tone === "poor"
      ? "bg-red-950 text-red-100 border-red-400/40"
      : data?.rating?.tone === "caution"
        ? "bg-amber-950 text-amber-100 border-amber-400/40"
        : "bg-emerald-950 text-emerald-100 border-emerald-400/40";

  useEffect(() => {
    document.title = "Marine Conditions — Lyman Marine";
  }, []);

  useEffect(() => {
    if (!isTypingLocation) return;
    const next = searchDraft.trim();
    if (next.length < 2) {
      setSearchTerm("");
      return;
    }
    const timeout = window.setTimeout(() => setSearchTerm(next), 250);
    return () => window.clearTimeout(timeout);
  }, [isTypingLocation, searchDraft]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = searchDraft.trim();
    if (next.length < 2) return;
    setIsTypingLocation(false);
    setSearchRequested(true);
  }

  function selectLocation(location: MarineLocation) {
    setLocationQuery(location.label);
    setSearchDraft(location.label);
    setIsTypingLocation(false);
    setSearchRequested(false);
  }

  const suggestionsReady = searchRequested || (isTypingLocation && searchTerm === typedLocationValue);

  return (
    <div className="paper-grain min-h-screen overflow-hidden">
      <Header compact solid onSearch={() => undefined} />
      <main className="bg-[hsl(var(--background))]">
        <section className="bg-[hsl(var(--primary))] px-5 pb-14 pt-12 text-white lg:px-10 lg:pb-20 lg:pt-18">
          <div className="mx-auto max-w-[1320px]">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3 text-[hsl(var(--accent))]">
                <span className="h-px w-12 bg-[hsl(var(--accent))]" />
                <span className="fine-label">Live desk / NOAA + NWS</span>
              </div>
              <h1 className="display-font text-5xl leading-[.9] tracking-[-.045em] md:text-7xl">Marine conditions.</h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                Fresh weather, wind, waves, water temperature, tides, hazards, and a seven-day outlook for the U.S. boating location you choose.
              </p>
            </div>
            <form onSubmit={submitSearch} className="mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <MapPin size={18} className="shrink-0 text-[hsl(var(--accent))]" />
                <input
                  value={searchDraft}
                  onChange={(event) => {
                    setSearchDraft(event.target.value);
                    setSearchRequested(false);
                    setIsTypingLocation(true);
                  }}
                  placeholder="Search Miami, Lake Tahoe, Charleston marina..."
                  aria-label="Search a U.S. boating location"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                />
              </label>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-[hsl(var(--accent-foreground))] transition hover:brightness-110">
                Find conditions <ArrowRight size={16} />
              </button>
            </form>
            {isTypingLocation && typedLocationValue.length >= 2 && !suggestionsReady && <p className="mt-3 text-sm text-white/60">Finding nearby U.S. locations…</p>}
            {suggestionsReady && locationSearch.isFetching && <p className="mt-3 text-sm text-white/60">Searching U.S. locations…</p>}
            {suggestionsReady && locationSearch.isError && <p className="mt-3 text-sm text-amber-200">Location search is temporarily unavailable. Try the full city and state.</p>}
            {suggestionsReady && locationSearch.data?.locations?.length ? (
              <div className="mt-3 max-w-3xl overflow-hidden rounded-xl border border-white/15 bg-[#0b1a26] shadow-2xl">
                {locationSearch.data.locations.slice(0, 5).map((location) => (
                  <button
                    type="button"
                    key={`${location.label}-${location.latitude}`}
                    onClick={() => selectLocation(location as MarineLocation)}
                    className="flex w-full items-start gap-3 border-b border-white/10 px-4 py-3 text-left text-sm text-white/80 transition last:border-0 hover:bg-white/10"
                  >
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" />
                    <span>{location.label}</span>
                  </button>
                ))}
              </div>
            ) : null}
            {suggestionsReady && !locationSearch.isFetching && !locationSearch.isError && locationSearch.data && !locationSearch.data.locations.length ? (
              <p className="mt-3 max-w-3xl text-sm text-amber-200">No U.S. locations matched that search. Try a nearby city, lake, coastline, or marina with its state.</p>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-12 lg:px-10 lg:py-20">
          {conditionsQuery.isLoading && (
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8">
              <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]"><RefreshCw size={18} className="animate-spin text-[hsl(var(--accent))]" /> Fetching the latest conditions for {locationQuery}…</div>
            </div>
          )}
          {conditionsQuery.isError && (
            <div className="rounded-2xl border border-red-300/50 bg-red-50 p-6 text-red-950">
              <div className="flex items-start gap-3"><AlertTriangle size={20} className="mt-0.5 shrink-0" /><div><h2 className="display-font text-2xl">Live data is unavailable right now.</h2><p className="mt-2 text-sm">We could not retrieve a current NOAA/NWS reading for “{locationQuery}”. Nothing on this page is simulated. Try another U.S. location or refresh in a moment.</p></div></div>
            </div>
          )}
          {data && data.location && (
            <>
              <div className="flex flex-col justify-between gap-6 border-b border-[hsl(var(--border))] pb-8 md:flex-row md:items-end">
                <div>
                  <div className="flex items-center gap-2 text-[hsl(var(--accent))]"><MapPin size={16} /><span className="fine-label">Selected boating location</span></div>
                  <h2 className="display-font mt-3 text-4xl text-[hsl(var(--primary))] md:text-6xl">{data.location?.label || locationQuery}</h2>
                   <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Live reading fetched {formatTimestamp(data.fetchedAt)} · refreshes every 15 minutes while this page is open</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => conditionsQuery.refetch()} disabled={conditionsQuery.isFetching} className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-4 py-2 text-xs font-bold text-[hsl(var(--primary))] transition hover:border-[hsl(var(--accent))] disabled:opacity-50">
                    <RefreshCw size={14} className={conditionsQuery.isFetching ? "animate-spin" : ""} /> Refresh
                  </button>
                  <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[.14em] ${ratingTone}`}><span className="h-2 w-2 rounded-full bg-current" /> {data.rating?.label ?? "Unavailable"}</span>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ConditionMetric label="Weather" value={formatValue(data.current?.temperatureF, "°F")} detail={data.current?.description ?? undefined} icon={<CloudSun size={21} />} />
                <ConditionMetric label="Wind" value={formatValue(data.current?.windMph, " mph")} detail={[data.current?.windDirection, data.current?.windRange ? `${data.current.windRange} mph` : null].filter(Boolean).join(" · ") || undefined} icon={<Wind size={21} />} />
                <ConditionMetric label="Waves" value={formatValue(data.waves?.heightFt, " ft")} detail={[data.waves?.conditions, data.waves?.periodSeconds ? `${data.waves.periodSeconds}s period` : null].filter(Boolean).join(" · ") || undefined} source={data.waves?.source} icon={<Waves size={21} />} />
                <ConditionMetric label="Water temperature" value={formatValue(data.water?.temperatureF, "°F")} detail={data.water?.temperatureF == null ? "No nearby NOAA reading" : "Nearby surface reading"} source={data.water?.source} icon={<Thermometer size={21} />} />
                <ConditionMetric label="Tide" value={data.tide?.phase ?? "Unavailable"} detail={data.tide?.stationName ? `${data.tide.stationName}${data.tide.distanceMiles ? ` · ${data.tide.distanceMiles} mi away` : ""}` : "No nearby NOAA station"} source={data.tide?.source} icon={<Compass size={21} />} />
                <ConditionMetric label="Rain chance" value={formatValue(data.current?.precipitationChance, "%")} detail={data.current?.humidity == null ? undefined : `${Math.round(data.current.humidity)}% humidity`} icon={<Umbrella size={21} />} />
                <ConditionMetric label="Next high" value={formatTideTime(data.tide?.nextHigh?.time)} detail={data.tide?.nextHigh?.heightFt == null ? undefined : `${formatValue(data.tide.nextHigh.heightFt, " ft")} predicted`} icon={<ArrowDownRight size={21} />} />
                <ConditionMetric label="Next low" value={formatTideTime(data.tide?.nextLow?.time)} detail={data.tide?.nextLow?.heightFt == null ? undefined : `${formatValue(data.tide.nextLow.heightFt, " ft")} predicted`} icon={<ArrowDownRight size={21} />} />
              </div>

              <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
                <section className="rounded-2xl bg-[hsl(var(--primary))] p-6 text-white lg:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div><span className="fine-label text-[hsl(var(--accent))]">Boating-condition rating</span><h3 className="display-font mt-3 text-4xl">{data.rating?.label ?? "Unavailable"}</h3></div>
                    <GaugeIcon />
                  </div>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">A practical signal based on the latest wind, wave, precipitation, and active NWS hazard data. Always check your local forecast and vessel limits before leaving the dock.</p>
                  <div className="mt-6 flex flex-wrap gap-2">{(data.rating?.reasons ?? []).map((reason) => <span key={reason} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/75">{reason}</span>)}</div>
                </section>
                <section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 lg:p-8">
                  <div className="flex items-center gap-3 text-[hsl(var(--accent))]"><AlertTriangle size={18} /><span className="fine-label">NWS advisories</span></div>
                  {(data.alerts ?? []).length ? <div className="mt-5 space-y-4">{(data.alerts ?? []).slice(0, 3).map((alert, index) => <div key={`${alert.event}-${index}`} className="border-t border-[hsl(var(--border))] pt-4"><p className="text-sm font-bold text-[hsl(var(--primary))]">{alert.event ?? "Active advisory"}</p><p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{alert.headline ?? "Check the NWS alert details before departure."}</p></div>)}</div> : <p className="mt-5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">No active NWS advisories were reported for this point when the page was fetched.</p>}
                </section>
              </div>

              <section className="mt-12">
                <div className="mb-6 flex items-end justify-between gap-5 border-b border-[hsl(var(--border))] pb-5"><div><span className="fine-label text-[hsl(var(--accent))]">Seven-day outlook</span><h3 className="display-font mt-2 text-4xl text-[hsl(var(--primary))] md:text-5xl">Plan the next launch.</h3></div><CloudSun className="hidden text-[hsl(var(--accent))] md:block" size={28} /></div>
                {(data.forecast ?? []).length ? <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">{(data.forecast ?? []).map((period, index) => <div key={`${period.date}-${index}`} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4"><span className="fine-label text-[hsl(var(--accent))]">{index === 0 ? "Today" : formatForecastDate(period.date)}</span><p className="mt-4 display-font text-3xl text-[hsl(var(--primary))]">{formatValue(period.temperatureF, "°")}</p><p className="mt-2 min-h-10 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{period.shortForecast ?? "Forecast unavailable"}</p><p className="mt-4 border-t border-[hsl(var(--border))] pt-3 text-xs text-[hsl(var(--muted-foreground))]">{period.windDirection ?? "Wind"} {period.windSpeed?.range ?? (period.windSpeed?.value != null ? `${Math.round(period.windSpeed.value)} mph` : "—")}</p><p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">{period.precipitationChance == null ? "Rain —" : `Rain ${Math.round(period.precipitationChance)}%`}</p></div>)}</div> : <p className="rounded-xl border border-dashed border-[hsl(var(--border))] p-6 text-sm text-[hsl(var(--muted-foreground))]">The seven-day forecast is not available for this location right now.</p>}
              </section>

              <section className="mt-12 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-6 lg:p-8">
                <div className="flex items-center gap-3 text-[hsl(var(--accent))]"><Sparkles size={17} /><span className="fine-label">Live data sources</span></div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">{(data.sources ?? []).map((source) => <a key={source.name} href={source.url} target="_blank" rel="noreferrer" className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition hover:-translate-y-0.5 hover:border-[hsl(var(--accent))]"><p className="text-sm font-bold text-[hsl(var(--primary))]">{source.name}</p><p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{source.note}</p></a>)}</div>
                 <p className="mt-6 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Lyman Marine requests fresh readings when this page opens and refreshes them automatically while the page is open. No private API key is required for these public U.S. sources. Tide, water-temperature, and wave coverage varies by location; unavailable readings are shown rather than estimated.</p>
              </section>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function GaugeIcon() {
  return <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-[hsl(var(--accent))]"><Compass size={26} /></div>;
}

function Hero({ onSearch }: { onSearch: () => void }) {
  return (
    <section id="top" className="relative flex min-h-[720px] items-end overflow-hidden bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] lg:min-h-[790px]">
      <SafeImage src={images.hero} alt="A boat cutting across open blue water" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,32,48,.88)_0%,rgba(10,32,48,.57)_42%,rgba(10,32,48,.12)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,32,48,.65),transparent_56%)]" />
      <Header onSearch={onSearch} />
      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-16 pt-36 lg:px-10 lg:pb-24">
        <div className="max-w-3xl animate-rise">
            <div className="mb-6 flex items-center gap-3 text-[hsl(var(--accent))]">
            <span className="h-px w-12 bg-[hsl(var(--accent))]" />
             <span className="fine-label">Issue 04 / Summer field guide</span>
          </div>
           <h1 className="display-font max-w-3xl text-[clamp(3.8rem,8.5vw,8.2rem)] leading-[.86] tracking-[-.055em]">The boating life,<br /><em className="font-normal text-[hsl(var(--accent))]">from every angle.</em></h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75 lg:text-xl">News, reviews, buying guides, and maintenance reports for people who spend time on the water.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button data-testid="button-explore-stories" onClick={() => scrollToId('latest')} className="group inline-flex items-center gap-3 rounded-full bg-[hsl(var(--accent))] px-5 py-3 text-sm font-bold text-[hsl(var(--accent-foreground))] transition hover:gap-4">Explore the latest <ArrowRight size={16} /></button>
            <button data-testid="button-open-search-hero" onClick={onSearch} className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"><Search size={15} /> Search the magazine</button>
          </div>
        </div>
        <div className="mt-20 flex items-end justify-between border-t border-white/25 pt-5 text-xs text-white/65 lg:mt-28">
          <div className="flex gap-7"><span><strong className="mr-1 text-white">EST.</strong> 1978</span><span><strong className="mr-1 text-white">50</strong> states covered</span><span className="hidden sm:inline"><strong className="mr-1 text-white">01</strong> good community</span></div>
           <span className="hidden items-center gap-2 sm:flex"><Waves size={14} className="text-[hsl(var(--accent))]" /> Practical reporting</span>
        </div>
      </div>
    </section>
  );
}

function TopicRail() {
  return (
    <section className="overflow-hidden border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="marquee-track flex w-max gap-10 py-4 text-[11px] font-bold uppercase tracking-[.17em] text-[hsl(var(--muted-foreground))]">
        {[...quickLinks, ...quickLinks].map(({ label, id, path }, index) => <Link data-testid={`rail-topic-${index}`} href={path} key={`${id}-${index}`} className="flex items-center gap-10 transition hover:text-[hsl(var(--accent))]"><span>{label}</span><span className="text-[hsl(var(--accent))]">/</span></Link>)}
      </div>
    </section>
  );
}

function EditionStrip() {
  return (
    <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
      <div className="mx-auto grid max-w-[1320px] gap-4 px-5 py-5 text-[hsl(var(--muted-foreground))] sm:grid-cols-[1fr_auto_auto] sm:items-center lg:px-10">
         <div className="flex items-center gap-3"><span className="editorial-number">LM / 04</span><span className="h-px w-8 bg-[hsl(var(--accent))]" /><span className="fine-label">The summer issue</span></div>
         <span className="text-xs">Reporting from the ramp, helm, and fish box</span>
        <Link data-testid="link-about-desk" href="/about" className="inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))] transition hover:text-[hsl(var(--accent))]">Meet the desk <ArrowRight size={14} /></Link>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, copy, id }: { eyebrow: string; title: string; copy?: string; id?: string }) {
  return (
    <div id={id} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <div className="mb-3 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">{eyebrow}</span></div>
        <h2 className="display-font max-w-2xl text-4xl leading-[.98] tracking-[-.035em] text-[hsl(var(--primary))] md:text-5xl">{title}</h2>
      </div>
      {copy && <p className="max-w-sm text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{copy}</p>}
    </div>
  );
}

function LatestStories({ saved, onSave }: { saved: string[]; onSave: (id: string) => void }) {
  return (
    <section id="latest" className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      <SectionIntro eyebrow="Latest stories" title="News, reviews, and boating advice." copy="Reporting, buying guidance, and practical information for people who own and use boats." />
      <div className="grid gap-5 lg:grid-cols-[1.38fr_.62fr]">
        <Link
          href={`/story/${articles[0].id}`}
          data-testid={`link-story-${articles[0].id}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
        >
          <div className="image-zoom relative h-64 sm:h-72 lg:h-[340px] w-full overflow-hidden bg-[hsl(var(--muted))]">
            <SafeImage
              src={articles[0].image}
              alt={articles[0].title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-6 sm:p-7 lg:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="fine-label text-[hsl(var(--accent))]">{articles[0].category}</span>
                  <span className="rounded-full bg-[hsl(var(--accent))]/10 px-2.5 py-0.5 text-[10px] font-bold text-[hsl(var(--accent))]">
                    Featured Checklist
                  </span>
                </div>
                <button
                  data-testid={`button-save-${articles[0].id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onSave(articles[0].id);
                  }}
                  className="rounded-full border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--accent))]"
                  aria-label="Save story"
                >
                  <Bookmark size={16} fill={saved.includes(articles[0].id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <h3 className="display-font max-w-2xl text-3xl leading-[1.02] tracking-[-.03em] text-[hsl(var(--primary))] sm:text-4xl lg:text-[42px]">
                {articles[0].title}
              </h3>
              {articles[0].subtitle && (
                <p className="mt-2.5 text-base font-semibold text-[hsl(var(--accent))] sm:text-lg">
                  {articles[0].subtitle}
                </p>
              )}
              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                {articles[0].excerpt}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))]">
              <span>{articles[0].author} · {articles[0].date}</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-[hsl(var(--primary))] transition group-hover:text-[hsl(var(--accent))]">
                Read checklist <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Link>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {articles.slice(1, 3).map((article) => <StoryCard key={article.id} article={article} saved={saved} onSave={onSave} />)}
        </div>
      </div>
      <div className="mt-5 grid gap-5 border-t border-[hsl(var(--border))] pt-5 sm:grid-cols-2">
        {articles.slice(3).map((article) => (
          <Link href={`/story/${article.id}`} data-testid={`link-current-${article.id}`} key={article.id} className="group flex items-start justify-between gap-5 py-2 transition hover:-translate-y-0.5">
            <div className="min-w-0 flex-1"><span className="fine-label text-[hsl(var(--accent))]">{article.category}</span><h3 className="display-font mt-2 text-2xl leading-tight text-[hsl(var(--primary))]">{article.title}</h3><p className="mt-2 max-w-md text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{article.excerpt}</p></div>
            <div className="image-zoom h-20 w-24 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32"><SafeImage data-testid={`img-current-${article.id}`} src={article.image} alt={article.title} className="h-full w-full object-cover" /></div>
            <ArrowRight size={18} className="mt-1 shrink-0 text-[hsl(var(--muted-foreground))] transition group-hover:translate-x-1 group-hover:text-[hsl(var(--accent))]" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function StoryCard({ article, saved, onSave }: { article: typeof articles[number]; saved: string[]; onSave: (id: string) => void }) {
  const targetUrl = (article as any).slug ? `/${(article as any).slug}` : `/story/${article.id}`;
  return (
    <Link href={targetUrl} data-testid={`link-story-${article.id}`} className="group grid overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:grid-cols-[.86fr_1.14fr] lg:grid-cols-[.9fr_1.1fr]">
      <div className="image-zoom min-h-[220px] overflow-hidden sm:min-h-full"><SafeImage src={article.image} alt={article.title} className="h-full w-full object-cover" /></div>
      <div className="flex flex-col justify-between p-5 lg:p-6">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="fine-label text-[hsl(var(--accent))]">{article.category}</span>
            <button data-testid={`button-save-${article.id}`} onClick={(event) => { event.preventDefault(); onSave(article.id); }} className="text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--accent))]" aria-label="Save story">
              <Bookmark size={16} fill={saved.includes(article.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <h3 className="display-font text-2xl leading-[1.02] tracking-[-.025em] text-[hsl(var(--primary))]">{article.title}</h3>
          {(article as any).subtitle && (
            <p className="mt-1.5 text-xs font-semibold text-[hsl(var(--accent))]">
              {(article as any).subtitle}
            </p>
          )}
          <p className="mt-2.5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{article.excerpt}</p>
        </div>
        <div className="mt-6 flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]">
          <span>{article.author}</span>
          <span className="inline-flex items-center gap-1 font-bold text-[hsl(var(--primary))]">
            Read guide <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function FieldNotes() {
  const [activeSlide, setActiveSlide] = useState(0);
  const fieldNotes = [
    { number: '01', title: 'Spring commissioning checklist', copy: 'The checks to make before the first launch, from batteries and fluids to safety gear.', image: images.deck, alt: 'Boat deck and helm prepared for a new season' },
    { number: '02', title: 'Boat systems checklist', copy: 'A plain-English review of pumps, switches, batteries, and the equipment below deck.', image: images.marina, alt: 'Boats lined up at a marina' },
    { number: '03', title: 'Weather and local water', copy: 'The forecast, tide, and conditions to check before leaving the dock.', image: images.fishing, alt: 'Angler checking the water from a boat' },
  ];
  const activeNote = fieldNotes[activeSlide];
  const changeSlide = (direction: number) => setActiveSlide((current) => (current + direction + fieldNotes.length) % fieldNotes.length);
  return (
    <section id="maintenance" className="bg-[hsl(var(--primary))] py-20 text-[hsl(var(--primary-foreground))] lg:py-28">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-white/20 pb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">Maintenance and repairs</span></div>
            <h2 className="display-font max-w-2xl text-4xl leading-[.96] tracking-[-.035em] md:text-5xl">Maintenance guides for boat owners.</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/65">Clear checklists for keeping a boat reliable before, during, and after the season.</p>
        </div>
        <div className="overflow-hidden rounded-2xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] shadow-[var(--shadow-lift)]">
          <div key={activeNote.number} className="carousel-slide-enter grid min-h-[420px] lg:grid-cols-[1.15fr_.85fr]">
            <div className="image-zoom relative min-h-[300px] overflow-hidden lg:min-h-[500px]">
              <SafeImage data-testid={`img-field-note-${activeNote.number}`} src={activeNote.image} alt={activeNote.alt} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,28,42,.64),transparent_62%)]" />
              <span className="fine-label absolute bottom-6 left-6 text-white/80 lg:bottom-8 lg:left-8">Lyman Marine / Field Notes</span>
            </div>
            <div className="flex flex-col justify-between p-7 lg:p-10">
              <div className="flex items-center justify-between">
                <span data-testid={`text-field-note-number-${activeNote.number}`} className="fine-label text-[hsl(var(--accent))]">Report {activeNote.number} / 03</span>
                <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">Updated seasonally</span>
              </div>
              <div className="py-12 lg:py-8">
                <h3 data-testid={`text-field-note-title-${activeNote.number}`} className="display-font max-w-lg text-4xl leading-[.94] tracking-[-.03em] md:text-5xl">{activeNote.title}</h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-[hsl(var(--muted-foreground))]">{activeNote.copy}</p>
                <Link data-testid="link-see-maintenance" href="/maintenance" className="mt-7 inline-flex items-center gap-2 border-b border-[hsl(var(--accent))] pb-2 text-sm font-semibold text-[hsl(var(--primary))]">Browse maintenance guides <ArrowRight size={15} /></Link>
              </div>
              <div className="flex items-center justify-between gap-5 border-t border-[hsl(var(--border))] pt-5">
                <div className="flex gap-5" aria-label="Maintenance reports">
                  {fieldNotes.map((note, index) => (
                    <button key={note.number} data-testid={`button-field-note-${note.number}`} onClick={() => setActiveSlide(index)} className={`font-mono text-xs transition ${index === activeSlide ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]'}`} aria-label={`Show report ${note.number}`} aria-current={index === activeSlide ? 'true' : undefined}>
                      <span className={index === activeSlide ? 'border-b-2 border-[hsl(var(--accent))] pb-1' : 'border-b border-transparent pb-1'}>{note.number}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button data-testid="button-field-note-previous" onClick={() => changeSlide(-1)} className="rounded-full border border-[hsl(var(--border))] p-2.5 transition hover:border-[hsl(var(--primary))] hover:bg-white/40" aria-label="Previous maintenance report"><ChevronLeft size={17} /></button>
                  <button data-testid="button-field-note-next" onClick={() => changeSlide(1)} className="rounded-full border border-[hsl(var(--border))] p-2.5 transition hover:border-[hsl(var(--primary))] hover:bg-white/40" aria-label="Next maintenance report"><ChevronRight size={17} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-1 w-full bg-[hsl(var(--border))]" aria-label={`Slide ${activeSlide + 1} of ${fieldNotes.length}`}>
            <div className="h-full bg-[hsl(var(--accent))] transition-[width] duration-500 ease-out" style={{ width: `${((activeSlide + 1) / fieldNotes.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BuyBetter() {
  return (
    <section id="buying" className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-20">
        <div>
          <SectionIntro eyebrow="Boat buying" title="How to choose your next boat." copy="Compare boat types, ownership costs, towing requirements, and the features that matter for your water." />
          <div className="space-y-3">
            {[['The 10 best boats for beginners', `/topic/buying/${slugify(beginnerBoatGuide.title)}`], ['The boat buyer’s field guide', `/topic/buying/${slugify(buyerFieldGuide.title)}`], ['Shop the Lyman shortlist', '/buying']].map(([item, href], index) => <Link data-testid={`button-buying-path-${index}`} href={href} key={item} className="group flex w-full items-center justify-between border-b border-[hsl(var(--border))] py-4 text-left text-sm font-bold transition hover:border-[hsl(var(--accent))]"><span className="flex items-center gap-4"><span className="font-mono text-xs text-[hsl(var(--accent))]">0{index + 1}</span>{item}</span><ArrowDownRight size={18} className="text-[hsl(var(--muted-foreground))] transition group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-[hsl(var(--accent))]" /></Link>)}
          </div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden rounded-2xl bg-[hsl(var(--secondary))] image-zoom">
           <SafeImage src={images.sail} alt="A sailboat moving through still water" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(9,33,48,.8))]" />
           <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white"><div><span className="fine-label text-[hsl(var(--accent))]">Boat buying reports</span><p className="display-font mt-2 max-w-sm text-3xl leading-none">How to choose a boat that fits your needs.</p></div><span className="rounded-full border border-white/35 p-3"><ArrowRight size={18} /></span></div>
        </div>
      </div>
    </section>
  );
}

function GearGuide() {
  return (
    <section id="gear" className="border-y border-[hsl(var(--border))] bg-[hsl(var(--muted))] py-20 lg:py-28">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <SectionIntro eyebrow="Gear reviews" title="Marine gear and electronics reviews." copy="We compare the equipment that makes boating safer, easier, and more enjoyable." />
        <div className="horizontal-snap -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {[
            ['Marine Electronics', 'Detailed reviews, field tests, and equipment notes will be published soon.', 'coming soon'],
            ['Navigation & Helm', 'Detailed reviews, field tests, and equipment notes will be published soon.', 'coming soon'],
            ['Deck Essentials', 'Detailed reviews, field tests, and equipment notes will be published soon.', 'coming soon'],
          ].map(([label, copy, badge], index) => <article data-testid={`card-product-${index}`} key={`gear-card-${index}`} className="relative min-w-[84vw] snap-start rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] md:min-w-0 md:p-5">
            <div className="flex items-center justify-between"><span className="fine-label text-[hsl(var(--accent))]">{label}</span><Star size={16} className="text-[hsl(var(--accent))]" fill="currentColor" /></div>
            <div className="my-5 flex flex-col items-center justify-center gap-2 md:my-8">
              <div className="relative flex h-14 w-28 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] md:h-18 md:w-36">
                <Sparkles size={21} className="text-[hsl(var(--primary))]" />
                <span className="absolute -right-2 -top-2 rounded bg-[hsl(var(--accent))] px-1.5 py-1 text-[9px] font-bold uppercase text-white">{badge}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-900 shadow-2xs">
                <Loader2 size={11} className="animate-spin text-amber-600" />
                <span className="uppercase font-mono text-[10px] tracking-wider">Coming Soon</span>
              </div>
            </div>
            <h3 className="display-font text-xl leading-none md:text-2xl text-[hsl(var(--primary))]">Coming Soon</h3>
            <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))] md:mt-3 md:text-sm">{copy}</p>
             <div className="mt-4 flex items-center justify-between border-t border-[hsl(var(--border))] pt-3 md:mt-5 md:pt-4">
               <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                 <Loader2 size={13} className="animate-spin text-[hsl(var(--accent))]" />
               </div>
               <Link data-testid={`button-view-product-${index}`} href="/gear" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]">See gear <ArrowRight size={13} /></Link>
             </div>
          </article>)}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-[hsl(var(--border))] px-5 py-4 text-xs text-[hsl(var(--muted-foreground))]"><span>Our gear desk is reader-supported. When you buy through a link, we may earn a commission.</span><span className="hidden font-mono md:inline">LM / PICKS / 24</span></div>
      </div>
    </section>
  );
}

function Dispatches() {
  return (
    <section id="fishing" className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <SectionIntro eyebrow="Fishing and lifestyle" title="Boating destinations, fishing reports, and owner stories." copy="Practical trip ideas and first-hand reports from people who spend time on the water." />
          <div className="grid gap-5 sm:grid-cols-2">
            <Link href="/fishing" data-testid="link-fishing-dispatch" className="group">
              <div className="image-zoom overflow-hidden rounded-2xl"><SafeImage src={images.fishing} alt="Angler standing on a boat at sunrise" className="h-64 w-full object-cover" /></div>
              <span className="fine-label mt-4 block text-[hsl(var(--accent))]">Outer Banks · North Carolina</span><h3 className="display-font mt-2 text-2xl leading-tight">Outer Banks fishing report</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">A morning with a fourth-generation charter captain and the fish that make the run worthwhile.</p>
            </Link>
            <Link href="/lifestyle" data-testid="link-lifestyle-dispatch" className="group sm:mt-16">
              <div className="image-zoom overflow-hidden rounded-2xl"><SafeImage src={images.sunset} alt="Sunset reflected across calm water" className="h-64 w-full object-cover" /></div>
              <span className="fine-label mt-4 block text-[hsl(var(--accent))]">Lake Michigan · Michigan</span><h3 className="display-font mt-2 text-2xl leading-tight">Lake Michigan boating guide</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">A practical route plan for choosing a marina, checking the weather, and making the most of a long day.</p>
            </Link>
          </div>
        </div>
         <aside id="reader-log" className="rounded-2xl bg-[hsl(var(--primary))] p-7 text-white lg:p-9">
          <div className="flex items-center justify-between"><span className="fine-label text-[hsl(var(--accent))]">Reader's log</span><Fish size={19} className="text-[hsl(var(--accent))]" /></div>
           <h3 className="display-font mt-20 text-4xl leading-none">Share your boat story with Lyman Marine.</h3>
            <div className="mt-8 border-t border-white/20 pt-5"><p className="text-sm leading-relaxed text-white/65">Send us a launch story, maintenance lesson, fishing report, or favorite destination.</p><Link data-testid="button-share-dispatch" href="/community" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-4 py-2.5 text-sm font-bold text-white">Submit a story <ArrowRight size={15} /></Link></div>
        </aside>
      </div>
    </section>
  );
}

function GuideSpotlight() {
  return (
    <section id="buying" className="bg-[hsl(var(--muted))] py-20 lg:py-28">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[hsl(var(--border))] pb-8 md:flex-row md:items-end">
          <div><div className="mb-3 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">Practical guides</span></div><h2 className="display-font max-w-3xl text-5xl leading-[.92] tracking-[-.04em] text-[hsl(var(--primary))] md:text-7xl">Boat buying guide for first-time owners.</h2></div>
          <p className="max-w-sm text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Our beginner guide is built for the first-time buyer who wants honest tradeoffs, not a showroom sales pitch.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.06fr_.94fr]">
          <Link href={`/topic/buying/${slugify(beginnerBoatGuide.title)}`} data-testid="link-beginner-guide-feature" className="group relative min-h-[510px] overflow-hidden rounded-2xl bg-[hsl(var(--primary))] text-white image-zoom">
            <SafeImage src="/boats/pontoon.jpeg" alt="A pontoon boat moving smoothly on calm lake water" className="absolute inset-0 h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,28,42,.95),rgba(8,28,42,.05)_70%)]" />
            <div className="relative flex h-full flex-col justify-end p-6 lg:p-9">
              <span className="fine-label text-[hsl(var(--accent))]">Lyman Marine / Buying desk</span>
              <h3 className="display-font mt-3 max-w-xl text-3xl leading-[.95] tracking-[-.03em] sm:text-4xl md:text-5xl">
                {beginnerBoatGuide.mainTitle}
                <span className="mt-2 block text-lg font-normal tracking-normal text-white/80 sm:text-xl md:text-2xl">
                  {beginnerBoatGuide.subtitle}
                </span>
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">{beginnerBoatGuide.copy}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--accent))]">Read the full ranking <ArrowRight size={15} /></span>
            </div>
          </Link>
          <div className="rounded-2xl bg-[hsl(var(--card))] p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-5"><span className="fine-label text-[hsl(var(--accent))]">The shortlist</span><span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">01 — 10</span></div>
            <div className="divide-y divide-[hsl(var(--border))]">
              {beginnerBoatGuide.boats.slice(0, 5).map((boat) => <Link href={`/topic/buying/${slugify(beginnerBoatGuide.title)}#${slugify(boat.title)}`} data-testid={`link-beginner-rank-${boat.rank}`} key={boat.rank} className="group flex items-center gap-4 py-4"><span className="editorial-number w-5">{String(boat.rank).padStart(2, '0')}</span><span className="display-font flex-1 text-2xl leading-none text-[hsl(var(--primary))]">{boat.title}</span><ArrowDownRight size={17} className="text-[hsl(var(--muted-foreground))] transition group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-[hsl(var(--accent))]" /></Link>)}
            </div>
             <Link href={`/topic/buying/${slugify(buyerFieldGuide.title)}`} data-testid="link-buyer-field-guide" className="group mt-5 flex items-center justify-between gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4 transition hover:border-[hsl(var(--accent))]">
               <span><span className="fine-label text-[hsl(var(--accent))]">Buying field guide</span><span className="mt-1 block display-font text-2xl leading-tight text-[hsl(var(--primary))]">{buyerFieldGuide.title}</span><span className="mt-2 block text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{buyerFieldGuide.copy}</span></span>
               <ArrowRight size={18} className="shrink-0 text-[hsl(var(--muted-foreground))] transition group-hover:translate-x-1 group-hover:text-[hsl(var(--accent))]" />
             </Link>
            <Link href="/buying" data-testid="link-buying-desk" className="mt-5 inline-flex items-center gap-2 border-b border-[hsl(var(--accent))] pb-2 text-sm font-bold text-[hsl(var(--primary))]">Browse the buyer's desk <ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MagazineMosaic() {
  return (
    <section id="news" className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      <SectionIntro eyebrow="The long read" title="A magazine for the hours between launches." copy="Places, people, and the small discoveries that make boating more than a list of chores." />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <Link href="/fishing" data-testid="link-mosaic-fishing" className="group relative min-h-[570px] overflow-hidden rounded-2xl bg-[hsl(var(--primary))] text-white image-zoom">
          <SafeImage src={images.fishing} alt="An angler standing at the stern in warm morning light" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,28,42,.94),rgba(8,28,42,.05)_66%)]" />
          <div className="relative flex h-full flex-col justify-end p-6 lg:p-9"><span className="fine-label text-[hsl(var(--accent))]">Field report / North Carolina</span><h3 className="display-font mt-3 max-w-2xl text-4xl leading-[.93] md:text-6xl">Where the blue water begins</h3><p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">A morning with a fourth-generation charter captain, the weather window he watches, and the fish that make the run worthwhile.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--accent))]">Read the dispatch <ArrowRight size={15} /></span></div>
        </Link>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <Link href="/lifestyle" data-testid="link-mosaic-lifestyle" className="group grid grid-cols-[.88fr_1.12fr] overflow-hidden border-t border-[hsl(var(--border))] pt-4 sm:block sm:border-0 sm:pt-0">
            <div className="image-zoom overflow-hidden sm:rounded-2xl"><SafeImage src={images.sunset} alt="Sunset across a quiet lake" className="h-36 w-full object-cover sm:h-60" /></div>
            <div className="pl-4 sm:pl-0"><span className="fine-label mt-1 block text-[hsl(var(--accent))] sm:mt-4">Lakes & marinas</span><h3 className="display-font mt-2 text-2xl leading-tight text-[hsl(var(--primary))]">The long way home</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Why an extra hour of light can be the best part of the route.</p></div>
          </Link>
          <Link href="/community" data-testid="link-mosaic-community" className="group grid grid-cols-[.88fr_1.12fr] overflow-hidden border-t border-[hsl(var(--border))] pt-4 sm:block sm:border-0 sm:pt-0">
            <div className="image-zoom overflow-hidden sm:rounded-2xl"><SafeImage src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80" alt="Boat anchored in quiet bay" className="h-36 w-full object-cover sm:h-60" /></div>
            <div className="pl-4 sm:pl-0"><span className="fine-label mt-1 block text-[hsl(var(--accent))] sm:mt-4">From the Water</span><h3 className="display-font mt-2 text-2xl leading-tight text-[hsl(var(--primary))]">What lives in a good dock box</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">A useful inventory from people who have learned to carry the right thing once.</p></div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReviewShelf() {
  return (
    <section id="reviews" className="border-y border-[hsl(var(--border))] bg-[hsl(var(--primary))] py-20 text-white lg:py-24">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-5 border-b border-white/20 pb-8 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">The review file</span></div><h2 className="display-font text-4xl leading-none md:text-5xl">The details behind the shine.</h2></div><Link href="/reviews" data-testid="link-all-reviews" className="inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--accent))]">See all reviews <ArrowRight size={15} /></Link></div>
         <div className="horizontal-snap -mx-5 mt-8 overflow-x-auto px-5 pb-3 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
           <div className="grid w-max auto-cols-[82vw] grid-flow-col gap-0 md:w-auto md:auto-cols-auto md:grid-flow-row md:grid-cols-2 lg:grid-cols-4">
             {pageResources.reviews.map((review, index) => <a href={review.externalUrl} target="_blank" rel="noreferrer" data-testid={`link-home-review-${index}`} key={review.title} className="group snap-start border-r border-white/20 py-5 pr-5 first:pl-0 last:border-r-0 md:border-b md:px-5 md:first:pl-0 lg:border-b-0 lg:first:pl-0 lg:last:border-r-0"><div className="image-zoom mb-5 overflow-hidden"><SafeImage src={review.image} alt={review.title} className="h-36 w-full object-cover opacity-80 grayscale transition group-hover:grayscale-0" /></div><span className="fine-label text-[hsl(var(--accent))]">{review.category}</span><h3 className="display-font mt-2 text-2xl leading-tight">{review.title}</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{review.copy}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white">Read at {review.source} <ArrowRight size={13} /></span></a>)}
           </div>
         </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (email.includes('@')) {
      setIsSubmitting(true);
      await subscribeNewsletter(email, 'footer_tide_report');
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="community" className="bg-[hsl(var(--accent))] py-16 text-[hsl(var(--accent-foreground))] lg:py-20">
      <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-5 md:grid-cols-[1.1fr_.9fr] lg:px-10">
        <div><div className="flex items-center gap-3"><Waves size={19} /><span className="fine-label">The Lyman tide report</span></div><h2 className="display-font mt-4 max-w-xl text-4xl leading-[.96] tracking-[-.03em] md:text-5xl">Get practical boating advice each Friday.</h2><p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">One useful story, one piece of gear, and one boating destination delivered to your inbox.</p></div>
        <div>{submitted ? <div className="rounded-2xl border border-white/35 bg-white/10 p-6"><Check size={22} /><h3 className="display-font mt-4 text-2xl">You're on the list.</h3><p className="mt-2 text-sm text-white/75">We'll meet you in your inbox this Friday.</p></div> : <form onSubmit={handleSubmit} className="rounded-2xl bg-[hsl(var(--primary))] p-3 shadow-[var(--shadow-lift)]"><label htmlFor="newsletter-email" className="sr-only">Email address</label><div className="flex gap-2"><input data-testid="input-newsletter-email" id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" disabled={isSubmitting} className="min-w-0 flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:ring-2 focus:ring-[hsl(var(--accent))]" /><button data-testid="button-newsletter-submit" disabled={isSubmitting} className="rounded-xl bg-[hsl(var(--accent))] px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">{isSubmitting ? 'Joining...' : 'Subscribe'}</button></div><p className="px-2 pt-3 text-[10px] text-white/45">No noise. Unsubscribe anytime. We respect your wake.</p></form>}</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="lifestyle" className="bg-[hsl(var(--primary))] px-5 pb-8 pt-16 text-white lg:px-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.4fr_.8fr_.8fr]">
          <div><div className="flex items-center gap-3"><Mark /><span className="display-font text-xl">LYMAN MARINE</span></div><p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">A trusted field guide for the American boating life. Made on the coast, read everywhere.</p><div className="mt-6 flex gap-2"><button data-testid="social-instagram" className="rounded-full border border-white/20 p-2.5 hover:bg-white/10" aria-label="Instagram"><Instagram size={15} /></button><button data-testid="social-youtube" className="rounded-full border border-white/20 p-2.5 hover:bg-white/10" aria-label="YouTube"><Youtube size={15} /></button><a data-testid="social-facebook" href="https://www.facebook.com/share/1Ex7E9Vhwa/" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 p-2.5 hover:bg-white/10" aria-label="Facebook"><Facebook size={15} /></a><button data-testid="social-linkedin" className="rounded-full border border-white/20 p-2.5 hover:bg-white/10" aria-label="LinkedIn"><Linkedin size={15} /></button></div></div>
          <div><span className="fine-label text-[hsl(var(--accent))]">Explore</span><div className="mt-4 grid gap-3 text-sm text-white/65">{quickLinks.slice(0, 4).map(({ label, id, path }) => <Link data-testid={`footer-link-${id}`} href={path} key={id} className="text-left transition hover:text-white">{label}</Link>)}</div></div>
          <div><span className="fine-label text-[hsl(var(--accent))]">Lyman Marine</span><div className="mt-4 grid gap-3 text-sm text-white/65"><Link href="/about" data-testid="footer-link-about" className="text-left hover:text-white">About the desk</Link><Link href="/contact" data-testid="footer-link-contact" className="text-left hover:text-white">Contact the editors</Link><Link href="/partner" data-testid="footer-link-advertise" className="text-left hover:text-white">Partner with us</Link></div></div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] uppercase tracking-[.13em] text-white/35 sm:flex-row"><span>© Lyman Marine Co.</span><span>Made for the long way around</span></div>
      </div>
    </footer>
  );
}

function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => { document.title = 'Lyman Marine — The boating life, from every angle.'; }, []);
  const toggleSave = (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return (
    <div className="paper-grain min-h-screen overflow-hidden">
      <Hero onSearch={() => setSearchOpen(true)} />
      <TopicRail />
      <EditionStrip />
      <main>
        <LatestStories saved={saved} onSave={toggleSave} />
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10"><div className="rounded-xl border border-dashed border-[hsl(var(--border))] px-4 py-3 text-center fine-label text-[hsl(var(--muted-foreground))]">Advertisement · A quiet place for a good partner</div></div>
        <GuideSpotlight />
        <FieldNotes />
        <MagazineMosaic />
        <GearGuide />
        <ReviewShelf />
        <FromTheWaterSection limit={2} showViewAll={true} />
        <Dispatches />
        <Newsletter />
      </main>
      <Footer />
      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

type ResourceCard = {
  category: string;
  title: string;
  copy: string;
  image: string;
  externalUrl?: string;
  source?: string;
};

const beginnerBoatGuide = {
  title: 'The 10 Best Boats for Beginners: Ranked by Usability, Cost, and Fun',
  mainTitle: 'The 10 Best Boats for Beginners',
  subtitle: 'Ranked by Usability, Cost, and Fun',
  copy: 'A practical ranking of boat types by usability, cost, stability, and the kind of fun they make easiest for a first-time owner.',
  boats: [
    {
      rank: 1,
      title: 'Pontoon',
      image: '/boats/pontoon.jpeg',
      bestFor: 'Families, calm-water cruising, and large-group entertaining.',
      cost: 'Entry-level used boats are often among the most approachable options; newer models climb quickly with engines and furniture.',
      fun: 'The easy kind: swimming, picnics, sunset runs, and room for everyone.',
      why: 'Pontoons are stable, spacious, and predictable at the speeds most new owners use first. Their open deck makes it easy to move around, bring friends, and learn the basics without feeling crowded.',
      perk: 'The wide, flat sides make dock bumpers and low-speed docking less intimidating.',
      pick: 'A modular pontoon such as the Sea-Doo Switch or a well-equipped Avalon.',
    },
    {
      rank: 2,
      title: 'Bowrider',
      image: '/boats/bowrider.jpg',
      bestFor: 'Day cruising, tubing, and casual watersports.',
      cost: 'A broad used market gives buyers room to shop across age, length, and horsepower.',
      fun: 'The most versatile all-rounder for a family that wants to cruise and play.',
      why: 'The open bow adds seating while the traditional V-hull handles lake chop more smoothly than a flat-deck boat. Bowriders are versatile enough for family days without feeling dull when you want to pick up the pace.',
      perk: 'The large used market gives first-time buyers plenty of choice at approachable prices.',
    },
    {
      rank: 3,
      title: 'Aluminum fishing boat',
      image: '/boats/aluminum-fishing-boat.png',
      bestFor: 'Freshwater fishing, rivers, and budget-conscious buyers.',
      cost: 'Lightweight rigs can keep towing, storage, fuel, and service bills in check.',
      fun: 'Quiet mornings, simple gear, and the satisfaction of finding your own water.',
      why: 'Aluminum is light, durable, and forgiving around rocky shorelines and busy docks. A smaller rig is easier to tow, launch, store, and learn to maintain.',
      perk: 'Many can be towed by a crossover or small SUV, depending on the boat, trailer, and vehicle ratings.',
      pick: 'Look at established fishing-boat builders such as Lund or Alumacraft.',
    },
    {
      rank: 4,
      title: 'Center console',
      image: '/boats/center-console.jpg',
      bestFor: 'Saltwater fishing, coastal bays, and rougher open water.',
      cost: 'Expect more spending on saltwater protection, electronics, fuel, and trailer or marina care.',
      fun: 'The most capable choice here for casting, exploring, and changing conditions.',
      why: 'The center helm leaves a clear walking path around the boat, which is useful when fishing and gives the driver good visibility in changing conditions. The open layout is also easy to rinse down.',
      perk: 'A simple fiberglass deck, hose, and regular rinse can keep cleanup straightforward.',
      pick: 'The Boston Whaler 170 Montauk is a well-known example of the format.',
    },
    {
      rank: 5,
      title: 'Deck boat',
      image: '/boats/deck-boat.jpg',
      bestFor: 'Families who want space with more V-hull performance.',
      cost: 'Usually costs more than a comparable runabout because of its size and extra deck space.',
      fun: 'A strong group-day boat that still has enough pace for a towable.',
      why: 'Deck boats widen the bow for extra seating while keeping a conventional hull underneath. They offer a useful middle ground between a pontoon’s room and a runabout’s handling.',
      perk: 'One boat can host a group for a sunset cruise and still tow a tube or wakeboard.',
    },
    {
      rank: 6,
      title: 'Jon boat',
      image: '/boats/jon-boat.jpg',
      bestFor: 'Shallow water, calm rivers, ponds, and solo exploring.',
      cost: 'One of the lowest-cost paths into ownership, especially with a small outboard and basic trailer.',
      fun: 'Uncomplicated and wonderfully direct: launch, explore, fish, load up.',
      why: 'A Jon boat is deliberately simple: a flat-bottomed aluminum hull, bench seats, and a small outboard. Fewer systems mean fewer things to learn and fewer parts to repair.',
      perk: 'It is one of the lowest-cost, lowest-complexity ways to start boating.',
    },
    {
      rank: 7,
      title: 'Fish-and-ski',
      image: '/boats/fish-and-ski.jpg',
      bestFor: 'Families split between fishing and watersports.',
      cost: 'More equipment means more to inspect, store, and maintain than a single-purpose boat.',
      fun: 'The flexible family option when Saturday plans change by the hour.',
      why: 'Fish-and-ski models combine fishing features such as livewells with the seating, swim platforms, and tow points needed for an afternoon on the water.',
      perk: 'The format lets a family explore more than one boating activity before committing to a specialized boat.',
    },
    {
      rank: 8,
      title: 'Small skiff',
      image: '/boats/small-skiff.jpeg',
      bestFor: 'Coastal inlets, flats fishing, and crabbing.',
      cost: 'Low fuel use and simple systems help; coastal corrosion is the expense to respect.',
      fun: 'The reward is access: skinny water, quiet coves, and a very small wake.',
      why: 'Skiffs are light, open, and shallow-draft. They are stable at rest, use little fuel, and can reach places that deeper boats cannot.',
      perk: 'Their size makes solo launching and cleanup much less of a production.',
    },
    {
      rank: 9,
      title: 'Jet boat',
      image: '/boats/jet-boat.jpg',
      bestFor: 'Sandbar hopping, shallow lakes, and family swimming.',
      cost: 'Routine care is familiar, but jet pumps and intakes deserve careful inspection and clean-out habits.',
      fun: 'Fast, lively, and made for days that move between coves and swimming spots.',
      why: 'Jet propulsion draws water in and pushes it out rather than using a conventional exposed propeller. That can make beaching and swimming around the stern feel more comfortable, though the intake still needs care.',
      perk: 'There is no exposed propeller below the boat to strike a shallow bottom.',
    },
    {
      rank: 10,
      title: 'Cuddy cabin',
      image: '/boats/cuddy-cabin.jpg',
      bestFor: 'Day boaters who want a small berth, head, or weather shelter.',
      cost: 'The cabin adds weight, systems, canvas, and upkeep before it adds much cruising range.',
      fun: 'A first taste of overnighting and the freedom to wait out a passing shower.',
      why: 'A cuddy cabin adds a compact enclosed space for storage, a portable or marine toilet, and occasional overnighting. It is a useful bridge toward larger cruising boats, but the extra weight and systems raise the ownership workload.',
      perk: 'It gives a first-time owner a taste of cabin cruising without jumping straight to a large yacht.',
    },
  ],
};

const buyerFieldGuide = {
  title: 'The Boat Buyer’s Field Guide',
  copy: 'The ownership costs, hull tradeoffs, and dockside questions that deserve an answer before you buy.',
};

const pageResources: Record<string, ResourceCard[]> = {
  buying: [
    { category: 'Boat Buying', title: beginnerBoatGuide.title, copy: beginnerBoatGuide.copy, image: '/boats/pontoon.jpeg' },
    { category: 'Boat Buying', title: buyerFieldGuide.title, copy: buyerFieldGuide.copy, image: images.wake },
  ],
  maintenance: [
    { category: 'Engines', title: 'The pre-launch engine check', copy: 'The fluid levels, belts, hoses, and sounds that tell you how your outboard is really feeling.', image: images.deck },
    { category: 'Electrical', title: 'Find the fault before it finds you', copy: 'A plain-English way to map your batteries, breakers, grounds, and the small warning signs on the helm.', image: images.marina },
    { category: 'Bilge pumps', title: 'The bilge pump guide every owner needs', copy: 'What to test, what to carry, and when a quiet bilge is giving you the wrong kind of confidence.', image: images.wake },
    { category: 'Fuel systems', title: 'Fresh fuel, fewer surprises', copy: 'How to inspect tanks, lines, filters, and vents before a long run.', image: images.sail },
    { category: 'Trailers', title: 'A trailer that gets you home', copy: 'Tires, bearings, lights, straps, and the five-minute walkaround worth making every time.', image: images.sunset },
    { category: 'Seasonal checklists', title: 'Put the boat away properly', copy: 'A calm closing ritual for winterizing, covering, and protecting your next season.', image: images.fishing },
  ],
  gear: [
    { category: 'Navigation', title: 'Chartplotters in plain English', copy: 'A practical look at screens, charts, sonar, radar, networking, and what matters for your helm.', image: images.marina },
    { category: 'Fish finders', title: 'How to read the picture below', copy: 'The settings and signals that help you turn a colorful screen into useful information.', image: images.fishing },
    { category: 'Marine radios', title: 'The VHF setup we trust', copy: 'What to look for in a radio, antenna, GPS connection, and the calls every owner should know.', image: images.wake },
    { category: 'Safety gear', title: 'The safety kit that earns its space', copy: 'A thoughtful checklist for life jackets, flares, lights, first aid, and the rest of the locker.', image: images.deck },
    { category: 'Batteries', title: 'Choosing the right battery bank', copy: 'Starting power, house loads, charging, and the upgrade decisions that actually pay off.', image: images.sail },
    { category: 'Cleaning', title: 'Keep the finish, skip the fuss', copy: 'The products and habits that make boat cleaning faster without being hard on the water.', image: images.sunset },
  ],
  fishing: [
    { category: 'Freshwater', title: 'Read the lake before you launch', copy: 'A better way to use depth, temperature, structure, and wind to find active water.', image: images.sunset },
    { category: 'Saltwater', title: 'The first hour offshore', copy: 'Tides, current lines, birds, and the details that make a saltwater morning click.', image: images.fishing },
    { category: 'Fishing boats', title: 'The boat that matches the way you fish', copy: 'What changes between a bay boat, center console, skiff, and walkaround.', image: images.wake },
    { category: 'Fishing tips', title: 'When the bite goes quiet', copy: 'A useful reset for changing depth, moving with the current, and staying patient.', image: images.marina },
    { category: 'Angler electronics', title: 'Build a calmer fishing helm', copy: 'The electronics that help you spend less time guessing and more time casting.', image: images.deck },
    { category: 'Community', title: 'A morning with the people who know the water', copy: 'Stories, techniques, and local knowledge from anglers across the country.', image: images.sail },
  ],
  reviews: [
    { category: 'Boat reviews', title: '2026 Wellcraft 28 T-Top Boat Test', copy: 'A versatile craft for entertaining, fishing, and overnighting, reviewed by Boating Magazine.', image: images.wake, externalUrl: 'https://boatingmag.com/boats/2026-wellcraft-28-t-top-boat-test', source: 'Boating Magazine' },
    { category: 'Boat reviews', title: '2026 Navan T30 Boat Test', copy: 'A closer look at the features that make this new model flexible for real days on the water.', image: images.sail, externalUrl: 'https://boatingmag.com/boats/2026-navan-t30-boat-test', source: 'Boating Magazine' },
    { category: 'Boat reviews', title: '2026 MasterCraft X22 Boat Test', copy: 'A 22-foot watersports boat with a strong first impression and a serious punch.', image: images.deck, externalUrl: 'https://boatingmag.com/boats/2026-mastercraft-x22-boat-test', source: 'Boating Magazine' },
    { category: 'Marine products', title: 'Boating Industry Reveals 2026 Top Products', copy: 'A current look at the marine products getting attention across the industry.', image: images.marina, externalUrl: 'https://boatingindustry.com/features/2026/06/24/boating-industry-reveals-2026-top-products', source: 'Boating Industry' },
  ],
  lifestyle: [
    { category: 'Destinations', title: 'A weekend worth trailering toward', copy: 'Fresh water, quiet coves, and the kind of place that makes the drive disappear.', image: images.sunset },
    { category: 'Lakes & marinas', title: 'The marinas that make a harbor feel like home', copy: 'Notes on launch ramps, fuel docks, local knowledge, and staying a little longer.', image: images.marina },
    { category: 'Boat shows', title: 'How to spend a boat show well', copy: 'A better walk through the aisles, whether you are shopping or just looking.', image: images.wake },
    { category: 'Travel guides', title: 'Plan the trip, leave room for weather', copy: 'Simple planning habits for going farther without making the day feel scheduled.', image: images.sail },
    { category: 'Community stories', title: 'The long way home', copy: 'The best routes are not always the fastest ones. Sometimes they are the ones you remember.', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1600&q=80' },
  ],
  news: [
    { category: 'New boat models', title: '2026 Wellcraft 28 T-Top Boat Test', copy: 'A current boat test covering a versatile platform for entertaining, fishing, and overnighting.', image: images.wake, externalUrl: 'https://boatingmag.com/boats/2026-wellcraft-28-t-top-boat-test', source: 'Boating Magazine' },
    { category: 'Marine technology', title: 'NextBoat Partners with MarineMax for National AI Platform Rollout', copy: 'A real industry update on how artificial intelligence is entering the pre-owned boat marketplace.', image: images.marina, externalUrl: 'https://boatingindustry.com/news/2026/07/01/nextboat-partners-with-marinemax-for-national-ai-platform-rollout', source: 'Boating Industry' },
    { category: 'Regulations', title: 'Hanson Milone Safe Boating Law to Begin April 1', copy: 'A Massachusetts boating-safety update requiring a course for more motorboat operators.', image: images.deck, externalUrl: 'https://boatingindustry.com/news/2026/03/30/hanson-milone-safe-boating-law-to-begin-april-1', source: 'Boating Industry' },
    { category: 'Industry updates', title: 'Boating Industry Reveals 2026 Top Products', copy: 'The latest marine products and innovations recognized by an industry publication.', image: images.sail, externalUrl: 'https://boatingindustry.com/features/2026/06/24/boating-industry-reveals-2026-top-products', source: 'Boating Industry' },
  ],
  community: [
    { category: 'Questions & answers', title: 'Ask the dock', copy: 'A place for honest questions, practical answers, and the things no manual explains.', image: images.deck },
    { category: 'User stories', title: 'The boats that brought us here', copy: 'Owners share the projects, mistakes, and first launches they still talk about.', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1600&q=80' },
    { category: 'Forums', title: 'Join the conversation', copy: 'Talk maintenance, fishing, routes, weather, and gear with people who get it.', image: images.marina },
  ],
};

function InteriorPage({ eyebrow, title, copy, heroImage, children }: { eyebrow: string; title: string; copy: string; heroImage: string; children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => { document.title = `${title} — Lyman Marine`; }, [title]);
  return (
    <div className="paper-grain min-h-screen overflow-hidden">
      <Header solid onSearch={() => setSearchOpen(true)} />
      <main>
        <section className="bg-[hsl(var(--primary))] px-5 py-16 text-white lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-[1320px] items-end gap-10 lg:grid-cols-[1fr_.7fr]">
            <div className="animate-rise">
              <div className="mb-6 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-12 bg-[hsl(var(--accent))]" /><span className="fine-label">{eyebrow}</span></div>
              <h1 className="display-font max-w-4xl text-5xl leading-[.9] tracking-[-.045em] md:text-7xl">{title}</h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">{copy}</p>
            </div>
            <div className="hidden overflow-hidden rounded-2xl lg:block"><SafeImage src={heroImage} alt="" className="h-72 w-full object-cover opacity-80" /></div>
          </div>
        </section>
        {children}
      </main>
      <Footer />
      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

function SafeImage({ src, alt, className, 'data-testid': dataTestId }: { src: string; alt: string; className: string; 'data-testid'?: string }) {
  return <img data-testid={dataTestId} src={src} alt={alt} className={className} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = images.hero; }} />;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ResourceCard({ card, kind }: { card: ResourceCard; kind: keyof typeof pageResources }) {
  const href = card.externalUrl ?? `/topic/${kind}/${slugify(card.title)}`;
  const content = (
    <>
       <div className="image-zoom h-56 overflow-hidden sm:h-64"><SafeImage src={card.image} alt={card.title} className="h-full w-full object-cover" /></div>
       <div className="p-6 lg:p-7"><span className="fine-label text-[hsl(var(--accent))]">{card.category}</span><h2 className="display-font mt-3 text-3xl leading-[1.02] text-[hsl(var(--primary))]">{card.title}</h2><p className="mt-4 text-base leading-relaxed text-[hsl(var(--muted-foreground))]">{card.copy}</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">{card.externalUrl ? `Read at ${card.source}` : 'Read field notes'} <ArrowRight size={13} /></span></div>
    </>
  );
  return (
    card.externalUrl
      ? <a href={href} target="_blank" rel="noreferrer" data-testid={`link-external-${slugify(card.title)}`} className="group block overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">{content}</a>
      : <Link href={href} data-testid={`link-topic-${slugify(card.title)}`} className="group block overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">{content}</Link>
  );
}

function ResourcePage({ kind, eyebrow, title, copy, heroImage }: { kind: keyof typeof pageResources; eyebrow: string; title: string; copy: string; heroImage: string }) {
  const resources = pageResources[kind];
  return (
    <InteriorPage eyebrow={eyebrow} title={title} copy={copy} heroImage={heroImage}>
      <section className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mb-8 flex items-center justify-between border-b border-[hsl(var(--border))] pb-5"><span className="fine-label text-[hsl(var(--accent))]">Latest dispatches</span><span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{String(resources.length).padStart(2, '0')} stories</span></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{resources.map((card) => <ResourceCard key={card.title} kind={kind} card={card} />)}</div>
      </section>
      <section className="bg-[hsl(var(--muted))] px-5 py-14 lg:px-10"><div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-5 rounded-2xl border border-dashed border-[hsl(var(--border))] p-6 md:flex-row md:items-center md:p-8"><div><span className="fine-label text-[hsl(var(--accent))]">The Lyman tide report</span><h2 className="display-font mt-2 text-3xl text-[hsl(var(--primary))]">One smart note for the week ahead.</h2></div><Link href="/#community" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white">Join the list <ArrowRight size={15} /></Link></div></section>
    </InteriorPage>
  );
}

function BeginnerGuideBody() {
  return (
    <div className="mt-12 space-y-14">
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-6 lg:p-8">
        <span className="fine-label text-[hsl(var(--accent))]">The short answer</span>
        <p className="mt-3 text-lg leading-relaxed text-[hsl(var(--primary))]">The best first boat is not the one with the longest feature list. It is the one that matches your water, your passengers, your tow vehicle, and the kind of day you actually want to have.</p>
        <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">This ranking is an editorial starting point, not a universal rule. Before buying, confirm capacity, towing limits, storage, insurance, local safety requirements, and the total cost of ownership.</p>
        <div className="mt-5 border-t border-[hsl(var(--border))] pt-5">
          <span className="fine-label text-[hsl(var(--accent))]">How we ranked them</span>
          <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Usability comes first: how forgiving the boat feels at the ramp, helm, and dock. Cost includes the less glamorous parts of ownership, from storage and towing to fuel and routine service. Fun is the reason to go back out — the range of good days a boat makes easy.</p>
        </div>
      </div>
      <div className="space-y-12">
        {beginnerBoatGuide.boats.map((boat) => (
          <section key={boat.rank} id={slugify(boat.title)} className="scroll-mt-24 border-t border-[hsl(var(--border))] pt-8">
            <div className="flex items-start gap-4">
              <span className="font-mono text-sm font-bold text-[hsl(var(--accent))]">{String(boat.rank).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <h2 className="display-font text-3xl leading-none text-[hsl(var(--primary))] md:text-4xl">{boat.title}</h2>
                  <span className="font-mono text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Rank #{boat.rank}</span>
                </div>

                {boat.image && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--muted))] shadow-sm">
                    <SafeImage
                      src={boat.image}
                      alt={boat.title}
                      className="h-60 w-full object-cover sm:h-72 md:h-80 transition duration-300 hover:scale-[1.01]"
                    />
                  </div>
                )}

                <p className="mt-4 text-sm font-semibold uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">Best for: <span className="font-normal normal-case tracking-normal">{boat.bestFor}</span></p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <p className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm leading-relaxed"><strong className="text-[hsl(var(--primary))]">Cost lens:</strong> {boat.cost}</p>
                  <p className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm leading-relaxed"><strong className="text-[hsl(var(--primary))]">Fun factor:</strong> {boat.fun}</p>
                </div>
                <p className="mt-5 text-base leading-relaxed">{boat.why}</p>
                <p className="mt-4 rounded-xl border-l-2 border-[hsl(var(--accent))] bg-[hsl(var(--muted))] px-4 py-3 text-sm leading-relaxed"><strong className="text-[hsl(var(--primary))]">Beginner perk:</strong> {boat.perk}</p>
                {boat.pick && <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"><strong className="text-[hsl(var(--primary))]">A place to start:</strong> {boat.pick}</p>}
              </div>
            </div>
          </section>
        ))}
      </div>
      <section>
        <div className="mb-5 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">At a glance</span></div>
        <h2 className="display-font text-3xl text-[hsl(var(--primary))] md:text-4xl">Which boat fits your lifestyle?</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
          <table className="min-w-[760px] w-full border-collapse text-left text-sm">
            <thead className="bg-[hsl(var(--primary))] text-white">
              <tr><th className="px-4 py-4 font-semibold">Boat type</th><th className="px-4 py-4 font-semibold">Best environment</th><th className="px-4 py-4 font-semibold">Key advantage</th><th className="px-4 py-4 font-semibold">Maintenance</th></tr>
            </thead>
            <tbody>
              {[
                ['Pontoon', 'Calm lakes & rivers', 'Space and stability', 'Low to medium'],
                ['Bowrider', 'Lakes & large bays', 'All-around handling', 'Medium'],
                ['Aluminum fishing boat', 'Rivers & shallow lakes', 'Durable and light', 'Very low'],
                ['Center console', 'Ocean & coastal bays', '360° fishability', 'Low'],
                ['Deck boat', 'Lakes & rivers', 'Space with V-hull speed', 'Medium'],
                ['Jon boat', 'Ponds & creeks', 'Affordable simplicity', 'Very low'],
                ['Fish-and-ski', 'Versatile lakes', 'Fishing and sports', 'Medium'],
                ['Small skiff', 'Coastal shallows', 'Shallow draft', 'Low'],
                ['Jet boat', 'Lakes & sandbars', 'No exposed propeller', 'Medium'],
                ['Cuddy cabin', 'Large lakes & coastlines', 'Shelter and storage', 'High'],
              ].map(([boat, environment, advantage, maintenance]) => (
                <tr key={boat} className="border-t border-[hsl(var(--border))] even:bg-[hsl(var(--muted))]">
                  <td className="px-4 py-4 font-semibold text-[hsl(var(--primary))]">{boat}</td><td className="px-4 py-4">{environment}</td><td className="px-4 py-4">{advantage}</td><td className="px-4 py-4">{maintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="border-t border-[hsl(var(--border))] pt-8">
        <div className="mb-5 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">Before you sign</span></div>
        <h2 className="display-font text-3xl text-[hsl(var(--primary))] md:text-4xl">The costs beginners often miss</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            ['Storage', 'Ask where the boat will live in July and January, not just where it will sit on the sales lot.'],
            ['Towing', 'Add the trailer, hitch, fuel, launch fees, and the tow vehicle’s real payload and braking limits.'],
            ['Maintenance', 'Budget for routine service, batteries, impellers, winterization, cleaning, and unexpected repairs.'],
            ['Safety and training', 'Include life jackets, communications, required equipment, and a boating-safety course for the whole crew.'],
          ].map(([title, copy]) => <div key={title} className="rounded-xl border border-[hsl(var(--border))] p-5"><h3 className="display-font text-2xl text-[hsl(var(--primary))]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{copy}</p></div>)}
        </div>
      </section>
      <section className="border-t border-[hsl(var(--border))] pt-8">
        <div className="mb-5 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">Before the launch</span></div>
        <h2 className="display-font text-3xl text-[hsl(var(--primary))] md:text-4xl">The pre-launch safety check is part of the fun.</h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed">A beginner-friendly boat should make it easy to pause, look around, and build a habit before the throttle moves. Walk the boat and trailer before every launch: check the drain plug, fuel and battery connections, steering, bilge, lights, tie-downs, life jackets, fire extinguisher, and weather. Once afloat, test forward and reverse at idle, confirm the kill-switch lanyard, and make sure everyone knows where to sit and what to do if the engine stops.</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Requirements vary by state and boat. Use your local boating-safety authority’s checklist, take a recognized course, and treat the first few outings as practice rather than a test of bravery.</p>
      </section>
      <section className="rounded-2xl bg-[hsl(var(--primary))] p-6 text-white lg:p-8">
        <span className="fine-label text-[hsl(var(--accent))]">Research notes</span>
        <p className="mt-3 text-sm leading-relaxed text-white/70">We shaped this guide around current beginner-buying guidance from Boats.com and MarineMax, with additional safety and ownership context from Boatsetter, Discover Boating, and Progressive. Boat types, prices, capacity, and requirements vary by model and location.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          <a href="https://www.boats.com/how-to/boat-buying-for-absolute-beginners-part-i" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-1 hover:text-[hsl(var(--accent))]">Boats.com beginner guide <ArrowRight size={13} className="ml-1 inline" /></a>
          <a href="https://www.marinemax.com/boats-and-yachts/new-to-boating" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-1 hover:text-[hsl(var(--accent))]">MarineMax first-time buyer guide <ArrowRight size={13} className="ml-1 inline" /></a>
        </div>
      </section>
    </div>
  );
}

function BuyerFieldGuideBody() {
  return (
    <div className="mt-12 space-y-14">
      <section>
        <div className="mb-7 max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">Before you shop</span></div>
          <h2 className="display-font text-3xl leading-[.95] text-[hsl(var(--primary))] md:text-5xl">The checks that belong on every boat buyer’s list.</h2>
          <p className="mt-4 text-base leading-relaxed text-[hsl(var(--muted-foreground))]">A good-looking boat can still be the wrong boat—or hide an expensive problem. Use these four checks before you trust the price, the layout, or the sales pitch.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 lg:p-6">
            <span className="fine-label text-[hsl(var(--accent))]">01 / Ownership costs</span>
            <h3 className="display-font mt-3 text-2xl leading-tight text-[hsl(var(--primary))]">The 10% rule is a starting point, not a promise.</h3>
            <p className="mt-3 text-sm leading-relaxed">Plan on roughly <strong className="text-[hsl(var(--primary))]">10–15% of the purchase price each year</strong> for operating and ownership costs. It is a useful guardrail against spending every dollar on the boat itself.</p>
            <div className="mt-5 rounded-xl bg-[hsl(var(--muted))] p-4 text-sm leading-relaxed">
              <strong className="text-[hsl(var(--primary))]">Put it toward:</strong> storage or dockage, insurance, fuel, routine service, winterization, bottom painting, and the repairs that appear after a season of use.
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Your water, climate, storage arrangement, and how often you run the boat can move the number substantially.</p>
            <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs font-semibold text-[hsl(var(--primary))]">
              Sources: <a href="https://www.boattrader.com/research/the-cost-of-boat-ownership-planning-your-budget-for-the-year/" target="_blank" rel="noreferrer" className="ml-1 border-b border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">Boat Trader</a><a href="https://www.boatcountry.com/exploring-the-costs-of-boat-ownership/" target="_blank" rel="noreferrer" className="ml-3 border-b border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">Boat Country</a>
            </div>
          </article>
          <article className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 lg:p-6">
            <span className="fine-label text-[hsl(var(--accent))]">02 / The right water</span>
            <h3 className="display-font mt-3 text-2xl leading-tight text-[hsl(var(--primary))]">Choose the hull for the water you actually use.</h3>
            <p className="mt-3 text-sm leading-relaxed">Deadrise—the angle of the hull’s V—changes how a boat handles chop, drifting, speed, and calm-water stability.</p>
            <div className="mt-5 divide-y divide-[hsl(var(--border))] rounded-xl border border-[hsl(var(--border))] text-sm">
              {[
                ['Flat bottom', 'Very stable in calm, shallow water; pounds harder in chop.'],
                ['Deep-V · 21°+', 'Cuts through waves well; can feel tender or rock at rest.'],
                ['Modified-V', 'A practical middle ground for mixed conditions—the SUV compromise.'],
                ['Pontoon / tritoon', 'Stable and spacious; a third tube improves rough-water handling, while high winds still deserve respect.'],
              ].map(([name, copy]) => <div key={name} className="px-4 py-3"><strong className="text-[hsl(var(--primary))]">{name}</strong><p className="mt-1 leading-relaxed text-[hsl(var(--muted-foreground))]">{copy}</p></div>)}
            </div>
            <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs font-semibold text-[hsl(var(--primary))]">
              Sources: <a href="https://www.boattrader.com/research/boat-types-and-hulls-guide/" target="_blank" rel="noreferrer" className="ml-1 border-b border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">Boat Trader hull guide</a><a href="https://www.youtube.com/watch?v=K4Nqs8RwiQs&t=35" target="_blank" rel="noreferrer" className="ml-3 border-b border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">Hull dynamics</a>
            </div>
          </article>
          <article className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 lg:p-6">
            <span className="fine-label text-[hsl(var(--accent))]">03 / The dock interview</span>
            <h3 className="display-font mt-3 text-2xl leading-tight text-[hsl(var(--primary))]">Ask about the cold start, risers, and manifolds.</h3>
            <p className="mt-3 text-sm leading-relaxed">On a saltwater inboard, exhaust risers and manifolds are a major service question. They commonly last about <strong className="text-[hsl(var(--primary))]">3–5 years</strong>, and failure can let water into the cylinders and destroy an engine.</p>
            <div className="mt-5 rounded-xl bg-[hsl(var(--muted))] p-4 text-sm leading-relaxed">
              <strong className="text-[hsl(var(--primary))]">Ask to:</strong> see the engine start from cold, confirm when the risers and manifolds were replaced, review service records, and look for smoke or hard starting that a pre-warmed engine can hide.
            </div>
            <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs font-semibold text-[hsl(var(--primary))]">
              Sources: <a href="https://boatingmag.com/riserandmanifold/?srsltid=AfmBOopyfdHu35N94FH4BXtK8AXewsdAoDMKIp-3UjdFXjbUm-poWr0i" target="_blank" rel="noreferrer" className="ml-1 border-b border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">Boating Magazine</a><a href="https://www.youtube.com/watch?v=DlbHFhfSbGQ" target="_blank" rel="noreferrer" className="ml-3 border-b border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">Riser inspection</a><a href="https://www.youtube.com/watch?v=rq4KeIwCQ7c&t=737" target="_blank" rel="noreferrer" className="ml-3 border-b border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]">Cold-start check</a>
            </div>
          </article>
          <article className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 lg:p-6">
            <span className="fine-label text-[hsl(var(--accent))]">04 / Small decisions</span>
            <h3 className="display-font mt-3 text-2xl leading-tight text-[hsl(var(--primary))]">A cup holder can reveal a bigger problem.</h3>
            <p className="mt-3 text-sm leading-relaxed">Poorly draining cup holders are a small surveyor pet peeve with expensive consequences. Water can run into the bilge or onto wiring below the gunwale, creating hidden mold and corrosion.</p>
            <div className="mt-5 rounded-xl bg-[hsl(var(--muted))] p-4 text-sm leading-relaxed">
              <strong className="text-[hsl(var(--primary))]">Look closely:</strong> pour a little water into the holders, check where it drains, inspect the surrounding sealant, and look below for dampness, staining, or corrosion.
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">The same principle applies across the boat: small details often reveal how carefully it was designed, used, and maintained.</p>
            <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs font-semibold text-[hsl(var(--primary))]">Field reports: The Hull Truth and JetBoaters owner forums.</div>
          </article>
        </div>
      </section>
      <section className="rounded-2xl bg-[hsl(var(--primary))] p-6 text-white lg:p-8">
        <span className="fine-label text-[hsl(var(--accent))]">Research notes</span>
        <p className="mt-3 text-sm leading-relaxed text-white/70">This field guide is based on the supplied research from BoatUS, marine brokers, Boat Trader, Boat Country, Boating Magazine, and owner forums. Treat the 10–15% figure and service intervals as planning ranges, not guarantees: local costs, boat type, water, climate, and maintenance history all matter.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          <a href="https://www.boattrader.com/research/the-cost-of-boat-ownership-planning-your-budget-for-the-year/" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-1 hover:text-[hsl(var(--accent))]">Boat Trader ownership costs <ArrowRight size={13} className="ml-1 inline" /></a>
          <a href="https://www.boattrader.com/research/boat-types-and-hulls-guide/" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-1 hover:text-[hsl(var(--accent))]">Boat Trader hull guide <ArrowRight size={13} className="ml-1 inline" /></a>
          <a href="https://boatingmag.com/riserandmanifold/?srsltid=AfmBOopyfdHu35N94FH4BXtK8AXewsdAoDMKIp-3UjdFXjbUm-poWr0i" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-1 hover:text-[hsl(var(--accent))]">Boating Magazine risers guide <ArrowRight size={13} className="ml-1 inline" /></a>
        </div>
      </section>
    </div>
  );
}

function BeginnerGuidePage() {
  useEffect(() => { document.title = `${beginnerBoatGuide.title} — Lyman Marine`; }, []);
  return (
    <ArticleLayout>
      <article className="mx-auto max-w-[980px] px-5 py-12 lg:px-10 lg:py-20">
        <div className="mb-8 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-12 bg-[hsl(var(--accent))]" /><span className="fine-label">Boat buying / beginner guide</span></div>
        <h1 className="display-font max-w-4xl text-5xl leading-[.91] tracking-[-.05em] text-[hsl(var(--primary))] md:text-7xl">
          {beginnerBoatGuide.mainTitle}
          <span className="mt-4 block text-2xl font-normal tracking-tight text-[hsl(var(--muted-foreground))] sm:text-3xl md:text-4xl">
            {beginnerBoatGuide.subtitle}
          </span>
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))] md:text-xl">{beginnerBoatGuide.copy} We ranked the formats by how quickly a new owner can feel comfortable, what they ask of a real-world budget, and how much good time they make possible.</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-[hsl(var(--border))] py-5 text-xs text-[hsl(var(--muted-foreground))]">
          <span>Lyman Marine buying desk</span>
          <span>Updated for the coming season · 14 min read</span>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl bg-[hsl(var(--primary))] shadow-sm">
          <SafeImage src="/boats/pontoon.jpeg" alt="Pontoon boat on calm lake water" className="h-64 w-full object-cover opacity-90 md:h-96" />
        </div>
        <BeginnerGuideBody />
      </article>
    </ArticleLayout>
  );
}

function BuyerFieldGuidePage() {
  useEffect(() => { document.title = `${buyerFieldGuide.title} — Lyman Marine`; }, []);
  return (
    <ArticleLayout>
      <article className="mx-auto max-w-[980px] px-5 py-12 lg:px-10 lg:py-20">
        <div className="mb-8 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-12 bg-[hsl(var(--accent))]" /><span className="fine-label">Boat buying / field guide</span></div>
        <h1 className="display-font max-w-4xl text-5xl leading-[.91] tracking-[-.05em] text-[hsl(var(--primary))] md:text-7xl">{buyerFieldGuide.title}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))] md:text-xl">{buyerFieldGuide.copy} Keep it open while you compare boats, talk with sellers, and inspect the details that brochures leave out.</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-[hsl(var(--border))] py-5 text-xs text-[hsl(var(--muted-foreground))]">
          <span>Lyman Marine buying desk</span>
          <span>Updated for the coming season · 8 min read</span>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl bg-[hsl(var(--primary))]">
          <SafeImage src={images.wake} alt="A boat moving through open water" className="h-64 w-full object-cover opacity-80 md:h-96" />
        </div>
        <BuyerFieldGuideBody />
      </article>
    </ArticleLayout>
  );
}

function BuyingPage() {
  return (
    <InteriorPage eyebrow="Boat Buying" title="Choose the right boat for your use." copy="Start with the basics: your water, your budget, your tow vehicle, and the days you want to spend onboard." heroImage={images.sail}>
      <section className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-5 border-b border-[hsl(var(--border))] pb-6">
          <div>
            <div className="mb-3 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" /><span className="fine-label">The buying desk</span></div>
            <h2 className="display-font max-w-3xl text-4xl leading-[.95] text-[hsl(var(--primary))] md:text-6xl">Two useful places to begin.</h2>
          </div>
          <ShipWheel size={28} className="hidden text-[hsl(var(--accent))] md:block" />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {pageResources.buying.map((card) => <ResourceCard key={card.title} kind="buying" card={card} />)}
        </div>
      </section>
    </InteriorPage>
  );
}

function ResourceStoryPage() {
  const { kind, slug } = useParams<{ kind: string; slug: string }>();
  if (kind === 'buying' && slug === slugify(beginnerBoatGuide.title)) return <BeginnerGuidePage />;
  if (kind === 'buying' && slug === slugify(buyerFieldGuide.title)) return <BuyerFieldGuidePage />;
  const resources = kind ? pageResources[kind] : undefined;
  const card = resources?.find((item) => slugify(item.title) === slug);
  if (!card || !kind) return <NotFound />;
  return (
    <ArticleLayout>
      <article className="mx-auto max-w-[900px] px-5 py-12 lg:px-10 lg:py-20">
        <div className="mb-8 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-12 bg-[hsl(var(--accent))]" /><span className="fine-label">{card.category}</span></div>
        <h1 className="display-font max-w-4xl text-5xl leading-[.93] tracking-[-.045em] text-[hsl(var(--primary))] md:text-7xl">{card.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))] md:text-xl">{card.copy}</p>
        <div className="mt-8 flex items-center justify-between border-y border-[hsl(var(--border))] py-5 text-xs text-[hsl(var(--muted-foreground))]"><span>{card.source ?? 'Lyman Marine field notes'}</span><span>{card.externalUrl ? 'External reading' : 'Lyman Marine'}</span></div>
        <div className="prose prose-lg mt-10 max-w-none text-[hsl(var(--foreground))]"><p className="display-font text-3xl leading-tight text-[hsl(var(--primary))]">The useful version starts with the details that hold up after the launch ramp.</p><p>{card.copy} This guide is part of the Lyman Marine desk, built to help owners make a clearer decision before the next day on the water.</p><p>Keep this page bookmarked as the desk grows. We will add deeper checklists, interviews, product comparisons, and local knowledge here as the editorial library fills out.</p></div>
        <div className="mt-10 flex flex-wrap gap-3"><Link href={`/${kind}`} className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white">Back to {kind} <ArrowRight size={15} /></Link>{card.externalUrl && <a href={card.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary))]">Read the original <ArrowRight size={15} /></a>}</div>
      </article>
    </ArticleLayout>
  );
}

function ArticleLayout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="paper-grain min-h-screen overflow-hidden">
      <Header compact solid onSearch={() => setSearchOpen(true)} />
      <main className="bg-[hsl(var(--background))]">{children}</main>
      <Footer />
      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find((item) => item.id === id || (item as any).slug === id);
  if (!article) return <NotFound />;
  if (article.id === '002') return <BoatMaintenanceArticle article={article} />;
  if (article.id === '003' || (article as any).slug === '10-things-to-check-before-buying-a-used-boat') {
    return <UsedBoatBuyingGuideArticle article={article} />;
  }
  if (article.id === '004' || (article as any).slug === 'how-to-read-the-water-when-fishing-slows-down') {
    return <ReadTheWaterArticle article={article} />;
  }
  return (
    <ArticleLayout>
      <article className="mx-auto max-w-[900px] px-5 py-12 lg:px-10 lg:py-20">
        <div className="mb-8 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-12 bg-[hsl(var(--accent))]" /><span className="fine-label">{article.category}</span></div>
        <h1 className="display-font max-w-4xl text-5xl leading-[.93] tracking-[-.045em] text-[hsl(var(--primary))] md:text-7xl">{article.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))] md:text-xl">{article.excerpt}</p>
        <div className="mt-8 flex items-center justify-between border-y border-[hsl(var(--border))] py-5 text-xs text-[hsl(var(--muted-foreground))]"><span>{article.author}</span><span>{article.date}</span></div>
        <div className="prose prose-lg mt-10 max-w-none text-[hsl(var(--foreground))]"><p className="display-font text-3xl leading-tight text-[hsl(var(--primary))]">The useful version starts with the details that hold up after the launch ramp.</p><p>{article.excerpt} Lyman Marine brings the practical context, the questions worth asking, and the small decisions that make time on the water feel more considered.</p><p>Whether you are checking an engine, comparing a helm, planning a fishing day, or simply looking for a better route home, the goal is the same: know more before you go farther.</p><p className="font-semibold text-[hsl(var(--primary))]">This is an editorial preview. More full-length guides are coming to the Lyman Marine desk soon.</p></div>
        <Link href="/" className="mt-10 inline-flex items-center gap-2 border-b border-[hsl(var(--accent))] pb-2 text-sm font-bold text-[hsl(var(--primary))]">Back to the magazine <ArrowRight size={15} /></Link>
      </article>
    </ArticleLayout>
  );
}

function MaintenanceSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="not-prose border-t border-[hsl(var(--border))] pt-10">
      <div className="mb-6 flex items-start gap-4">
        <span className="fine-label pt-1 text-[hsl(var(--accent))]">{number}</span>
        <h2 className="display-font max-w-3xl text-3xl leading-[.98] tracking-[-.03em] text-[hsl(var(--primary))] md:text-5xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MaintenanceChecklist({ title, items, columns = false }: { title: string; items: string[]; columns?: boolean }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 lg:p-6">
      <h3 className="display-font text-2xl leading-tight text-[hsl(var(--primary))]">{title}</h3>
      <ul className={`mt-4 grid gap-3 text-sm leading-relaxed ${columns ? 'md:grid-cols-2 md:gap-x-8' : ''}`}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 text-lg leading-none text-[hsl(var(--accent))]" aria-hidden="true">□</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MaintenanceCallout({ eyebrow, title, children, dark = false }: { eyebrow: string; title: string; children: ReactNode; dark?: boolean }) {
  return (
    <aside className={`not-prose rounded-2xl p-5 lg:p-6 ${dark ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'}`}>
      <span className={`fine-label ${dark ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--accent))]'}`}>{eyebrow}</span>
      <h3 className={`display-font mt-2 text-2xl leading-tight ${dark ? 'text-white' : 'text-[hsl(var(--primary))]'}`}>{title}</h3>
      <div className={`mt-3 text-sm leading-relaxed ${dark ? 'text-white/75' : 'text-[hsl(var(--muted-foreground))]'}`}>{children}</div>
    </aside>
  );
}

function ArticleInlineImage({
  src,
  alt,
  caption,
  align = 'right',
}: {
  src: string;
  alt: string;
  caption?: string;
  align?: 'left' | 'right';
}) {
  return (
    <figure
      className={`my-6 w-full sm:w-[320px] md:w-[360px] rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] p-2.5 shadow-[var(--shadow-soft)] transition duration-200 hover:shadow-md ${
        align === 'left' ? 'sm:float-left sm:mr-7 sm:mb-5' : 'sm:float-right sm:ml-7 sm:mb-5'
      }`}
    >
      <div className="overflow-hidden rounded-xl bg-[hsl(var(--muted))]">
        <SafeImage
          src={src}
          alt={alt}
          className="h-44 sm:h-52 w-full object-cover transition duration-300 hover:scale-[1.02]"
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

function BoatMaintenanceArticle({ article }: { article: typeof articles[number] }) {
  useEffect(() => { document.title = `${article.title} — Lyman Marine`; }, [article.title]);
  return (
    <ArticleLayout>
      <article className="mx-auto max-w-[1040px] px-5 py-12 lg:px-10 lg:py-20">
        <header className="max-w-4xl">
          <div className="mb-8 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-12 bg-[hsl(var(--accent))]" /><span className="fine-label">Maintenance / Field guide</span></div>
          <h1 className="display-font text-5xl leading-[.91] tracking-[-.05em] text-[hsl(var(--primary))] md:text-7xl">{article.title}</h1>
          {article.subtitle && (
            <p className="mt-4 max-w-3xl text-xl font-medium tracking-tight text-[hsl(var(--primary))] opacity-85 md:text-2xl leading-snug">
              {article.subtitle}
            </p>
          )}
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))] md:text-xl">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-[hsl(var(--border))] py-5 text-xs text-[hsl(var(--muted-foreground))]">
            <span>{article.author}</span>
            <span>{article.readTime} · {article.date}</span>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl bg-[hsl(var(--primary))]">
            <SafeImage src={article.image} alt="A boat owner inspecting an outboard engine at a marina dock" className="h-72 w-full object-cover md:h-[500px]" />
          </div>
        </header>

        <div className="mt-12 max-w-4xl space-y-12 text-[hsl(var(--foreground))]">
          <div className="space-y-5 text-base leading-relaxed md:text-lg">
            <p className="display-font text-3xl leading-tight text-[hsl(var(--primary))] md:text-4xl">A dependable boat is built through small checks made at the right time.</p>
            <p>Boats work in demanding environments. Salt and fresh water, moisture, corrosion, vibration, heat, storage, and regular use all put different systems under pressure. A quick inspection before a trip, a rinse after a day on the water, and a closer look at the right seasonal moments can help you notice wear while it is still manageable.</p>
            <p>This guide is meant to make those moments easier to organize. It is a practical field guide, not a substitute for your boat, engine, drive, or equipment manuals. When a check reveals a fault you cannot confidently identify or correct, pause and bring in a qualified marine professional.</p>
          </div>

          <MaintenanceCallout eyebrow="Start here" title="Use your owner's or service manual as the final authority">
            <p>Maintenance requirements vary by boat, engine, drive system, usage, and manufacturer. Always follow your owner’s or service manual for model-specific procedures and intervals.</p>
          </MaintenanceCallout>

          {/* After "Start here" - Right aligned small photo */}
          <div className="overflow-hidden">
            <ArticleInlineImage
              src="/maintenance/predeparture-inspection.jpg"
              alt="Boat owner doing a pre-departure inspection at the helm"
              caption="Pre-departure walkaround: Taking 5 minutes at the helm and deck before untying lines prevents most common ramp mishaps."
              align="right"
            />
            <p className="text-base leading-relaxed">
              Every seasoned skipper follows a rhythm before the key ever turns. A calm, systematic walkthrough of the deck, bilges, controls, and safety equipment turns what could be an emergency offshore into an easily addressed checklist item at the slip.
            </p>
          </div>

          <MaintenanceSection number="01" title="The quick maintenance schedule">
            <div className="not-prose overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
              <table className="min-w-[680px] w-full border-collapse text-left text-sm">
                <thead className="bg-[hsl(var(--primary))] text-white">
                  <tr><th className="px-4 py-4 font-semibold">When</th><th className="px-4 py-4 font-semibold">What it is for</th></tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {[
                    ['Before every trip', 'Quick safety, equipment, fluid, steering, and hull checks before leaving the dock.'],
                    ['After every trip', 'Rinse where appropriate, inspect for damage or leaks, check the bilge, and store equipment properly.'],
                    ['Monthly / periodic', 'Recurring checks of batteries, connections, hoses, thru-hulls, safety gear, steering, and the trailer.'],
                    ['Spring commissioning', 'A structured inspection after storage, before launch, and again after the boat is in the water.'],
                    ['Mid-season', 'A shorter review of systems that are seeing regular use, plus trailer and safety checks.'],
                    ['Fall / winterization', 'Prepare fuel, cooling, water systems, batteries, covers, and storage according to the boat and engine manuals.'],
                    ['Manufacturer-scheduled service', 'Engine and system service at the intervals and specifications set by the manufacturer.'],
                  ].map(([when, purpose]) => <tr key={when} className="align-top even:bg-[hsl(var(--muted))]"><th className="w-1/3 px-4 py-4 font-semibold text-[hsl(var(--primary))]">{when}</th><td className="px-4 py-4 leading-relaxed">{purpose}</td></tr>)}
                </tbody>
              </table>
            </div>
          </MaintenanceSection>

          <MaintenanceSection number="02" title="Before every trip">
            <div className="grid gap-4 md:grid-cols-2">
              <MaintenanceChecklist title="At the boat" columns items={[
                'Check the bilge for unexpected water, fuel odor, oil, or other signs of a problem.',
                'Test the bilge pump and float switch as appropriate for your installation.',
                'Confirm the drain plug is installed where applicable.',
                'Look over the hull, deck, rails, cleats, canvas, and visible hardware for damage or looseness.',
                'Check fuel-system components visually for odor, leaks, chafing, or damaged lines.',
              ]} />
              <MaintenanceChecklist title="At the helm" columns items={[
                'Check engine fluids and the cooling-water indication where applicable, using the owner’s manual.',
                'Move the steering and throttle/control systems through their normal range before departure.',
                'Power up navigation equipment, running lights, and the VHF or radio as appropriate.',
                'Confirm required safety equipment is aboard, accessible, and in usable condition.',
                'Review the route, weather, fuel plan, and communication plan for the trip.',
              ]} />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">The right engine check depends on whether the boat has an outboard, sterndrive, inboard, electric propulsion system, or another setup. Use the manufacturer’s starting and pre-departure checklist rather than treating one engine’s procedure as universal.</p>
          </MaintenanceSection>

          <MaintenanceSection number="03" title="After every trip">
            <div className="grid gap-4 md:grid-cols-2">
              <MaintenanceChecklist title="Clean and inspect" columns items={[
                'Rinse the boat and running gear where appropriate, especially after saltwater use.',
                'Wash away salt, mud, and debris using products and methods suitable for the finish.',
                'Check the bilge again and look for leaks, new water, unusual smells, or damage.',
                'Remove fishing line, weeds, and other debris from accessible running gear.',
                'Inspect the propeller or other running gear where accessible and safe to reach.',
              ]} />
              <MaintenanceChecklist title="Close the boat well" columns items={[
                'Follow the boat’s battery and electrical shutdown procedure where appropriate.',
                'Dry and stow safety gear, lines, fenders, and electronics so they are ready for next time.',
                'Close, clean, and ventilate covers and canvas according to their care instructions.',
                'Secure hatches, doors, drain paths, and loose gear before leaving the boat.',
                'Record anything that needs attention instead of trusting yourself to remember it later.',
              ]} />
            </div>

            {/* After "03 After every trip" - Left aligned small photo */}
            <div className="mt-6 overflow-hidden">
              <ArticleInlineImage
                src="/maintenance/saltwater-rinse.jpg"
                alt="Boat being rinsed down with fresh water hose after saltwater use"
                caption="Saltwater washdown: Thoroughly flushing the engine cooling circuits and hosing down fiberglass and trailer components prevents rapid corrosion."
                align="left"
              />
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                Salt residue dries into abrasive crystals that eat away at stainless fittings, electrical terminals, trailer brakes, and raw-water cooling passages. Even 10 minutes with a freshwater hose and an outboard flusher will multiply the service life of your gear.
              </p>
            </div>
          </MaintenanceSection>

          <MaintenanceSection number="04" title="Monthly & periodic maintenance">
            <p className="mb-5 text-base leading-relaxed">Exact intervals depend on the boat, engine, usage, climate, and manufacturer. A monthly or periodic walkaround is a useful chance to inspect the systems that daily use can make easy to overlook.</p>
            <MaintenanceChecklist title="The recurring walkaround" columns items={[
              'Inspect battery terminals, cables, chargers, and electrical connections for looseness or corrosion.',
              'Look over hoses, hose clamps, belts where applicable, and visible control cables for wear or chafe.',
              'Operate and inspect thru-hulls and seacocks where fitted; know which valves should be open or closed.',
              'Test bilge pumps, float switches, alarms, and other safety-related equipment.',
              'Check life jackets, fire extinguishers, flares where carried, first-aid supplies, and required equipment.',
              'Inspect the trailer tires, lights, coupler, winch, frame, and visible running gear.',
              'Walk the hull and deck for cracks, blisters where applicable, loose fittings, and impact damage.',
              'Log what you found, what you corrected, and what needs a qualified technician.',
            ]} />
          </MaintenanceSection>

          <MaintenanceSection number="05" title="Spring commissioning">
            <p className="mb-5 text-base leading-relaxed">Spring commissioning is a process, not one turn of the key. Work from the hull inward, complete the checks that can be done on land, and keep a short list for the first time the boat is back in the water.</p>

            {/* After "05 Spring commissioning" - Right aligned small photo */}
            <div className="overflow-hidden mb-6">
              <ArticleInlineImage
                src="/maintenance/spring-hull-inspection.jpg"
                alt="Boat on a trailer or boat stands while owner inspects the hull and running gear"
                caption="Spring yard inspection: Checking the hull bottom, thru-hull fittings, and running gear while dry on stands prevents surprises on launch day."
                align="right"
              />
              <p className="text-base leading-relaxed">
                Take full advantage of the dry season before the crane or ramp trailer touches water. Look closely along the chines, strakes, and keel for stress cracks, gelcoat gouges, or soft spots in the laminate that need patching.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <MaintenanceChecklist title="Hull & plumbing" columns items={[
                'Inspect the hull, bottom, and antifouling paint where applicable.',
                'Look for stress cracks, impact damage, blisters where applicable, and loose or missing hardware.',
                'Inspect hoses, clamps, thru-hulls, seacocks, and accessible plumbing for deterioration or leaks.',
                'Confirm drain paths are clear and that fittings are appropriate for their marine use.',
              ]} />
              <MaintenanceChecklist title="Engine & fuel" columns items={[
                'Inspect fuel lines, filters, and fuel-water separators where applicable.',
                'Check engine fluids and cooling-system components using the manufacturer’s procedure.',
                'Look for damaged belts, hoses, clamps, corrosion, and warning signs around the engine.',
                'Schedule manufacturer-recommended service rather than assuming every engine needs the same work.',
              ]} />
              <MaintenanceChecklist title="Electrical & running gear" columns items={[
                'Inspect batteries, terminals, cables, connections, bilge pumps, alarms, and navigation equipment.',
                'Inspect the propeller, shaft or drive components where applicable, and anodes.',
                'Look for fishing line, impact damage, unusual wear, and corrosion around running gear.',
                'Confirm chargers and shore-power connections are in good condition before use.',
              ]} />
              <MaintenanceChecklist title="Trailer & safety" columns items={[
                'Inspect tires, pressure, bearings, lights, brakes where equipped, coupler, winch, and frame.',
                'Check life jackets, fire extinguishers, flares where carried, VHF, navigation lights, and first-aid supplies.',
                'Confirm registration, required documents, and emergency contacts are aboard.',
                'Replace expired, damaged, or inaccessible safety equipment before the first trip.',
              ]} />
            </div>
            <MaintenanceCallout eyebrow="After launch" title="Do a deliberate leak check at the dock" dark>
              <p>Once the boat is in the water, check the appropriate thru-hulls, seacocks, drain plugs, shaft or drive areas, and other systems that can admit water. Give the hull and bilge time to show you what is happening before heading away from the launch area.</p>
            </MaintenanceCallout>

            {/* After "After launch" - Left aligned small photo reinforcing leak-check warning */}
            <div className="mt-6 overflow-hidden">
              <ArticleInlineImage
                src="/maintenance/dock-leak-check.jpg"
                alt="Boat sitting at the dock while the owner checks the bilge and engine compartment"
                caption="Dockside leak verification: Stay tied to the dock for 10-15 minutes after splashing to confirm bilges remain dry and shaft packing or thru-hulls aren't leaking."
                align="left"
              />
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                Never cast off lines the moment the boat floats off the trailer. Lift the engine access hatch, inspect every hose connection below the waterline with a strong flashlight, and verify the automatic bilge pump floats freely.
              </p>
            </div>
          </MaintenanceSection>

          <MaintenanceSection number="06" title="Mid-season check">
            <p className="mb-5 text-base leading-relaxed">Regular use can hide gradual wear because the boat still starts and moves. A shorter mid-season review helps you catch changes before they become an inconvenient surprise.</p>
            <MaintenanceChecklist title="A focused mid-season review" columns items={[
              'Inspect engine or drive systems for leaks, unusual sounds, heat, vibration, and warning indications.',
              'Check fluids, fuel-system components, cooling-water flow, and filters as required by the manual.',
              'Inspect batteries, charging, lights, electronics, connections, and accessory wiring.',
              'Look over the propeller or other running gear for impact, line, weeds, and new damage.',
              'Check trailer tires, lights, coupler, winch, bearings, and brakes where equipped.',
              'Confirm safety equipment remains complete, accessible, and within service or expiration limits.',
              'Walk the hull, deck, canvas, hardware, and storage areas for wear from the season so far.',
            ]} />
          </MaintenanceSection>

          <MaintenanceSection number="07" title="Fall & winterization">
            <p className="mb-5 text-base leading-relaxed">Winterization varies substantially between outboards, sterndrives, inboards, sailboats, boats with freshwater systems, different climates, storage conditions, and manufacturers. The safe approach is to use the exact engine and boat storage instructions for your setup.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <MaintenanceChecklist title="Plan the categories" columns items={[
                'Prepare fuel according to the engine and fuel-system manufacturer’s guidance.',
                'Prepare the cooling system where applicable, using the specified procedure and materials.',
                'Drain or protect water systems, heads, pumps, and freshwater plumbing where applicable.',
                'Prepare batteries according to the battery, charger, and storage setup.',
                'Follow engine-specific storage procedures; do not assume every engine should be fogged or treated the same way.',
                'Control moisture with ventilation, dry storage practices, and appropriate covers.',
                'Secure the trailer and storage area, including tires, support points, locks, and exposure to weather.',
              ]} />
              <MaintenanceCallout eyebrow="Important distinction" title="There is no universal winterization recipe">
                <p>An outboard, sterndrive, inboard, sailboat, and boat with a freshwater system can require different steps. Climate and storage conditions matter too. When the manual calls for specialized tools or a procedure you cannot verify, schedule a marine technician rather than improvising.</p>
              </MaintenanceCallout>
            </div>
          </MaintenanceSection>

          <MaintenanceSection number="08" title="Battery & electrical systems">
            <p className="text-base leading-relaxed">Start with the simple, visible checks: terminals should be secure and reasonably clean, cables should not be damaged or chafed, and wiring should be supported and protected from moisture and heat. Look for corrosion, loose connections, swelling, damaged insulation, and charging behavior that has changed.</p>
            
            {/* After "08 Battery & electrical systems" - Right aligned small photo */}
            <div className="my-5 overflow-hidden">
              <ArticleInlineImage
                src="/maintenance/battery-terminals.jpg"
                alt="Close-up of marine battery terminals and wiring connections"
                caption="Clean battery connections: Corroded posts or loose terminal wingnuts cause unexpected voltage drops and intermittent starter failures."
                align="right"
              />
              <p className="text-base leading-relaxed">
                Marine electrical systems endure constant pounding and humid salt air. Coat clean terminal studs with marine dielectric grease or protective varnish, and replace corroded lock washers or wing nuts with stainless nyloc nuts where approved.
              </p>
            </div>

            <p className="mt-4 text-base leading-relaxed">Inspect the charging system, battery condition, breakers, fuses, switches, navigation equipment, pumps, and accessories according to the equipment manuals. Keep battery work dry and controlled, and disconnect power as directed before touching a circuit.</p>
            <MaintenanceCallout eyebrow="Call a professional" title="Electrical problems deserve respect">
              <p>Have a qualified marine technician handle repeated breaker trips, unexplained battery drain, hot wires or terminals, charging faults, damaged harnesses, shore-power problems, or any diagnosis that requires bypassing safety devices.</p>
            </MaintenanceCallout>
          </MaintenanceSection>

          <MaintenanceSection number="09" title="Engine & fuel system">
            <p className="text-base leading-relaxed">Engine maintenance is where “boat maintenance” becomes highly specific. Outboards, sterndrives, and inboards can differ in oil systems, filters, cooling paths, fuel delivery, belts, spark plugs, warning systems, and service access.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ['Outboards', 'Check the items your manual identifies: fluids, filters, fuel lines, cooling-water indication, spark plugs where applicable, corrosion protection, and warning systems.'],
                ['Sterndrives', 'Include the engine and drive as separate systems where the manufacturer does. Inspect fluids, bellows or related components where applicable, cooling, anodes, steering, and service points.'],
                ['Inboards', 'Give attention to engine fluids, filters, belts where fitted, hoses, raw-water cooling, exhaust components, fuel delivery, and access to the engine space.'],
              ].map(([label, copy]) => <div key={label} className="rounded-2xl bg-[hsl(var(--muted))] p-5"><h3 className="display-font text-2xl leading-tight text-[hsl(var(--primary))]">{label}</h3><p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{copy}</p></div>)}
            </div>
            <p className="mt-5 text-base leading-relaxed">Use the owner’s or service manual for engine oil, filters, fuel filters, fuel-water separators, cooling systems, hoses, belts, spark plugs, warning systems, and intervals. Do not turn a service interval from one model into a universal rule.</p>
          </MaintenanceSection>

          <MaintenanceSection number="10" title="Hull, propeller & running gear">
            <p className="text-base leading-relaxed">Inspect the hull for impact damage, stress cracks, blisters where applicable, loose fittings, and changes in the finish. Inspect the propeller or other propulsion hardware for bends, nicks, line, weeds, and missing hardware only when the boat is secure and the equipment can be reached safely.</p>

            {/* After "10 Hull, propeller & running gear" - Left aligned small photo */}
            <div className="my-5 overflow-hidden">
              <ArticleInlineImage
                src="/maintenance/propeller-anode.jpg"
                alt="Close-up of a propeller blade and sacrificial zinc anode on the lower unit"
                caption="Propeller and anode inspection: Sacrificial zinc anodes should be replaced when 50% depleted to keep expensive props and gearcases from galvanic pitting."
                align="left"
              />
              <p className="text-base leading-relaxed">
                Even minor blade dings or discarded monofilament fishing line wrapped tightly behind the prop seal can let seawater into the lower unit gear oil. Pull the prop at least once a season, grease the prop shaft spline, and replace eroded zinc or aluminum anodes.
              </p>
            </div>

            <p className="mt-4 text-base leading-relaxed">Anodes, shafts, drives, rudders, and steering components can show wear that is not obvious from the helm. If you find a significant impact, unusual vibration, steering play, structural concern, damaged drive component, or a problem below the waterline, have a marine professional inspect it before continued use.</p>
          </MaintenanceSection>

          <MaintenanceSection number="11" title="Trailer maintenance">
            <p className="mb-5 text-base leading-relaxed">Trailer service intervals depend on the trailer, usage, road conditions, load, and manufacturer. Before a long tow, walk around the entire rig and confirm that the boat, trailer, and tow connection are working as one system.</p>
            <MaintenanceChecklist title="Trailer walkaround" columns items={[
              'Check tire pressure, tread, sidewalls, age, and the spare tire.',
              'Inspect bearings and hubs according to the trailer manufacturer’s service guidance.',
              'Test running lights, turn signals, brake lights, and the wiring connection.',
              'Check brakes where equipped, including visible lines, components, and breakaway equipment.',
              'Inspect the coupler, safety chains, winch, strap, bow stop, frame, axles, and visible fasteners.',
              'Confirm the boat is supported, tied down, and balanced as specified for the trailer.',
            ]} />
          </MaintenanceSection>

          {/* Before "12 DIY vs professional" - Right aligned small photo providing visual transition */}
          <div className="overflow-hidden pt-6">
            <ArticleInlineImage
              src="/maintenance/marine-technician.jpg"
              alt="Marine technician working on an engine in a marina workshop"
              caption="Certified marine technician: Knowing when to hand off high-torque, internal engine, or complex electrical diagnostics preserves warranties and safety."
              align="right"
            />
            <p className="text-base leading-relaxed">
              Knowing your own limits is one of the highest marks of seamanship. Routine cleaning, fluid level monitoring, and visual walkarounds are great owner habits, but precision drive adjustments, compression testing, and major wiring overhauls are best left to ABYC-certified professionals.
            </p>
          </div>

          <MaintenanceSection number="12" title="DIY vs professional">
            <div className="not-prose overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
              <table className="min-w-[680px] w-full border-collapse text-left text-sm">
                <thead className="bg-[hsl(var(--primary))] text-white"><tr><th className="px-4 py-4 font-semibold">DIY-friendly</th><th className="px-4 py-4 font-semibold">Professional territory</th></tr></thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {[
                    ['Visual inspections and cleaning', 'Major engine repairs'],
                    ['Basic checks and record keeping', 'Complex electrical diagnosis'],
                    ['Tire-pressure checks', 'Structural repairs'],
                    ['Basic battery inspection', 'Advanced fuel-system repairs'],
                    ['Basic fluid checks where appropriate', 'Drive-system repairs'],
                    ['Accessible safety-equipment checks', 'Specialized winterization or manufacturer-specific work requiring specialized tools'],
                  ].map(([diy, pro]) => <tr key={diy} className="align-top even:bg-[hsl(var(--muted))]"><td className="px-4 py-4 leading-relaxed">{diy}</td><td className="px-4 py-4 leading-relaxed">{pro}</td></tr>)}
                </tbody>
              </table>
            </div>
          </MaintenanceSection>

          <MaintenanceSection number="13" title="Printable boat maintenance checklist">
            <div className="grid gap-4 md:grid-cols-2">
              <MaintenanceChecklist title="Before every trip" items={['Bilge checked', 'Drain plug checked where applicable', 'Fluids checked', 'Steering/control systems checked', 'Safety equipment checked', 'Navigation/VHF checked']} />
              <MaintenanceChecklist title="After every trip" items={['Boat cleaned/rinsed where appropriate', 'Hull inspected', 'Bilge checked', 'Equipment stored', 'Electrical system handled appropriately']} />
              <MaintenanceChecklist title="Monthly / periodic" items={['Batteries inspected', 'Hoses checked', 'Clamps checked', 'Thru-hulls/seacocks checked', 'Steering checked', 'Electrical connections inspected']} />
              <MaintenanceChecklist title="Spring" items={['Hull inspected', 'Anodes inspected', 'Engine/drive service completed as required', 'Batteries checked', 'Safety equipment checked', 'Trailer inspected', 'Paperwork checked', 'Post-launch leak inspection completed']} />
              <MaintenanceChecklist title="Mid-season" items={['Engine systems checked', 'Fuel system checked', 'Electrical system checked', 'Running gear checked', 'Trailer checked']} />
              <MaintenanceChecklist title="Fall / winter" items={['Fuel prepared according to manufacturer guidance', 'Cooling system prepared where applicable', 'Water systems prepared', 'Batteries prepared', 'Boat properly covered/stored', 'Manufacturer storage procedures followed']} />
            </div>
          </MaintenanceSection>

          <section className="not-prose border-t border-[hsl(var(--border))] pt-10">
            <div className="mb-6 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-12 bg-[hsl(var(--accent))]" /><span className="fine-label">Sources & references</span></div>
            <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">This guide was written in original language and checked against reputable boating safety and maintenance references. Use the sources for context, then follow the instructions for your specific boat and engine.</p>
            <div className="mt-5 grid gap-3 text-sm font-semibold">
              <a href="https://www.boatus.com/documents/boatus/spring-commissioning-checklist.pdf" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]">BoatUS — Spring Boat Commissioning Checklist <ArrowRight size={13} className="ml-1 inline" /></a>
              <a href="https://www.boatus.com/expert-advice/how-to-diy/spring-preparation" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]">BoatUS — Spring Preparation <ArrowRight size={13} className="ml-1 inline" /></a>
              <a href="https://www.boatus.com/expert-advice/how-to-diy/winterization" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]">BoatUS — Winterization <ArrowRight size={13} className="ml-1 inline" /></a>
              <a href="https://www.boatus.com/documents/boatus/the-boaters-guide-to-winterizing.pdf" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]">BoatUS — The Boater’s Guide to Winterizing <ArrowRight size={13} className="ml-1 inline" /></a>
              <a href="https://www.cgaux.org/vsc/" target="_blank" rel="noreferrer" className="border-b border-[hsl(var(--accent))] pb-2 text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]">U.S. Coast Guard Auxiliary — Vessel Safety Checks <ArrowRight size={13} className="ml-1 inline" /></a>
            </div>
          </section>
        </div>
      </article>
    </ArticleLayout>
  );
}

function InfoPage({ kind }: { kind: 'about' | 'contact' | 'partner' }) {
  const content = {
    about: { eyebrow: 'The desk', title: 'Built for better days on the water.', copy: 'Lyman Marine is a field guide for the American boating life — practical, curious, and made for people who would rather be learning at the dock than talking over your head.', heroImage: images.hero },
    contact: { eyebrow: 'Say hello', title: 'Bring us a story worth telling.', copy: 'Have a launch story, maintenance lesson, product tip, or place we should know about? The Lyman desk is listening.', heroImage: images.fishing },
    partner: { eyebrow: 'Work with Lyman', title: 'Good partners belong on the water too.', copy: 'Our partner and sponsorship desk is coming soon. We are building thoughtful ways for marine brands to reach a curious, engaged audience.', heroImage: images.marina },
  }[kind];
  return <InteriorPage {...content}><section className="mx-auto max-w-[760px] px-5 py-20 text-center lg:py-28"><p className="text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">Lyman Marine is growing slowly and intentionally. More ways to contribute, collaborate, and stay close to the community are on the way.</p><Link href="/" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white">Return home <ArrowRight size={15} /></Link></section></InteriorPage>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/marketplace/:rest*" component={MarketplaceApp} />
        <Route path="/marketplace" component={MarketplaceApp} />
        <Route path="/" component={Home} />
        <Route path="/buying" component={BuyingPage} />
        <Route path="/conditions" component={MarineConditionsPage} />
        <Route path="/maintenance" component={() => <ResourcePage kind="maintenance" eyebrow="Maintenance" title="Maintenance guides for boat owners." copy="Practical field notes for engines, electrical systems, bilge pumps, fuel, trailers, and seasonal service." heroImage={images.deck} />} />
        <Route path="/gear" component={() => <ResourcePage kind="gear" eyebrow="Marine Electronics" title="Marine electronics and gear reviews." copy="Clear guidance on GPS, fish finders, radios, safety gear, batteries, covers, cleaning products, and useful onboard tools." heroImage={images.marina} />} />
        <Route path="/fishing" component={() => <ResourcePage kind="fishing" eyebrow="Fishing" title="Fishing reports and practical advice." copy="Freshwater, saltwater, fishing boats, tips, and electronics for anglers who want better information before they cast." heroImage={images.fishing} />} />
        <Route path="/reviews" component={() => <ResourcePage kind="reviews" eyebrow="Boat Reviews" title="Boat reviews with real-world context." copy="Boat, yacht, and marine product reviews with honest tradeoffs, performance notes, and a closer look at new model launches." heroImage={images.wake} />} />
        <Route path="/lifestyle" component={() => <ResourcePage kind="lifestyle" eyebrow="Boating Life" title="Boating destinations and trip guides." copy="Boating destinations, marinas, shows, travel guides, and community stories with the details that make planning easier." heroImage={images.sunset} />} />
        <Route path="/news" component={() => <ResourcePage kind="news" eyebrow="Marine News" title="Marine news and industry updates." copy="New models, industry updates, regulations, boating laws, and marine technology explained clearly." heroImage={images.wake} />} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/community/story/:id" component={CommunityStoryDetailPage} />
        <Route path="/story/community/:id" component={CommunityStoryDetailPage} />
        <Route path="/10-things-to-check-before-buying-a-used-boat" component={() => <UsedBoatBuyingGuideArticle article={articles[1]} />} />
        <Route path="/10-things-to-check-before-buying-a-used-boat/" component={() => <UsedBoatBuyingGuideArticle article={articles[1]} />} />
        <Route path="/how-to-read-the-water-when-fishing-slows-down" component={() => <ReadTheWaterArticle article={articles[2]} />} />
        <Route path="/how-to-read-the-water-when-fishing-slows-down/" component={() => <ReadTheWaterArticle article={articles[2]} />} />
        <Route path="/topic/:kind/:slug" component={ResourceStoryPage} />
        <Route path="/story/:id" component={StoryPage} />
        <Route path="/about" component={() => <InfoPage kind="about" />} />
        <Route path="/contact" component={() => <InfoPage kind="contact" />} />
        <Route path="/partner" component={() => <InfoPage kind="partner" />} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const routerBase =
    import.meta.env.BASE_URL &&
    import.meta.env.BASE_URL !== '/' &&
    import.meta.env.BASE_URL !== './'
      ? import.meta.env.BASE_URL.replace(/\/$/, '')
      : undefined;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={routerBase}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;