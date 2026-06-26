// Live sports — thin client for the public streamed.pk API.
// Docs: https://streamed.pk
// We normalize image URLs to flow through our own proxy so they load
// without referrer/CORS surprises.

export interface SportsTeam { name: string; badge?: string }
export interface SportsSource { source: string; id: string }
export interface SportsMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  poster?: string;
  popular?: boolean;
  teams?: { home?: SportsTeam; away?: SportsTeam };
  sources: SportsSource[];
}
export interface SportsStream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
  viewers?: number;
}

const API = "https://streamed.pk";

export function sportsImage(path?: string): string | undefined {
  if (!path) return undefined;
  const url = path.startsWith("http") ? path : `${API}${path}`;
  return url;
}

export function badgeImage(hash?: string): string | undefined {
  if (!hash) return undefined;
  return `${API}/api/images/badge/${hash}.webp`;
}

async function getJson<T>(path: string): Promise<T> {
  const r = await fetch(`${API}${path}`, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(`sports api ${r.status}`);
  return (await r.json()) as T;
}

export const fetchLiveMatches = () => getJson<SportsMatch[]>("/api/matches/live");
export const fetchPopularLive = () => getJson<SportsMatch[]>("/api/matches/live/popular");
export const fetchTodayMatches = () => getJson<SportsMatch[]>("/api/matches/all-today");
export const fetchStreams = (source: string, id: string) =>
  getJson<SportsStream[]>(`/api/stream/${encodeURIComponent(source)}/${encodeURIComponent(id)}`);

export const SPORT_ICONS: Record<string, string> = {
  football: "⚽",
  "american-football": "🏈",
  basketball: "🏀",
  baseball: "⚾",
  hockey: "🏒",
  tennis: "🎾",
  rugby: "🏉",
  golf: "⛳",
  "motor-sports": "🏎️",
  fight: "🥊",
  cricket: "🏏",
  billiards: "🎱",
  darts: "🎯",
  other: "🏅",
};
