export interface SummarizeRequest {
  article: string;
}

export interface ImportantSentence {
  sentence: string;
  score: number;
}

export interface SummarizeResponse {
  summary: string;
  important_sentences: ImportantSentence[];
}

export interface ScrapedArticle {
  title: string;
  url: string;
  source: string;
  published_date: string;
  author: string;
  content: string;
}

export interface ScrapeSuccessResponse {
  success: true;
  data: ScrapedArticle;
}

export interface ScrapeErrorResponse {
  success: false;
  message: string;
}

export type ScrapeResponse = ScrapeSuccessResponse | ScrapeErrorResponse;
