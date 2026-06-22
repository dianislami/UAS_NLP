import type { SummarizeResponse } from '../types';

interface ResultPanelProps {
  result: SummarizeResponse | null;
  isLoading: boolean;
  error: string | null;
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 85 ? 'var(--accent)' : pct >= 70 ? '#f59e0b' : '#60a5fa';
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--score-bg)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold shrink-0" style={{ color }}>{pct}%</span>
    </div>
  );
}

export default function ResultPanel({ result, isLoading, error }: ResultPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-border)', borderTopColor: 'var(--accent)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Model sedang menganalisis...</p>
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>IndoBERT membaca setiap kalimat</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3 text-center px-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <i className="ti ti-wifi-off text-xl" style={{ color: '#ef4444' }} />
        </div>
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Gagal terhubung ke backend</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Pastikan backend sudah berjalan di<br />
            <code style={{ color: 'var(--accent)' }}>http://127.0.0.1:8000</code>
          </p>
        </div>
        <p className="text-xs mt-1" style={{ color: 'rgba(239,68,68,0.5)' }}>{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3 text-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--border)', border: '1px solid var(--border-md)' }}>
          <i className="ti ti-file-text text-xl" style={{ color: 'var(--text-faint)' }} />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Belum ada hasil</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Masukkan teks lalu klik Ringkas Artikel</p>
        </div>
      </div>
    );
  }

  const total = result.important_sentences.length;
  const avgScore = total > 0
    ? (result.important_sentences.reduce((s, r) => s + r.score, 0) / total * 100).toFixed(1)
    : '0';

  return (
    <div className="flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Kalimat Penting', value: total, icon: 'ti-check' },
          { label: 'Rata-rata Skor', value: `${avgScore}%`, icon: 'ti-chart-line' },
          { label: 'Threshold', value: '≥ 80%', icon: 'ti-adjustments' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <i className={`ti ${s.icon} text-xs`} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
            <p className="font-semibold text-lg leading-none" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <i className="ti ti-sparkles text-xs" style={{ color: 'var(--accent)' }} />
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Ringkasan</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'var(--bg-input)', border: '1px solid var(--accent-border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{result.summary}</p>
        </div>
      </div>

      {/* Important sentences */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <i className="ti ti-list-check text-xs" style={{ color: 'var(--text-muted)' }} />
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Kalimat Penting</p>
        </div>
        <div className="flex flex-col gap-2.5">
          {result.important_sentences.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-3.5 transition-colors"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--border-md)' }}>
                  <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{item.sentence}</p>
                  <ScoreBar score={item.score} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <i className="ti ti-cpu text-xs" style={{ color: 'var(--text-faint)' }} />
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>indobert-disaster-summarizer · extractive summarization</span>
      </div>
    </div>
  );
}
