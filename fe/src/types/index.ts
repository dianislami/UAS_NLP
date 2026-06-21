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