export interface Post {
  title: string;
  date: Date;
  description?: string;
  url: string;
  tags: string[];
}

export type TagFilter = 'all' | 'essays' | 'yj-letter' | 'curated' | 'insights';
