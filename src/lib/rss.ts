import type { Post } from './types';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  categories?: string[];
  content?: string;
}

const SUBSTACK_FEED_URL = 'https://yoongjae.substack.com/feed';

function parseXML(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const getTag = (tag: string): string => {
      const tagMatch = itemXml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([\\s\\S]*?)</${tag}>`));
      return tagMatch ? (tagMatch[1] || tagMatch[2] || '').trim() : '';
    };

    const categories: string[] = [];
    const catRegex = /<category>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/g;
    let catMatch;
    while ((catMatch = catRegex.exec(itemXml)) !== null) {
      categories.push(catMatch[1].trim());
    }

    items.push({
      title: getTag('title'),
      link: getTag('link'),
      pubDate: getTag('pubDate'),
      description: getTag('description'),
      categories,
      content: getTag('content:encoded'),
    });
  }

  return items;
}

function categorizeTags(categories: string[]): string[] {
  const tags: string[] = [];
  const joined = categories.join(' ').toLowerCase();

  if (joined.includes('tech') || joined.includes('engineering') || joined.includes('dev')) {
    tags.push('Engineering');
  }
  if (joined.includes('essay')) {
    tags.push('Essay');
  }
  if (tags.length === 0) {
    tags.push('Insight');
  }

  return tags;
}

function isPaidContent(item: RSSItem): boolean {
  const categories = item.categories?.map(c => c.toLowerCase()) ?? [];
  if (categories.some(c => c.includes('paid'))) return true;

  // Check if content is truncated (common Substack pattern for paid posts)
  if (item.content && item.description) {
    const contentLength = item.content.replace(/<[^>]*>/g, '').length;
    if (contentLength < 200 && item.description.includes('…')) return true;
  }

  return false;
}

export async function fetchSubstackPosts(): Promise<Post[]> {
  try {
    const response = await fetch(SUBSTACK_FEED_URL);
    if (!response.ok) {
      console.warn(`Failed to fetch Substack RSS: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const items = parseXML(xml);

    return items.map((item): Post => ({
      title: item.title,
      date: new Date(item.pubDate),
      description: item.description?.replace(/<[^>]*>/g, '').slice(0, 200),
      url: item.link,
      isExternal: true,
      isPaid: isPaidContent(item),
      tags: categorizeTags(item.categories ?? []),
    }));
  } catch (error) {
    console.warn('Failed to fetch Substack feed:', error);
    return [];
  }
}
