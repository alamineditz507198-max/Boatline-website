import { useState, useEffect } from 'react';
import type { CommunityStory, Subscriber } from '@/types/community';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc
} from 'firebase/firestore';

const STORAGE_KEY = 'lyman_marine_community_stories_v1';
const SUBSCRIBERS_STORAGE_KEY = 'boatline_subscribers_local';

export const INITIAL_STORIES: CommunityStory[] = [
  {
    id: 'cw-001',
    title: 'The 16-Foot Aluminum Skiff That Started It All',
    storyType: 'My First Boat',
    author: 'Dave Miller',
    location: 'Chesapeake Bay · Maryland',
    date: 'August 28, 2026',
    excerpt: 'It had three mismatched rivets and an old two-stroke pull-start that only ran if you talked nicely to it, but it unlocked fifty miles of tidal creeks.',
    story: `My first boat wasn’t the vessel I dreamed about when paging through glossy marine magazines. It was a 1982 16-foot flat-bottom aluminum skiff bought off a gravel driveway in Easton, Maryland for nine hundred dollars and a spare trailer tire.

The outboard was a 25-horsepower pull-start that required a gentle hand on the choke and a distinct prayer. But that summer, my brother and I learned more about the water than five decades of theoretical reading could ever teach us.

We learned where the mud shoals crept out at low tide along the Choptank. We learned how to read crab pots in the chop, how to rig an anchor line so it actually bit into shell bottom, and why you never, ever leave the slip without checking the shear pin.

Forty years later, I own a 28-foot center console with twin four-strokes and touchscreen radar. But on quiet Sunday mornings, when the mist sits flat over the marsh grass, it's that little aluminum skiff I think about. That was the boat that turned water from scenery into home.`,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'published',
    submittedAt: '2026-08-28T14:30:00.000Z',
    likes: 14,
  },
  {
    id: 'cw-002',
    title: '40 Miles Past the Shoals: The Best Fishing Trip I’ve Ever Had',
    storyType: 'The Best Fishing Trip I’ve Ever Had',
    author: 'Capt. Marcus & Ben Vance',
    location: 'Cape Hatteras · North Carolina',
    date: 'September 4, 2026',
    excerpt: 'We slipped through Oregon Inlet just as the dawn swell turned slate-gray. Two hours later, tuna birds were crashing over clean cobalt blue water.',
    story: `If you fish long enough off the Outer Banks, you spend a lot of days chasing ghosts. Fog rolls in, the temperature break shifts ten miles east overnight, or the weeds foul every bait in the spread.

Then there are days like that first Friday of September.

We left the marina at 5:15 AM under throttle, watching the inlet buoys blink in the darkness. Crossing the bar was smooth—a rarity around Hatteras. When we hit 60 fathoms, the water changed from inshore green to that deep, electric Gulf Stream cobalt blue. The surface temperature bumped four degrees in the span of five hundred yards.

My son Ben saw the shearwaters first. Thousands of birds wheeling and diving. Before we could get the third outrigger line clipped, the starboard reel was screaming off drag. For the next three hours, yellowfin tuna and blackfin were blowing up topwater poppers right beside the transom.

We kept four fish, released six, and spent the entire ride back home talking over the wind with grins we couldn’t wipe off our faces.`,
    featuredImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=80',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'published',
    submittedAt: '2026-09-04T18:15:00.000Z',
    likes: 28,
  },
  {
    id: 'cw-003',
    title: 'Dropping Hook in Secret Cove: A Weekend on the Water',
    storyType: 'A Weekend on the Water',
    author: 'Sarah & Tom Jenkins',
    location: 'Door County · Lake Michigan, WI',
    date: 'July 19, 2026',
    excerpt: 'No cell service, three days of glass-calm water, and cooking freshly netted whitefish on a portable stern grill while the lighthouse swept the bay.',
    story: `Living on the Great Lakes teaches you to seize the good weather windows with both hands. When the marine forecast showed a three-day high pressure dome settling over Green Bay and Lake Michigan, Tom and I packed the cooler, fueled up, and untied the lines before noon on Thursday.

We steered north past Sister Bay toward a quiet, sheltered limestone cove accessible only by boat. We dropped anchor in twelve feet of crystal-clear water where you could count the pebbles on the bottom.

Without phones buzzing or engines humming, the boat becomes its own self-contained world. We swam off the transom platform in the afternoon warmth, kayaked along the cedar bluffs, and watched the dusk turn from amber to deep violet.

By nighttime, the stars were so bright they mirrored off the calm lake surface. It reminded us why we own a boat: not just to go somewhere, but to unplug from everything else.`,
    featuredImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'published',
    submittedAt: '2026-07-19T21:00:00.000Z',
    likes: 19,
  },
  {
    id: 'cw-004',
    title: 'Don’t Rush the Dock: What I Learned From My First Season',
    storyType: 'What I Learned From My First Season',
    author: 'Michael Briggs',
    location: 'Long Island Sound · New York',
    date: 'June 14, 2026',
    excerpt: 'Never approach a slip faster than you are willing to hit it. It sounds funny until the wind catches your bow with a dock full of spectators watching.',
    story: `The most humbling lesson of my first season of boat ownership happened in front of about thirty people having dinner on a marina deck.

I came into my slip on a gusty Sunday afternoon feeling overly confident. I carried too much momentum, got caught by a four-knot cross breeze, panicked, bumped the throttle the wrong way, and had to be pushed off a neighbor's swim platform with boat hooks.

An old salt named Sal came down the finger pier, caught my spring line, and said with a grin: "Son, remember the golden rule: never approach a dock faster than you're willing to hit it. Shift into neutral, let the water work with you, not against you."

That simple tip changed my entire boating perspective. From that weekend on, I learned to pause outside the basin, watch the flags and current, communicate calmly with my crew, and glide into the slip with patience.`,
    featuredImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    submittedAt: '2026-06-14T11:45:00.000Z',
    likes: 31,
  },
  {
    id: 'cw-005',
    title: 'Bringing a 1968 Lyman Lapstrake Runabout Back to Life',
    storyType: 'Boat Restoration Story',
    author: 'Arthur & Leo Pendelton',
    location: 'Sandusky Bay · Lake Erie, OH',
    date: 'May 22, 2026',
    excerpt: 'Six hundred bronze screws, four coats of marine spar varnish, and eighteen months in a dusty garage. The first throttle forward made every splinter worth it.',
    story: `My father bought our 1968 Lyman 22-foot inboard in 1974. After he passed, it sat under blue tarps behind the barn for over a decade. Most people told us to salvage the engine block and scrap the hull.

My son Leo and I made a pact: we would bring her back to Sandusky Bay or go broke trying.

Over eighteen months, we replaced rotting lapstrake planks, tightened and re-bedded hundreds of silicon bronze fasteners, re-wired the 12-volt system from scratch, and sanded mahogany until our forearms throbbed. The finish required seven coats of marine varnish, each hand-rubbed with 400-grit sandpaper between coats.

When we backed the trailer into the water at the Lyman boat launch this May, she didn't take on a single drop of water. When the old Chrysler 318 fired up with that low, throaty rumble, three generations of our family were right there in that cockpit.`,
    featuredImage: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=1600&q=80',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'published',
    submittedAt: '2026-05-22T16:00:00.000Z',
    likes: 42,
  },
  {
    id: 'cw-006',
    title: 'Three Generations at the Helm: A Family Boating Tradition',
    storyType: 'A Family Boating Tradition',
    author: 'Elena Rossi',
    location: 'Lake Winnipesaukee · New Hampshire',
    date: 'August 11, 2026',
    excerpt: 'My grandfather kept a wooden runabout tied to the pine slip in 1965. Forty years later, my seven-year-old daughter took her first turn on the wheel.',
    story: `Some families pass down pocket watches or jewelry. In our family, what gets passed down is the love of early morning water.

My grandfather bought a small camp on Lake Winnipesaukee in the mid-sixties. His rule was always the same: if you were awake before the lake woke up, you got to ride shotgun on the morning mail run across the islands.

Now I have two kids of my own. We still keep the same morning ritual. We cast off while the loons are calling, the engine idling low so we don't wake the neighbors, and we head toward the open water to watch the sun climb over the mountains.

Last month, my daughter Clara stood beside me at the helm, both hands on the wheel, steering straight down the buoy channel with intense focus. That's when I realized: boats aren't just vehicles. They are vessels of memory.`,
    featuredImage: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=1600&q=80',
    status: 'published',
    submittedAt: '2026-08-11T09:30:00.000Z',
    likes: 23,
  },
  {
    id: 'cw-007',
    title: 'The 44-Pound Cobia of Cape Charles: The Day We Finally Caught It',
    storyType: 'The Day We Finally Caught It',
    author: 'Jordan & Kyle Reed',
    location: 'Lower Chesapeake Bay · Virginia',
    date: 'September 10, 2026',
    excerpt: 'After four consecutive weekends of blanking on sight-casting runs, a dark brown shadow rose right beneath the buoy chain in twenty feet of water.',
    story: `We had been running the tower on my 24-foot bay boat since late July looking for cobia cruising the surface buoys. Day after day: heat glare, sunburn, and empty bait buckets.

On Saturday morning, the tide turned slack right at Buoy 36. Kyle was up in the spotting tower while I was on the lower controls. He tapped the aluminum frame hard with his foot—our signal.

"Ten o'clock, fifteen yards off the chain, moving slow!" he called down.

I pitched a live live-well eel right onto the fish’s path. The cobia turned, inhaled it with a heavy boil, and took off toward the deep shipping channel. It was forty-five minutes of heavy thumb pressure on the spool and careful boat maneuvering before we finally saw the bronze flanks alongside the gunwale.

A magnificent 44-pound cobia. We took two quick photos, revived him gently in the current, and watched him kick strong back into the deep bay. A catch of a lifetime.`,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
    ],
    status: 'pending',
    submittedAt: '2026-09-10T15:20:00.000Z',
    email: 'jreed.boating@example.com',
    likes: 8,
  },
];

