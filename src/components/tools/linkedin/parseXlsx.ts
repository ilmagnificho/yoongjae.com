import type { DashboardData } from './data';
import { DAY_KEYS } from './data';

const DAYNAME_MAP: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday',
};

function toDateStr(v: unknown): string {
  if (typeof v === 'number') {
    // Excel serial date
    const d = new Date((v - 25569) * 86400 * 1000);
    return d.toISOString().slice(0, 10);
  }
  if (typeof v === 'string') {
    // Try various formats
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return '';
}

export async function parseLinkedInXlsx(file: File): Promise<DashboardData | null> {
  try {
    const XLSX = await import('xlsx');
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });

    // LinkedIn exports have specific sheet names (Korean)
    const engSheet = wb.Sheets[wb.SheetNames.find(n =>
      n.includes('참여') || n.includes('ENGAGEMENT') || n.includes('engagement')
    ) || wb.SheetNames[0]];

    const folSheet = wb.Sheets[wb.SheetNames.find(n =>
      n.includes('팔로워') || n.includes('FOLLOWER') || n.includes('follower')
    ) || ''];

    if (!engSheet) return null;

    const engRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(engSheet);

    // Build engagement array
    const engagement: DashboardData['engagement'] = [];
    for (const row of engRows) {
      const dateVal = row['날짜'] ?? row['Date'] ?? row['date'] ?? Object.values(row)[0];
      const dateStr = toDateStr(dateVal);
      if (!dateStr) continue;

      const imp = Number(row['노출수'] ?? row['Impressions'] ?? row['impressions'] ?? Object.values(row)[1]) || 0;
      const eng = Number(row['참여'] ?? row['Engagement'] ?? row['engagement'] ?? Object.values(row)[2]) || 0;
      const rate = imp > 0 ? Math.round((eng / imp) * 10000) / 100 : 0;
      const d = new Date(dateStr);
      engagement.push({
        date: dateStr,
        impressions: imp,
        engagement: eng,
        eng_rate: rate,
        dayname: DAYNAME_MAP[d.getDay()] || '',
      });
    }

    if (engagement.length === 0) return null;
    engagement.sort((a, b) => a.date.localeCompare(b.date));

    // Build followers
    const followers: DashboardData['followers'] = [];
    if (folSheet) {
      const folRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(folSheet);
      let cumulative = 0;
      for (const row of folRows) {
        const dateStr = toDateStr(row['날짜'] ?? row['Date'] ?? row['date'] ?? Object.values(row)[0]);
        if (!dateStr) continue;
        const nf = Number(row['신규 팔로워'] ?? row['New followers'] ?? row['new_followers'] ?? Object.values(row)[1]) || 0;
        cumulative += nf;
        followers.push({ date: dateStr, new_followers: nf, cumulative });
      }
      followers.sort((a, b) => a.date.localeCompare(b.date));
    } else {
      // Generate placeholder followers from engagement dates
      engagement.forEach((e, i) => {
        followers.push({ date: e.date, new_followers: 0, cumulative: i });
      });
    }

    // Build posts (from engagement data, pick days with notable engagement)
    const posts: DashboardData['posts'] = engagement
      .filter(e => e.engagement > 0)
      .map(e => ({
        short_url: '',
        date: e.date,
        engagement: e.engagement,
        impressions: e.impressions,
        eng_rate: e.eng_rate,
        dayname: e.dayname,
      }))
      .sort((a, b) => b.engagement - a.engagement);

    // Build dayAvg
    const dayAvg: DashboardData['dayAvg'] = {};
    for (const dk of DAY_KEYS) {
      const dayData = engagement.filter(e => e.dayname === dk);
      if (dayData.length === 0) {
        dayAvg[dk] = { impressions: 0, eng_rate: 0 };
      } else {
        dayAvg[dk] = {
          impressions: dayData.reduce((s, d) => s + d.impressions, 0) / dayData.length,
          eng_rate: dayData.reduce((s, d) => s + d.eng_rate, 0) / dayData.length,
        };
      }
    }

    return {
      engagement,
      followers,
      posts,
      audience: [], // Not available from xlsx
      dayAvg,
    };
  } catch {
    return null;
  }
}
