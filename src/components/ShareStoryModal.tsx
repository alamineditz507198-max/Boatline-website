import { useState, useRef, type ChangeEvent } from 'react';
import { X, Upload, Check, Image as ImageIcon, Trash2, ShipWheel, Sparkles } from 'lucide-react';
import type { StoryType } from '@/types/community';
import { useCommunityStories } from '@/lib/community-store';

const STORY_TYPES: StoryType[] = [
  'My First Boat',
  'The Best Fishing Trip I’ve Ever Had',
  'A Weekend on the Water',
  'What I Learned From My First Season',
  'A Family Boating Tradition',
  'The Day We Finally Caught It',
  'Favorite Local Waterway',
  'Boat Restoration Story',
  'Other',
];

const PRESET_BOAT_PHOTOS = [
  { label: 'Offshore Motorboat', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Classic Wooden Boat', url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Angler at Sunrise', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cove Anchorage', url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Open Blue Water', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Restoration Project', url: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=1200&q=80' },
];

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModeration?: () => void;
}

export function ShareStoryModal({ isOpen, onClose, onOpenModeration }: ShareStoryModalProps) {
  const { submitStory } = useCommunityStories();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [storyType, setStoryType] = useState<StoryType>('My First Boat');
  const [story, setStory] = useState('');
  const [email, setEmail] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be re-uploaded if needed
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addPresetPhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !story.trim()) return;

    setIsSubmitting(true);

    try {
      submitStory({
        name,
        title,
        location: location.trim() || 'Coastal Waters',
        storyType,
        story,
        email,
        featuredImage: photos[0] || undefined,
        additionalPhotos: photos.slice(1),
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit story', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setTitle('');
    setLocation('');
    setStory('');
    setEmail('');
    setPhotos([]);
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6"
      onClick={handleResetAndClose}
    >
      <div
        className="relative my-8 w-full max-w-2xl rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-2xl transition sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-5 top-5 rounded-full border border-[hsl(var(--border))] p-2 text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))]">
              <Check size={32} />
            </div>
            <span className="fine-label mt-5 block text-[hsl(var(--accent))]">Submission received</span>
            <h3 className="display-font mt-2 text-3xl leading-tight text-[hsl(var(--primary))]">
              Story Submitted for Review
            </h3>
            <div className="mx-auto mt-4 max-w-md rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 p-5 text-sm leading-relaxed text-[hsl(var(--foreground))]">
              “Thanks for sharing your story. Our editorial team will review your submission before publishing.”
            </div>
            <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
              To protect publication quality, our desk verifies submissions before they appear in “From the Water.”
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Back to Community
              </button>
              {onOpenModeration && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onOpenModeration();
                  }}
                  className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--muted))]"
                >
                  View in Editorial Desk
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[hsl(var(--accent))]">
                <ShipWheel size={18} />
                <span className="fine-label">Lyman Marine / Community Dispatches</span>
              </div>
              <h2 className="display-font mt-2 text-3xl leading-tight text-[hsl(var(--primary))] sm:text-4xl">
                Share Your Story
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                Share your boating experience with the Lyman Marine community. Stories should be original and related to boating, fishing, life on the water, or marine experiences.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="submit-author-name" className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                    Name <span className="text-[hsl(var(--accent))]">*</span>
                  </label>
                  <input
                    id="submit-author-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Captain Dan or Sarah Jenkins"
                    className="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent))]"
                  />
                </div>

                <div>
                  <label htmlFor="submit-location" className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                    Location <span className="text-[hsl(var(--accent))]">*</span>
                  </label>
                  <input
                    id="submit-location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Chesapeake Bay · MD or Lake Michigan · MI"
                    className="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent))]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label htmlFor="submit-story-title" className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                    Story Title <span className="text-[hsl(var(--accent))]">*</span>
                  </label>
                  <input
                    id="submit-story-title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My First Boat: The Skiff That Started It All"
                    className="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent))]"
                  />
                </div>

                <div>
                  <label htmlFor="submit-story-type" className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                    Story Type
                  </label>
                  <select
                    id="submit-story-type"
                    value={storyType}
                    onChange={(e) => setStoryType(e.target.value as StoryType)}
                    className="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))]"
                  >
                    {STORY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="submit-story-content" className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                  Story <span className="text-[hsl(var(--accent))]">*</span>
                </label>
                <textarea
                  id="submit-story-content"
                  required
                  rows={5}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Tell us about the boat, the crew, the conditions, the lessons, or the day that stuck with you..."
                  className="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5 text-sm leading-relaxed text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent))]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                    Upload Photos
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="flex items-center gap-1 text-xs text-[hsl(var(--accent))] hover:underline"
                  >
                    <Sparkles size={12} />
                    {showPresets ? 'Hide marine gallery presets' : 'Select from marine photo gallery'}
                  </button>
                </div>

                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-file-input"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 text-center transition hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--muted))]/40"
                  >
                    <Upload size={22} className="text-[hsl(var(--accent))]" />
                    <p className="mt-2 text-xs font-semibold text-[hsl(var(--primary))]">
                      Click or drag to upload photos from your phone or computer
                    </p>
                    <p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">
                      JPG, PNG, WebP up to 10MB
                    </p>
                  </div>
                </div>

                {showPresets && (
                  <div className="mt-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3">
                    <span className="fine-label text-[10px] text-[hsl(var(--muted-foreground))]">Quick marine gallery presets:</span>
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {PRESET_BOAT_PHOTOS.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => addPresetPhoto(preset.url)}
                          className="group relative overflow-hidden rounded-lg border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                        >
                          <img src={preset.url} alt={preset.label} className="h-14 w-full object-cover transition group-hover:scale-105" />
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 p-0.5 text-[9px] font-medium text-white truncate">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="group relative h-16 w-20 overflow-hidden rounded-lg border border-[hsl(var(--border))]">
                        <img src={photo} alt={`Uploaded ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute right-1 top-1 rounded bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                          title="Remove photo"
                        >
                          <Trash2 size={12} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[hsl(var(--primary))]/90 text-center text-[8px] font-bold uppercase tracking-wider text-white">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="submit-author-email" className="block text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
                  Email <span className="font-normal text-[hsl(var(--muted-foreground))] lowercase">(optional)</span>
                </label>
                <input
                  id="submit-author-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com (only used if editors have a follow-up question)"
                  className="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] outline-none transition focus:border-[hsl(var(--accent))] focus:ring-1 focus:ring-[hsl(var(--accent))]"
                />
              </div>

              <div className="rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3.5 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                <span className="font-semibold text-[hsl(var(--primary))]">Editorial review process:</span> All submissions are reviewed by Lyman Marine editors to verify authentic boating context before appearing publicly on “From the Water.”
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="rounded-full border border-[hsl(var(--border))] px-5 py-2.5 text-sm font-semibold text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Story'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
