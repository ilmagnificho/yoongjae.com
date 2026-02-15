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

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

function decodeEntities(text: string): string {
  // Decode named entities
  let decoded = text.replace(/&\w+;/g, (entity) => HTML_ENTITIES[entity] ?? entity);
  // Decode numeric entities (&#12345; or &#x1F512;)
  decoded = decoded.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
  return decoded;
}

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
      title: decodeEntities(getTag('title')),
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

/** Extract a URL-safe slug from a Substack post URL */
function extractSlug(link: string): string {
  try {
    const url = new URL(link);
    // Substack URLs: https://yoongjae.substack.com/p/my-post-title
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'untitled';
  } catch {
    return link.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  }
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      console.warn(`Substack RSS returned ${response.status} (attempt ${attempt + 1}/${retries + 1})`);
    } catch (error) {
      console.warn(`Substack RSS fetch failed (attempt ${attempt + 1}/${retries + 1}):`, error);
    }
    if (attempt < retries) {
      const delay = 2000 * Math.pow(2, attempt); // 2s, 4s, 8s
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error(`Failed to fetch Substack RSS after ${retries + 1} attempts`);
}

export async function fetchSubstackPosts(): Promise<Post[]> {
  try {
    const response = await fetchWithRetry(SUBSTACK_FEED_URL);
    const xml = await response.text();
    const items = parseXML(xml);

    if (items.length === 0) {
      console.warn('Substack RSS returned 0 items — feed may be empty or parsing failed');
    }

    return items.map((item): Post => {
      const paid = isPaidContent(item);
      const slug = extractSlug(item.link);
      const description = item.description
        ? decodeEntities(item.description.replace(/<[^>]*>/g, '')).slice(0, 200)
        : undefined;

      return {
        title: item.title,
        date: new Date(item.pubDate),
        description,
        // Free posts → internal route, Paid posts → Substack link
        url: paid ? item.link : `/substack/${slug}`,
        isExternal: paid,
        isPaid: paid,
        tags: categorizeTags(item.categories ?? []),
        slug: paid ? undefined : slug,
        // Store full content for free posts
        content: paid ? undefined : item.content,
        substackUrl: item.link,
      };
    });
  } catch (error) {
    // In CI/build, fail loudly so a broken build doesn't overwrite a good deployment
    if (process.env.CI || process.env.GITHUB_ACTIONS) {
      throw new Error(`Substack RSS fetch failed during CI build — aborting to prevent deploying without posts. Original error: ${error}`);
    }
    console.warn('Failed to fetch Substack feed:', error);
    return [];
  }
}
