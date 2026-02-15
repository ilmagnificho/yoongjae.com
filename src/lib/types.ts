export interface Post {
  title: string;
  date: Date;
  description?: string;
  url: string;
  isExternal: boolean;
  isPaid: boolean;
  tags: string[];
  slug?: string;
  /** Full HTML content from Substack RSS (free posts only) */
  content?: string;
  /** Original Substack URL (kept even for internally-routed free posts) */
  substackUrl?: string;
}

export type TagFilter = 'all' | 'essays' | 'pebble-letter' | 'curated' | 'insights';
