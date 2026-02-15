import { getCollection } from 'astro:content';
import { fetchSubstackPosts } from './rss';
import type { Post } from './types';

async function getLocalPosts(): Promise<Post[]> {
  const entries = await getCollection('blog');

  return entries
    .filter((entry) => !entry.data.isDraft)
    .map((entry): Post => ({
      title: entry.data.title,
      date: entry.data.date,
      description: entry.data.description,
      url: `/blog/${entry.id}`,
      isExternal: false,
      isPaid: false,
      tags: entry.data.tags,
      slug: entry.id,
    }));
}

export async function getSortedPosts(): Promise<Post[]> {
  const [localPosts, substackPosts] = await Promise.all([
    getLocalPosts(),
    fetchSubstackPosts(),
  ]);

  const allPosts = [...localPosts, ...substackPosts];

  return allPosts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function filterPostsByTag(posts: Post[], filter: string): Post[] {
  if (filter === 'all') return posts;

  const filterMap: Record<string, string[]> = {
    essays: ['Essay'],
    'pebble-letter': ['Pebble Letter'],
    curated: ['Curated'],
    insights: ['Insight'],
  };

  const targetTags = filterMap[filter] ?? [];
  return posts.filter((post) =>
    post.tags.some((tag) => targetTags.includes(tag))
  );
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}
