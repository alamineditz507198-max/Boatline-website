import { useState, useEffect } from 'react';
import { X, Check, Trash2, Eye, EyeOff, ShieldCheck, Clock, MapPin, User, Mail, Sparkles, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { useCommunityStories } from '@/lib/community-store';
import type { CommunityStory } from '@/types/community';

const EDITORIAL_PASSCODE = '280230507198';
const AUTH_STORAGE_KEY = 'lyman_editorial_authenticated';

interface EditorialReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStory?: (id: string) => void;
}

export function EditorialReviewModal({ isOpen, onClose, onOpenStory }: EditorialReviewModalProps) {
  const { pendingStories, publishedStories, approveStory, rejectStory, deleteStory, resetToDefaults } = useCommunityStories();
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');
  const [selectedStory, setSelectedStory] = useState<CommunityStory | null>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAuthError(null);
      setEnteredPasscode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasscode.trim() === EDITORIAL_PASSCODE) {
      setIsAuthenticated(true);
      setAuthError(null);
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } catch (err) {
        console.error(err);
      }
    } else {
      setAuthError('Incorrect passcode. Access to editorial desk is restricted.');
    }
  };

  const handleLockDesk = () => {
    setIsAuthenticated(false);
    setEnteredPasscode('');
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  };

  const currentStory = selectedStory || (activeTab === 'pending' ? pendingStories[0] : publishedStories[0]);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative flex h-[92vh] sm:h-[88vh] max-h-[850px] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--accent))]">
              <ShieldCheck size={18} className="sm:size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="fine-label text-[10px] sm:text-xs text-[hsl(var(--accent))]">Editorial Desk</span>
                <span className="rounded-full bg-[hsl(var(--accent))]/15 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[hsl(var(--accent))]">
                  {isAuthenticated ? 'Staff' : 'Protected'}
                </span>
              </div>
              <h2 className="display-font text-base sm:text-xl lg:text-2xl leading-tight text-[hsl(var(--primary))]">
                Submissions Review
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLockDesk}
                className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                title="Lock editorial desk"
              >
                <Lock size={12} />
                <span className="hidden sm:inline">Lock Desk</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* If NOT authenticated, show the Passcode Verification Gate */}
        {!isAuthenticated ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center sm:p-12">
            <div className="w-full max-w-sm rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--accent))] shadow-sm">
                <KeyRound size={22} />
              </div>

              <h3 className="display-font mt-4 text-xl text-[hsl(var(--primary))]">
                Editorial passcode required
              </h3>

              <form onSubmit={handleVerifyPasscode} className="mt-5 space-y-3">
                <div className="relative">
                  <input
                    id="editorial-passcode-input"
                    type={showPasscode ? 'text' : 'password'}
                    autoFocus
                    required
                    value={enteredPasscode}
                    onChange={(e) => {
                      setEnteredPasscode(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Passcode"
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-4 py-2.5 pr-10 text-center font-mono text-sm tracking-widest text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:bg-[hsl(var(--card))] focus:ring-1 focus:ring-[hsl(var(--accent))]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                    title={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {authError && (
                  <div className="flex items-center justify-center gap-1.5 rounded-lg bg-rose-50 p-2.5 text-xs font-medium text-rose-700">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-[hsl(var(--primary))] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[hsl(var(--accent))]"
                >
                  Enter
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Tab switch */}
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 px-4 py-2 sm:px-6">
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('pending');
                    setSelectedStory(null);
                    setMobileView('list');
                  }}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                    activeTab === 'pending'
                      ? 'bg-[hsl(var(--primary))] text-white shadow'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  Pending ({pendingStories.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('published');
                    setSelectedStory(null);
                    setMobileView('list');
                  }}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                    activeTab === 'published'
                      ? 'bg-[hsl(var(--primary))] text-white shadow'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  Published ({publishedStories.length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                {mobileView === 'detail' && (
                  <button
                    type="button"
                    onClick={() => setMobileView('list')}
                    className="inline-flex items-center gap-1 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1 text-xs font-semibold text-[hsl(var(--primary))] lg:hidden"
                  >
                    ← List
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] underline"
                  title="Reset stories to initial editorial seed"
                >
                  Reset seed
                </button>
              </div>
            </div>

            {/* Body grid */}
            <div className="grid flex-1 overflow-hidden lg:grid-cols-[340px_1fr]">
              {/* Submissions list */}
              <div className={`overflow-y-auto border-r border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 p-3.5 sm:p-4 ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
                {activeTab === 'pending' ? (
                  pendingStories.length === 0 ? (
                    <div className="py-12 text-center text-sm text-[hsl(var(--muted-foreground))]">
                      <Clock size={28} className="mx-auto mb-2 text-[hsl(var(--muted-foreground))]/60" />
                      <p className="font-semibold text-[hsl(var(--primary))]">Queue is all clear!</p>
                      <p className="mt-1 text-xs">No community submissions are waiting for moderation.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {pendingStories.map((item) => {
                        const isSelected = currentStory?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedStory(item);
                              setMobileView('detail');
                            }}
                            className={`cursor-pointer rounded-xl border p-3.5 transition active:scale-98 ${
                              isSelected
                                ? 'border-[hsl(var(--accent))] bg-[hsl(var(--card))] shadow-sm'
                                : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--accent))]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]">
                              <span className="font-semibold text-[hsl(var(--accent))]">{item.storyType}</span>
                              <span>{item.date}</span>
                            </div>
                            <h4 className="display-font mt-1.5 text-base leading-tight text-[hsl(var(--primary))] line-clamp-2">
                              {item.title}
                            </h4>
                            <div className="mt-2 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                              <User size={12} />
                              <span className="truncate">{item.author}</span>
                              <span>·</span>
                              <MapPin size={12} />
                              <span className="truncate">{item.location}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div className="space-y-2.5">
                    {publishedStories.map((item) => {
                      const isSelected = currentStory?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedStory(item);
                            setMobileView('detail');
                          }}
                          className={`cursor-pointer rounded-xl border p-3.5 transition active:scale-98 ${
                            isSelected
                              ? 'border-[hsl(var(--accent))] bg-[hsl(var(--card))] shadow-sm'
                              : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--accent))]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]">
                            <span className="font-semibold text-[hsl(var(--accent))]">{item.storyType}</span>
                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                              <Check size={11} /> Published
                            </span>
                          </div>
                          <h4 className="display-font mt-1.5 text-base leading-tight text-[hsl(var(--primary))] line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                            By {item.author} · {item.location}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Story review preview panel */}
              <div className={`flex flex-col overflow-y-auto bg-[hsl(var(--card))] p-4 sm:p-6 lg:p-8 ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
                {currentStory ? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[hsl(var(--border))] pb-4">
                      <div>
                        <span className="fine-label text-[hsl(var(--accent))]">{currentStory.storyType}</span>
                        <span className="ml-2 rounded bg-[hsl(var(--muted))] px-2 py-0.5 text-[11px] font-mono text-[hsl(var(--muted-foreground))]">
                          ID: {currentStory.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {currentStory.status === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                approveStory(currentStory.id);
                                setSelectedStory(null);
                                setMobileView('list');
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow transition hover:bg-emerald-700 active:scale-95"
                            >
                              <Check size={14} /> Approve & Publish
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                rejectStory(currentStory.id);
                                setSelectedStory(null);
                                setMobileView('list');
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 active:scale-95"
                            >
                              <X size={14} /> Decline
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            {onOpenStory && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onOpenStory(currentStory.id);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary))] px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 active:scale-95"
                              >
                                <Eye size={13} /> View Live
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                deleteStory(currentStory.id);
                                setSelectedStory(null);
                                setMobileView('list');
                              }}
                              className="rounded-full border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))] hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                              title="Delete story"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="display-font text-2xl sm:text-3xl leading-tight text-[hsl(var(--primary))]">
                        {currentStory.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1">
                          <User size={13} className="text-[hsl(var(--accent))]" />
                          <strong>{currentStory.author}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-[hsl(var(--accent))]" />
                          {currentStory.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          Submitted {currentStory.date}
                        </span>
                        {currentStory.email && (
                          <span className="flex items-center gap-1 text-[hsl(var(--muted-foreground))]">
                            <Mail size={13} />
                            {currentStory.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {currentStory.featuredImage && (
                      <div className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-black/5">
                        <img
                          src={currentStory.featuredImage}
                          alt={currentStory.title}
                          className="max-h-72 w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
                      <span className="fine-label text-[10px] text-[hsl(var(--accent))]">Excerpt preview</span>
                      <p className="mt-1 text-sm italic text-[hsl(var(--muted-foreground))]">“{currentStory.excerpt}”</p>
                    </div>

                    <div className="space-y-3">
                      <span className="fine-label text-[10px] text-[hsl(var(--muted-foreground))]">Full Story Body</span>
                      <div className="whitespace-pre-line text-sm leading-relaxed text-[hsl(var(--foreground))]">
                        {currentStory.story}
                      </div>
                    </div>

                    {currentStory.additionalPhotos && currentStory.additionalPhotos.length > 0 && (
                      <div>
                        <span className="fine-label text-[10px] text-[hsl(var(--muted-foreground))]">
                          Additional Submitted Photos ({currentStory.additionalPhotos.length})
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {currentStory.additionalPhotos.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Additional ${i + 1}`}
                              className="h-20 w-28 rounded-lg border border-[hsl(var(--border))] object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-[hsl(var(--muted-foreground))]">
                    Select a story from the left list to review.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
