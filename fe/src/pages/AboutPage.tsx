const TEAM = [
  { name: 'Shaldi Shauqi', nim: '2308107010023' },
  { name: 'Dian Islami', nim: '2308107010048' },
  { name: 'M. Caesar Aidarus', nim: '2308107010072' },
];

const STEPS = [
  { icon: 'ti-article', title: 'Input Artikel', desc: 'Teks berita bencana dimasukkan ke sistem' },
  { icon: 'ti-cut', title: 'Sentence Tokenization', desc: 'Artikel dipecah menjadi kalimat-kalimat menggunakan NLTK' },
  { icon: 'ti-brain', title: 'IndoBERT Scoring', desc: 'Setiap kalimat diberi skor kepentingan (0–1) oleh model' },
  { icon: 'ti-filter', title: 'Threshold Filtering', desc: 'Kalimat dengan skor ≥ 0.5 dipilih sebagai kalimat penting' },
  { icon: 'ti-file-text', title: 'Ringkasan', desc: 'Kalimat terpilih digabung menjadi ringkasan ekstraktif' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ border: '1px solid var(--accent-border)', background: 'var(--accent-bg)' }}>
            <i className="ti ti-info-circle text-xs" style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>SINF6054 · Pemrosesan Bahasa Alami · Kelompok 09</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Tentang Proyek</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Implementasi Fine-Tuning IndoBERT untuk Peringkasan Ekstraktif Berita Bencana Berbahasa Indonesia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <div className="flex items-center gap-2 mb-4">
              <i className="ti ti-users" style={{ color: 'var(--text-muted)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Anggota Kelompok</h2>
            </div>
            <div className="flex flex-col gap-3">
              {TEAM.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.nim}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <div className="flex items-center gap-2 mb-4">
              <i className="ti ti-cpu" style={{ color: 'var(--text-muted)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Stack Teknologi</h2>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Model', value: 'IndoBERT-base fine-tuned', color: 'var(--accent)' },
                { label: 'Task', value: 'Extractive Summarization', color: '#f59e0b' },
                { label: 'Backend', value: 'FastAPI + PyTorch', color: '#60a5fa' },
                { label: 'Tokenizer', value: 'NLTK sent_tokenize', color: '#a78bfa' },
                { label: 'Frontend', value: 'React + TypeScript + Tailwind', color: '#34d399' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-xs font-medium" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="flex items-center gap-2 mb-5">
            <i className="ti ti-arrow-guide" style={{ color: 'var(--text-muted)' }} />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Pipeline Model</h2>
          </div>
          <div className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                    <i className={`ti ${step.icon} text-sm`} style={{ color: 'var(--accent)' }} />
                  </div>
                  {i < STEPS.length - 1 && <div className="w-px h-4 mt-1" style={{ background: 'var(--border-md)' }} />}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{step.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}