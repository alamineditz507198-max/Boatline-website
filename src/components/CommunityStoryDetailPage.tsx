import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, ArrowRight, MapPin, Calendar, User, Share2, ShipWheel, Check, Bookmark, Sparkles } from 'lucide-react';
import { useCommunityStories } from '@/lib/community-store';

export function CommunityStoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getStoryById } = useCommunityStories();
  const story = getStoryById(id || '');

  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (story) {
      document.title = `${story.title} — Lyman Marine From the Water`;
    }
  }, [story]);

  if (!story) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <ShipWheel size={42} className="mx-auto text-[hsl(var(--accent))] opacity-75" />
        <h2 className="display-font mt-4 text-3xl text-[hsl(var(--primary))]">Community Story Not Found</h2>
        <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
          The requested dispatch may have been moved or is still pending editorial verification.
        </p>
        <Link
          href="/community"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-bold text-white"
        >
          <ArrowLeft size={15} /> Back to Community
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Split story into paragraphs for elegant magazine rendering
  const paragraphs = story.story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-[960px] px-5 py-10 sm:py-16 lg:px-8">
      {/* Back button and breadcrumb */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/community"
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))] transition hover:text-[hsl(var(--primary))]"
        >
          <ArrowLeft size={14} className="transition group-hover:-translate-x-1" />
          Back to Community
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-1.5 text-xs font-semibold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--muted))]"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
            {copied ? 'Link copied' : 'Share story'}
          </button>
        </div>
      </div>

      {/* Header section */}
      <header className="border-b border-[hsl(var(--border))] pb-10">
        <div className="flex items-center gap-3 text-[hsl(var(--accent))]">
          <span className="h-px w-10 bg-[hsl(var(--accent))]" />
          <span className="fine-label">From the Water / {story.storyType}</span>
        </div>

        <h1 className="display-font mt-4 text-4xl leading-[.94] tracking-[-.04em] text-[hsl(var(--primary))] sm:text-5xl md:text-6xl lg:text-7xl">
          {story.title}
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[hsl(var(--muted-foreground))]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 font-medium text-[hsl(var(--primary))]">
              <User size={14} className="text-[hsl(var(--accent))]" />
              {story.author}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[hsl(var(--accent))]" />
              {story.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {story.date}
            </span>
          </div>

          <span className="rounded-full bg-[hsl(var(--muted))] px-3 py-1 font-mono text-[11px] text-[hsl(var(--primary))]">
            Lyman Marine Reader Dispatch
          </span>
        </div>
      </header>

      {/* Large featured image if provided */}
      {story.featuredImage && (
        <div className="mt-10 overflow-hidden rounded-2xl bg-[hsl(var(--primary))] shadow-[var(--shadow-lift)]">
          <img
            src={story.featuredImage}
            alt={story.title}
            className="max-h-[580px] w-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="border-t border-white/15 bg-[hsl(var(--primary))] px-5 py-3 text-xs text-white/70">
            <span>Submitted by {story.author} · {story.location}</span>
          </div>
        </div>
      )}

      {/* Story excerpt pullout */}
      {story.excerpt && (
        <div className="my-10 border-l-2 border-[hsl(var(--accent))] pl-6 italic text-lg leading-relaxed text-[hsl(var(--primary))] sm:text-xl md:text-2xl font-serif">
          “{story.excerpt}”
        </div>
      )}

      {/* Full story prose */}
      <div className="prose prose-lg max-w-none space-y-6 text-base leading-relaxed text-[hsl(var(--foreground))] md:text-lg">
        {paragraphs.map((para, index) => (
          <p
            key={index}
            className={index === 0 ? 'first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:leading-none first-letter:text-[hsl(var(--primary))]' : ''}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Additional submitted photos */}
      {story.additionalPhotos && story.additionalPhotos.length > 0 && (
        <div className="mt-14 border-t border-[hsl(var(--border))] pt-10">
          <div className="flex items-center gap-2 text-[hsl(var(--accent))]">
            <Sparkles size={16} />
            <span className="fine-label">Field Gallery / Additional Submitted Photos</span>
          </div>
          <h3 className="display-font mt-2 text-2xl text-[hsl(var(--primary))]">
            Photos from the Water
          </h3>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            Photographs shared by {story.author} alongside this dispatch.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {story.additionalPhotos.map((photo, index) => (
              <div
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-black/5"
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1} from ${story.author}`}
                  className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 transition group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold">
                  Click to enlarge
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contributor badge / author card */}
      <div className="mt-16 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--accent))]">
              <ShipWheel size={26} />
            </div>
            <div>
              <span className="fine-label text-[hsl(var(--accent))]">Community Contributor</span>
              <h4 className="display-font text-xl text-[hsl(var(--primary))]">{story.author}</h4>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Reporting from {story.location}
              </p>
            </div>
          </div>

          <Link
            href="/community"
            className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
          >
            <ArrowLeft size={13} /> Back to Community Stories
          </Link>
        </div>
      </div>

      {/* Lightbox photo modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto}
              alt="Enlarged view"
              className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
