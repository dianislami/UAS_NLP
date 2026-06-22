import { useState } from 'react';
import { scrapeArticle } from '../utils/api';

const SAMPLE_TEXT = `Jakarta (ANTARA) - Badan Nasional Penanggulangan Bencana (BNPB) menyatakan sedikitnya 58 unit rumah hunian sementara (huntara) yang dihuni oleh para penyintas banjir bandang di Kabupaten Aceh Utara, Provinsi Aceh, rusak akibat diterjang angin kencang. Angin kencang yang melanda wilayah tersebut berdampak pada 58 kepala keluarga serta mengakibatkan kerusakan pada 58 unit rumah hunian sementara yang masih dalam proses pendataan. Kompleks bangunan huntara yang porak-poranda diterpa angin kencang tersebut pada dasarnya diperuntukkan bagi warga penyintas bencana banjir bandang dan tanah longsor. Dia menjelaskan bahwa peristiwa tersebut terjadi di tengah masa transisi darurat ke pemulihan pascabencana. Direktorat Pusat Pengendalian Operasi (Pusdalops) BNPB melaporkan dampak paling parah terkonsentrasi di Desa Rumoh Rayeuk. Kerusakan juga meluas ke beberapa desa lain. Tim BNPB dan BPBD sudah diterjunkan ke lokasi untuk melakukan asesmen dan koordinasi penanganan.`;

interface InputPanelProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  text: string;
  setText: (t: string) => void;
}

export default function InputPanel({ onAnalyze, isLoading, text, setText }: InputPanelProps) {
  const [hovered, setHovered] = useState(false);
  const [articleUrl, setArticleUrl] = useState('');
  const [scrapedTitle, setScrapedTitle] = useState('');
  const [scrapedSource, setScrapedSource] = useState('');
  const [scrapeError, setScrapeError] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const isDisabled = !text.trim() || isLoading || isScraping;
  const isScrapeDisabled = !articleUrl.trim() || isLoading || isScraping;

  async function handleScrape() {
    const url = articleUrl.trim();
    if (!url) {
      setScrapeError('Masukkan link artikel berita terlebih dahulu.');
      return;
    }

    setIsScraping(true);
    setScrapeError('');
    setScrapedTitle('');
    setScrapedSource('');
    try {
      const response = await scrapeArticle(url);
      if (!response.success) {
        setScrapeError(response.message);
        return;
      }
      setText(response.data.content);
      setScrapedTitle(response.data.title);
      setScrapedSource(response.data.source);
    } catch (error) {
      setScrapeError(error instanceof Error ? error.message : 'Artikel gagal diambil.');
    } finally {
      setIsScraping(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Artikel Berita</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Tempel teks berita bencana berbahasa Indonesia</p>
        </div>
        <button
          onClick={() => setText(SAMPLE_TEXT)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all"
          style={{ border: '1px solid var(--border-md)', color: 'var(--text-secondary)' }}
        >
          <i className="ti ti-sparkles text-[11px]" />
          Contoh teks
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Masukkan link artikel berita
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.target.value)}
            placeholder="https://regional.kompas.com/read/... atau https://www.liputan6.com/... atau https://news.detik.com/..."
            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-all"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-md)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={handleScrape}
            disabled={isScrapeDisabled}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium active:scale-95 whitespace-nowrap"
            style={{
              transition: 'background 0.15s, transform 0.1s, opacity 0.15s',
              cursor: isScrapeDisabled ? 'not-allowed' : 'pointer',
              ...(isScrapeDisabled
                ? { background: 'var(--border)', color: 'var(--text-faint)' }
                : { background: 'var(--accent)', color: 'var(--accent-text)' }),
            }}
          >
            {isScraping ? (
              <>
                <i className="ti ti-loader-2 animate-spin text-sm" />
                Mengambil...
              </>
            ) : (
              <>
                <i className="ti ti-download text-sm" />
                Ambil Artikel
              </>
            )}
          </button>
        </div>
        {scrapedTitle && (
          <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <i className="ti ti-check text-sm mt-0.5" style={{ color: 'var(--accent)' }} />
            <span>
              {scrapedTitle}
              {scrapedSource ? (
                <span style={{ color: 'var(--text-muted)' }}> · {scrapedSource}</span>
              ) : null}
            </span>
          </div>
        )}
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
          Mendukung artikel dari Kompas, Liputan6, dan Detik.
        </p>
        {scrapeError && (
          <div className="flex items-start gap-2 text-xs" style={{ color: '#ef4444' }}>
            <i className="ti ti-alert-circle text-sm mt-0.5" />
            <span>{scrapeError}</span>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Masukkan teks artikel berita bencana di sini..."
          rows={12}
          className="w-full rounded-xl px-4 py-3.5 text-sm leading-relaxed resize-none focus:outline-none transition-all"
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-md)',
            color: 'var(--text-primary)',
          }}
        />
        {text && (
          <button
            onClick={() => setText('')}
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <i className="ti ti-x text-xs" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
          {text.length} karakter · {text.trim() ? text.trim().split(/\s+/).length : 0} kata
        </span>
        <button
          onClick={() => onAnalyze(text)}
          disabled={isDisabled}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium active:scale-95"
          style={{
            transition: 'background 0.15s, transform 0.1s, opacity 0.15s',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            ...(isDisabled
              ? { background: 'var(--border)', color: 'var(--text-faint)' }
              : hovered
              ? { background: 'var(--accent-hover)', color: 'var(--accent-text)', opacity: 0.92 }
              : { background: 'var(--accent)', color: 'var(--accent-text)' }),
          }}
        >
          {isLoading ? (
            <>
              <i className="ti ti-loader-2 animate-spin text-sm" />
              Memproses...
            </>
          ) : (
            <>
              <i className="ti ti-file-text text-sm" />
              Ringkas Artikel
            </>
          )}
        </button>
      </div>

      <div
        className="rounded-xl p-3.5"
        style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <i className="ti ti-info-circle text-xs" style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Cara kerja model</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-faint)' }}>
          IndoBERT membaca setiap kalimat dan memberikan skor kepentingan (0-1). Kalimat dengan skor ≥ 0.8 dipilih sebagai ringkasan ekstraktif.
        </p>
      </div>
    </div>
  );
}
