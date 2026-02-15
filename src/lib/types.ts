export interface Post {
  title: string;
  date: Date;
  description?: string;
  url: string;
  isExternal: boolean;
  isPaid: boolean;
  tags: string[];
  slug?: string;
}

export type TagFilter = 'all' | 'essays' | 'engineering' | 'insights';
