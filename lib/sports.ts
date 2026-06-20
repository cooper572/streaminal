import { cache } from 'react';

const DEFAULT_SPORTS_API_URL = 'https://streamed.pk';

function getSportsBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SPORTS_API_URL || DEFAULT_SPORTS_API_URL).replace(/\/+$/, '');
}

export interface MatchTeam {
  name: string;
  badge: string;
}

export interface MatchSource {
  source: string;
  id: string;
}

export interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  poster?: string;
  popular: boolean;
  teams?: {
    home?: MatchTeam;
    away?: MatchTeam;
  };
  sources: MatchSource[];
}

export interface Stream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
}

async function fetchSports(endpoint: string) {
  const response = await fetch(`${getSportsBaseUrl()}${endpoint}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Sports API error: ${response.statusText}`);
  }
  return response.json();
}

export const getLiveMatches = cache(async (): Promise<Match[]> => {
  return fetchSports('/matches/live');
});

export async function getMatchStreams(source: string, id: string): Promise<Stream[]> {
  return fetchSports(`/stream/${source}/${id}`);
}

export function getBadgeUrl(id: string): string {
  return `${getSportsBaseUrl()}/images/badge/${id}.webp`;
}
