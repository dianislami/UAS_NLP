import InputPanel from '../components/InputPanel';
import ResultPanel from '../components/ResultPanel';
import type { SummarizeResponse } from '../types';

interface HomePageProps {
  text: string;
  setText: (t: string) => void;
  result: SummarizeResponse | null;
  isLoading: boolean;
  error: string | null;
  onAnalyze: (article: string) => void;
}

export default function HomePage({ text, setText, result, isLoading, error, onAnalyze }: HomePageProps) {
  return (
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ border: '1px solid var(--accent-border)', background: 'var(--accent-bg)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>IndoBERT Fine-Tuned · Extractive Summarization</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
            Ringkasan Berita Bencana
          </h1>
          <p className="mt-2 text-sm max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Model IndoBERT yang di-fine-tune untuk mengekstrak kalimat-kalimat penting dari artikel berita bencana berbahasa Indonesia secara otomatis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <InputPanel onAnalyze={onAnalyze} isLoading={isLoading} text={text} setText={setText} />
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Hasil Analisis</h2>
              {result && (
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                  Selesai
                </span>
              )}
              {error && (
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                  Error
                </span>
              )}
            </div>
            <ResultPanel result={result} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}