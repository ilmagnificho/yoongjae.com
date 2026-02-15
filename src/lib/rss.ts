import { XMLParser } from 'fast-xml-parser';
import type { Post } from './types';

const SUBSTACK_FEED_URL = 'https://yoongjae.substack.com/feed';

// ─── XML Parsing ────────────────────────────────────────────────

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  category?: string | string[];
  'content:encoded'?: string;
}

function parseRSS(xml: string): RSSItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
    textNodeName: '__text',
    // Preserve content:encoded as a single string (not parsed as HTML)
    processEntities: true,
    htmlEntities: true,
    tagValueProcessor: (_tagName: string, val: string) => val,
  });

  const feed = parser.parse(xml);
  const channel = feed?.rss?.channel;
  if (!channel) {
    console.warn('Substack RSS: could not find <rss><channel> in feed');
    return [];
  }

  // Normalize to array (single item comes as object, not array)
  const rawItems = channel.item;
  if (!rawItems) return [];
  const items: unknown[] = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items.map((raw: unknown) => {
    const item = raw as Record<string, unknown>;
    return {
      title: extractText(item.title),
      link: extractText(item.link),
      pubDate: extractText(item.pubDate),
      description: extractText(item.description),
      category: item.category as string | string[] | undefined,
      'content:encoded': extractText(item['content:encoded']),
    };
  });
}

/** Extract text from a parsed XML node (handles CDATA, plain text, nested objects) */
function extractText(node: unknown): string {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    // CDATA content
    if ('__cdata' in obj) return String(obj.__cdata ?? '');
    // Text node
    if ('__text' in obj) return String(obj.__text ?? '');
    // Try #text (another common parser output)
    if ('#text' in obj) return String(obj['#text'] ?? '');
  }
  return String(node);
}

// ─── Tag / Category mapping ─────────────────────────────────────

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

function extractCategories(item: RSSItem): string[] {
  const cat = item.category;
  if (!cat) return [];
  if (Array.isArray(cat)) return cat.map((c) => String(c).trim());
  return [String(cat).trim()];
}

// ─── Paid detection ─────────────────────────────────────────────

function isPaidContent(item: RSSItem, categories: string[]): boolean {
  if (categories.some((c) => c.toLowerCase().includes('paid'))) return true;

  const content = item['content:encoded'] ?? '';
  const description = item.description ?? '';
  if (content && description) {
    const textLength = content.replace(/<[^>]*>/g, '').length;
    if (textLength < 200 && description.includes('…')) return true;
  }

  return false;
}

// ─── Slug extraction ────────────────────────────────────────────

function extractSlug(link: string): string {
  try {
    const url = new URL(link);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'untitled';
  } catch {
    return link.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'untitled';
  }
}

// ─── Strip HTML tags for description ────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// ─── Fetch with retry ───────────────────────────────────────────

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
      const delay = 2000 * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error(`Failed to fetch Substack RSS after ${retries + 1} attempts`);
}

// ─── Main export ────────────────────────────────────────────────

export async function fetchSubstackPosts(): Promise<Post[]> {
  try {
    const response = await fetchWithRetry(SUBSTACK_FEED_URL);
    const xml = await response.text();
    const items = parseRSS(xml);

    // Build-time diagnostics
    console.log(`[Substack] Fetched ${items.length} items from RSS`);
    items.forEach((item, i) => {
      const contentLen = (item['content:encoded'] ?? '').length;
      console.log(`  [${i}] "${item.title}" — link=${item.link}, content=${contentLen} chars`);
    });

    if (items.length === 0) {
      console.warn('[Substack] RSS returned 0 items — feed may be empty or parsing failed');
    }

    return items.map((item): Post => {
      const categories = extractCategories(item);
      const paid = isPaidContent(item, categories);
      const slug = extractSlug(item.link);
      const content = item['content:encoded'] ?? '';
      const hasContent = !paid && content.trim().length > 0;
      const description = item.description ? stripHtml(item.description).slice(0, 200) : undefined;

      return {
        title: item.title,
        date: new Date(item.pubDate),
        description,
        url: hasContent ? `/substack/${slug}` : item.link,
        isExternal: !hasContent,
        isPaid: paid,
        tags: categorizeTags(categories),
        slug: hasContent ? slug : undefined,
        content: hasContent ? content : undefined,
        substackUrl: item.link,
      };
    });
  } catch (error) {
    if (process.env.CI || process.env.GITHUB_ACTIONS) {
      throw new Error(`Substack RSS fetch failed during CI build — aborting to prevent deploying without posts. Original error: ${error}`);
    }
    console.warn('Failed to fetch Substack feed:', error);
    return [];
  }
}
