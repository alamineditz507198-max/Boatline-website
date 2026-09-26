export type StoryType =
  | 'My First Boat'
  | 'The Best Fishing Trip I’ve Ever Had'
  | 'A Weekend on the Water'
  | 'What I Learned From My First Season'
  | 'A Family Boating Tradition'
  | 'The Day We Finally Caught It'
  | 'Favorite Local Waterway'
  | 'Boat Restoration Story'
  | 'Other';

export interface CommunityStory {
  id: string;
  title: string;
  storyType: StoryType;
  author: string;
  location: string;
  date: string;
  excerpt: string;
  story: string;
  featuredImage?: string;
  additionalPhotos?: string[];
  email?: string;
  status: 'published' | 'pending' | 'rejected';
  submittedAt: string;
  likes?: number;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  source?: string;
}
