import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, PlusCircle, ShieldCheck, MapPin, Calendar, User, Sparkles } from 'lucide-react';
import { useCommunityStories } from '@/lib/community-store';
import { ShareStoryModal } from './ShareStoryModal';
import { EditorialReviewModal } from './EditorialReviewModal';
import type { StoryType } from '@/types/community';

interface FromTheWaterSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export function FromTheWaterSection({ limit = 6, showViewAll = true }: FromTheWaterSectionProps) {
  const { publishedStories, pendingStories } = useCommunityStories();

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories: (string | StoryType)[] = [
    'All',
    'My First Boat',
    'The Best Fishing Trip I’ve Ever Had',
    'A Weekend on the Water',
    'What I Learned From My First Season',
    'Boat Restoration Story',
    'A Family Boating Tradition',
  ];

  const filteredStories = publishedStories.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.storyType === activeFilter;
  });

  const displayedStories = limit ? filteredStories.slice(0, limit) : filteredStories;

  return (
    <section id="from-the-water" className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-[hsl(var(--border))] pb-8 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3 text-[hsl(var(--accent))]">
            <span className="h-px w-10 bg-[hsl(var(--accent))]" />
            <span className="fine-label">Community / Readers & Owners</span>
          </div>
          <h2 className="display-font mt-3 text-4xl leading-[.94] tracking-[-.04em] text-[hsl(var(--primary))] sm:text-5xl md:text-6xl">
            From the Water
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
            Real stories from the people who live the boating life.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Moderation Desk Pill Button */}
          <button
            type="button"
            onClick={() => setIsReviewOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-xs font-semibold text-[hsl(var(--muted-foreground))] transition hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
            title="Open editorial moderation desk to review submitted stories"
          >
            <ShieldCheck size={15} className="text-[hsl(var(--accent))]" />
            <span>Editorial Desk</span>
            {pendingStories.length > 0 && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                {pendingStories.length} pending
              </span>
            )}
          </button>

          {/* Share Your Story Button */}
          <button
            type="button"
            onClick={() => setIsSubmitOpen(true)}
            data-testid="button-share-your-story"
            className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
          >
            <PlusCircle size={17} />
            <span>Share Your Story</span>
          </button>
        </div>
      </div>

      {/* Story Type Filters */}
      <div className="horizontal-snap -mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {categories.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeFilter === filter
                ? 'bg-[hsl(var(--primary))] text-white'
                : 'border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--foreground))]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Featured Community Stories Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedStories.map((story) => (
          <article
            key={story.id}
            data-testid={`card-community-story-${story.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
          >
            {/* Optional photo */}
            {story.featuredImage ? (
              <div className="image-zoom relative h-56 w-full overflow-hidden bg-[hsl(var(--primary))] sm:h-64">
                <img
                  src={story.featuredImage}
                  alt={story.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback in case of broken image URL
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    {story.storyType}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-36 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-6">
                <span className="fine-label text-[hsl(var(--accent))]">{story.storyType}</span>
                <Sparkles size={16} className="text-[hsl(var(--accent))]" />
              </div>
            )}

            {/* Card Content */}
            <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
              <div>
                {!story.featuredImage && (
                  <span className="fine-label block text-[hsl(var(--accent))]">{story.storyType}</span>
                )}
                <h3 className="display-font mt-2 text-2xl leading-[1.08] text-[hsl(var(--primary))] group-hover:text-[hsl(var(--accent))] transition">
                  {story.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))] line-clamp-3">
                  {story.excerpt}
                </p>
              </div>

              <div className="mt-6 border-t border-[hsl(var(--border))] pt-4">
                <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="flex items-center gap-1.5 font-medium text-[hsl(var(--primary))]">
                    <User size={12} className="text-[hsl(var(--accent))]" />
                    {story.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {story.date}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-[hsl(var(--muted-foreground))]">
                  <MapPin size={11} className="text-[hsl(var(--accent))]" />
                  <span className="truncate">{story.location}</span>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <Link
                    href={`/community/story/${story.id}`}
                    data-testid={`button-read-story-${story.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-xs font-bold text-white transition group-hover:bg-[hsl(var(--accent))]"
                  >
                    Read Story <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {displayedStories.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-12 text-center">
          <p className="font-serif text-xl text-[hsl(var(--primary))]">No stories in this category yet.</p>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
            Be the first to share a story about {activeFilter}!
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-bold text-white"
          >
            <PlusCircle size={15} /> Share Your Story
          </button>
        </div>
      )}

      {/* Bottom bar with Call to Action & Navigation */}
      <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7 shadow-sm sm:flex-row sm:p-8">
        <div>
          <span className="fine-label text-[hsl(var(--accent))]">Lyman Marine Reader Submissions</span>
          <h3 className="display-font mt-1 text-2xl text-[hsl(var(--primary))] sm:text-3xl">
            Have a boating moment or field note to share?
          </h3>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            From first launches to restoration journeys, your story belongs in the Lyman Marine archive.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSubmitOpen(true)}
            className="rounded-full bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
          >
            Share Your Story
          </button>
          {showViewAll && (
            <Link
              href="/community"
              className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-5 py-2.5 text-sm font-semibold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--muted))]"
            >
              Explore all dispatches <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Share story modal */}
      <ShareStoryModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onOpenModeration={() => setIsReviewOpen(true)}
      />

      {/* Editorial review modal */}
      <EditorialReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </section>
  );
}