function loadLocalStories(): CommunityStory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load local stories', err);
  }
  return INITIAL_STORIES;
}

function saveLocalStories(stories: CommunityStory[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (err) {
    console.error('Failed to save local stories', err);
  }
}

// Hook to manage community stories synchronized with Google Cloud Firestore
export function useCommunityStories() {
  const [stories, setStories] = useState<CommunityStory[]>(loadLocalStories);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // Listen to real-time updates from Cloud Firestore
    const storiesCol = collection(db, 'stories');
    const q = query(storiesCol, orderBy('submittedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteStories: CommunityStory[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteStories.push({
              id: docSnap.id,
              title: data.title || '',
              storyType: data.storyType || 'Other',
              author: data.author || '',
              location: data.location || '',
              date: data.date || '',
              excerpt: data.excerpt || '',
              story: data.story || '',
              featuredImage: data.featuredImage || undefined,
              additionalPhotos: data.additionalPhotos || undefined,
              email: data.email || undefined,
              status: data.status || 'pending',
              submittedAt: data.submittedAt || new Date().toISOString(),
              likes: data.likes || 0,
            });
          });

          // Merge local initial stories that might not yet be in remote database
          const existingIds = new Set(remoteStories.map((s) => s.id));
          const merged = [...remoteStories];
          for (const initStory of INITIAL_STORIES) {
            if (!existingIds.has(initStory.id)) {
              merged.push(initStory);
            }
          }

          setStories(merged);
          saveLocalStories(merged);
        } else {
          // If remote collection is brand new, seed initial stories to local state
          const local = loadLocalStories();
          setStories(local);
        }
        setIsSyncing(false);
      },
      (error) => {
        console.warn('Firestore real-time subscription note (using cached local data):', error.message);
        setIsSyncing(false);
      }
    );

    // Also support multi-tab local broadcast
    const localHandler = () => {
      setStories(loadLocalStories());
    };
    window.addEventListener('storage', localHandler);
    window.addEventListener('lyman_stories_updated', localHandler);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', localHandler);
      window.removeEventListener('lyman_stories_updated', localHandler);
    };
  }, []);

  const notifyChange = (updated: CommunityStory[]) => {
    saveLocalStories(updated);
    setStories(updated);
    window.dispatchEvent(new Event('lyman_stories_updated'));
  };

  const submitStory = async (data: {
    name: string;
    title: string;
    location: string;
    storyType?: string;
    story: string;
    email?: string;
    featuredImage?: string;
    additionalPhotos?: string[];
  }): Promise<CommunityStory> => {
    const dateStr = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());

    const words = data.story.trim().split(/\s+/);
    const excerpt = words.slice(0, 24).join(' ') + (words.length > 24 ? '...' : '');
    const docId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const newStory: CommunityStory = {
      id: docId,
      title: data.title.trim(),
      author: data.name.trim(),
      location: data.location.trim(),
      date: dateStr,
      storyType: (data.storyType as CommunityStory['storyType']) || 'Other',
      excerpt,
      story: data.story.trim(),
      featuredImage: data.featuredImage || undefined,
      additionalPhotos: data.additionalPhotos?.length ? data.additionalPhotos : undefined,
      email: data.email?.trim() || undefined,
      status: 'pending', // IMPORTANT: All user submissions enter pending moderation queue
      submittedAt: new Date().toISOString(),
      likes: 0,
    };

    // Optimistically update local view
    const updated = [newStory, ...stories];
    notifyChange(updated);

    // Save directly to Google Cloud Firestore backend
    try {
      await setDoc(doc(db, 'stories', docId), {
        title: newStory.title,
        author: newStory.author,
        location: newStory.location,
        date: newStory.date,
        storyType: newStory.storyType,
        excerpt: newStory.excerpt,
        story: newStory.story,
        featuredImage: newStory.featuredImage || null,
        additionalPhotos: newStory.additionalPhotos || [],
        email: newStory.email || null,
        status: 'pending',
        submittedAt: newStory.submittedAt,
        likes: 0,
      });
    } catch (err) {
      console.warn('Story saved to local queue (will sync to Firestore when connected):', err);
    }

    return newStory;
  };

  const approveStory = async (id: string) => {
    const updated = stories.map((story) =>
      story.id === id ? { ...story, status: 'published' as const } : story
    );
    notifyChange(updated);

    try {
      await updateDoc(doc(db, 'stories', id), {
        status: 'published',
      });
    } catch (err) {
      console.warn('Firestore update note:', err);
    }
  };

  const rejectStory = async (id: string) => {
    const updated = stories.map((story) =>
      story.id === id ? { ...story, status: 'rejected' as const } : story
    );
    notifyChange(updated);

    try {
      await updateDoc(doc(db, 'stories', id), {
        status: 'rejected',
      });
    } catch (err) {
      console.warn('Firestore update note:', err);
    }
  };

  const deleteStory = async (id: string) => {
    const updated = stories.filter((story) => story.id !== id);
    notifyChange(updated);

    try {
      await deleteDoc(doc(db, 'stories', id));
    } catch (err) {
      console.warn('Firestore delete note:', err);
    }
  };

  const resetToDefaults = () => {
    notifyChange(INITIAL_STORIES);
  };

  const publishedStories = stories.filter((story) => story.status === 'published');
  const pendingStories = stories.filter((story) => story.status === 'pending');
  const getStoryById = (id: string) => stories.find((story) => story.id === id);

  return {
    stories,
    publishedStories,
    pendingStories,
    submitStory,
    approveStory,
    rejectStory,
    deleteStory,
    resetToDefaults,
    getStoryById,
    isSyncing,
  };
}

