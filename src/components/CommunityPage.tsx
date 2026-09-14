import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, PlusCircle, ShieldCheck, ShipWheel, Sparkles, BookOpen, Compass, Award } from 'lucide-react';
import { FromTheWaterSection } from './FromTheWaterSection';
import { ShareStoryModal } from './ShareStoryModal';
import { EditorialReviewModal } from './EditorialReviewModal';
import { useCommunityStories } from '@/lib/community-store';

export function CommunityPage() {
  const { publishedStories, pendingStories } = useCommunityStories();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  return (
    <div className="pb-24">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden bg-[hsl(var(--primary))] py-20 text-white lg:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))] via-[hsl(var(--primary))]/80 to-transparent" />

        <div className="relative mx-auto max-w-[1320px] px-5 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={14} /> Back to Lyman Marine
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="flex items-center gap-3 text-[hsl(var(--accent))]">
              <ShipWheel size={20} />
              <span className="fine-label">Lyman Marine Editorial Community</span>
            </div>
            <h1 className="display-font mt-4 text-5xl leading-[.92] tracking-[-.04em] sm:text-6xl md:text-7xl">
              From the Water
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl font-light">
              Real stories from the people who live the boating life.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSubmitOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                <PlusCircle size={17} /> Share Your Story
              </button>

              <button
                type="button"
                onClick={() => setIsReviewOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <ShieldCheck size={16} />
                <span>Editorial Desk</span>
                {pendingStories.length > 0 && (
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black">
                    {pendingStories.length} pending
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Standards & Submission Prompts Banner */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] py-12">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--accent))]">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="display-font text-lg text-[hsl(var(--primary))]">Original Field Experiences</h4>
                <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                  Authentic dispatches from real boaters. First boats, memorable trips, restorations, and lessons learned.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--accent))]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="display-font text-lg text-[hsl(var(--primary))]">Editorial Curation</h4>
                <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                  Every submission is reviewed by our editorial team to maintain a dignified, high-craft publication.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--accent))]">
                <Award size={20} />
              </div>
              <div>
                <h4 className="display-font text-lg text-[hsl(var(--primary))]">Permanent Archive</h4>
                <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                  Published dispatches become part of the Lyman Marine permanent waterside library for fellow mariners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The main From The Water Section */}
      <FromTheWaterSection limit={0} showViewAll={false} />

      {/* Modals */}
      <ShareStoryModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onOpenModeration={() => setIsReviewOpen(true)}
      />

      <EditorialReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </div>
  );
}
