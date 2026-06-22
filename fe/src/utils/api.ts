import type { ScrapeResponse, SummarizeRequest, SummarizeResponse } from '../types';

const BASE_URL = 'http://127.0.0.1:8000';

export async function summarizeArticle(article: string): Promise<SummarizeResponse> {
  const body: SummarizeRequest = { article };

  const res = await fetch(`${BASE_URL}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Backend error ${res.status}: ${err}`);
  }

  return res.json() as Promise<SummarizeResponse>;
}

export async function scrapeArticle(url: string): Promise<ScrapeResponse> {
  const res = await fetch(`${BASE_URL}/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Backend error ${res.status}: ${err}`);
  }

  return res.json() as Promise<ScrapeResponse>;
}