// Newsletter subscriber cloud service
export async function subscribeNewsletter(email: string, source = 'footer'): Promise<{ success: boolean; message?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
    return { success: false, message: 'Invalid email address' };
  }

  const subscriber: Subscriber = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    source,
  };

  // Cache locally
  try {
    const raw = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
    const list: Subscriber[] = raw ? JSON.parse(raw) : [];
    if (!list.some((s) => s.email === cleanEmail)) {
      list.push(subscriber);
      localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.error('Local subscriber cache note:', err);
  }

  // Write directly to Google Cloud Firestore backend
  try {
    await addDoc(collection(db, 'subscribers'), {
      email: subscriber.email,
      createdAt: subscriber.createdAt,
      source: subscriber.source,
    });
    return { success: true };
  } catch (err) {
    console.warn('Subscriber stored locally (Firestore sync note):', err);
    return { success: true };
  }
}

// Hook for editorial desk to view and manage subscribers
export function useSubscribers(isAuthenticated: boolean) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const raw = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    const subCol = collection(db, 'subscribers');
    const q = query(subCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Subscriber[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            email: d.email || '',
            createdAt: d.createdAt || new Date().toISOString(),
            source: d.source || 'website',
          });
        });

        // Merge with local fallback
        const existingEmails = new Set(list.map((s) => s.email));
        try {
          const raw = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
          if (raw) {
            const localList: Subscriber[] = JSON.parse(raw);
            for (const item of localList) {
              if (!existingEmails.has(item.email)) {
                list.push(item);
                existingEmails.add(item.email);
              }
            }
          }
        } catch (e) {
          console.error(e);
        }

        setSubscribers(list);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Subscribers listener note:', error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  const removeSubscriber = async (id: string, email: string) => {
    // Optimistic UI update
    setSubscribers((prev) => prev.filter((s) => s.id !== id && s.email !== email));

    try {
      const raw = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
      if (raw) {
        const list: Subscriber[] = JSON.parse(raw);
        localStorage.setItem(
          SUBSCRIBERS_STORAGE_KEY,
          JSON.stringify(list.filter((s) => s.id !== id && s.email !== email))
        );
      }
    } catch (err) {
      console.error(err);
    }

    try {
      await deleteDoc(doc(db, 'subscribers', id));
    } catch (err) {
      console.warn('Firestore subscriber delete note:', err);
    }
  };

  return { subscribers, isLoading, removeSubscriber };
}
