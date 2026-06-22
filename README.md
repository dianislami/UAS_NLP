# 🌊 DisasterNER - Ringkasan Berita Bencana Berbahasa Indonesia

Proyek akhir mata kuliah **SINF6054 - Pemrosesan Bahasa Alami** · Kelompok 09

Model IndoBERT yang di-*fine-tune* untuk mengekstrak kalimat-kalimat penting dari artikel berita bencana berbahasa Indonesia secara otomatis (*extractive summarization*).

---

## Anggota Kelompok

| No | Nama | NIM |
|----|------|-----|
| 1 | Shaldi Shauqi | 2308107010023 |
| 2 | Dian Islami | 2308107010048 |
| 3 | M. Caesar Aidarus | 2308107010072 |

---

## Struktur Repository

```
UAS_NLP/
├── fe/                             # Frontend: React + TypeScript + Tailwind CSS
│   ├── node_modules/               # Dependency frontend (auto-generated)
│   ├── public/                     # Static public files
│   │   └── index.html              # Root HTML file
│   │
│   ├── src/
│   │   ├── assets/                 # Static assets (icons, images, svg)
│   │   │
│   │   ├── components/             # Reusable UI components
│   │   │   ├── InputPanel.tsx       # Input text panel (user input)
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   └── ResultPanel.tsx      # Output / summarization result
│   │   │
│   │   ├── context/                # Global state management
│   │   │   └── ThemeContext.tsx     # Theme (dark / light mode)
│   │   │
│   │   ├── pages/                  # Application pages
│   │   │   ├── AboutPage.tsx        # About application page
│   │   │   └── HomePage.tsx         # Main summarization page
│   │   │
│   │   ├── types/                  # TypeScript types & interfaces
│   │   │   └── index.ts             # Shared type definitions
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   └── api.ts               # API request handler (FastAPI backend)
│   │   │
│   │   ├── App.tsx                 # Main React component
│   │   ├── App.css                 # Global app styling
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Tailwind base styles
│   │
│   ├── .gitignore                  # Git ignore rules (frontend)
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # Vite HTML entry
│   ├── package.json                # Frontend dependencies & scripts
│   ├── package-lock.json           # Locked dependency versions
│   ├── postcss.config.js           # PostCSS configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── tsconfig.app.json            # App-specific TS config
│   ├── tsconfig.node.json           # Node-specific TS config
│   ├── vite.config.ts               # Vite configuration
│   └── README.md                   # Frontend documentation
│
├── be/                             # Backend: FastAPI + IndoBERT
│   ├── __pycache__/                # Python cache (auto-generated)
│   │
│   ├── indobert_disaster_summarizer/
│   │   ├── config.json             # Model configuration
│   │   ├── model.safetensors       # IndoBERT trained weights
│   │   ├── tokenizer_config.json   # Tokenizer settings
│   │   ├── tokenizer.json          # Tokenizer vocab
│   │   └── training_args.bin       # Training arguments
│   │
│   ├── app.py                      # FastAPI app entry point
│   ├── predict.py                  # Summarization inference logic
│   ├── scrapers/                   # Scraper artikel berita
│   │   ├── base.py                 # Base parser reusable
│   │   ├── detik.py                # Scraper Detik.com
│   │   ├── kompas.py               # Scraper Kompas.com
│   │   ├── liputan6.py             # Scraper Liputan6.com
│   │   └── router.py               # Pemilih scraper berdasarkan domain
│   ├── utils/                      # Helper HTTP, filter domain, teks
│   ├── sample_input_output.json    # Example input-output testing
│   ├── requirements.txt            # Python dependencies
│   ├── README.md                   # Backend documentation
│   └── .gitignore                  # Git ignore rules (backend)
│
├── .gitignore                      # Root git ignore
└── README.md                       # Main project documentation
```

---

## Tentang Proyek

Sistem ini menggunakan pendekatan **extractive summarization** berbasis transformer:

1. **Input**: teks artikel berita bencana dimasukkan pengguna, atau artikel diambil dari link Kompas, Liputan6, dan Detik
2. **Sentence Tokenization**: artikel dipecah menjadi kalimat menggunakan NLTK
3. **IndoBERT Scoring**: setiap kalimat diberi skor kepentingan (0–1) oleh model
4. **Threshold Filtering**: kalimat dengan skor ≥ 0.8 dipilih sebagai kalimat penting
5. **Output**: kalimat terpilih digabung menjadi ringkasan terstruktur

**Model:** IndoBERT-base yang di-fine-tune pada dataset berita bencana Indonesia
**Task:** Binary sentence classification (penting / tidak penting)
**Metrik evaluasi:** Precision, Recall, F1-Score

---

## Cara Menjalankan

### Prasyarat

- Python 3.9+
- Node.js 18+
- npm

### 1. Clone Repository

```bash
git clone https://github.com/dianislami/UAS_NLP.git
cd UAS_NLP
```

### 2. Download Model

File `model.safetensors` tidak disertakan di repo karena ukurannya besar. Download dan letakkan di:

```
be/indobert_disaster_summarizer/model.safetensors
be/indobert_disaster_summarizer/training_args.bin
```

> Hubungi anggota kelompok untuk mendapatkan link download model.

### 3. Jalankan Backend

```bash
cd be

# Buat virtual environment (opsional tapi disarankan)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependency
pip install -r requirements.txt

# Jalankan server
python -m uvicorn app:app --reload
```

Backend berjalan di: `http://127.0.0.1:8000`
Dokumentasi API: `http://127.0.0.1:8000/docs`

### 4. Jalankan Frontend

Buka terminal baru:

```bash
cd fe

# Install dependency
npm install

# Jalankan dev server
npm run dev
```

Frontend berjalan di: `http://localhost:5173`

### 5. Menggunakan Input Link Berita

Pada halaman utama, pengguna dapat:

1. Mengisi field **Masukkan link artikel berita** dengan URL artikel Kompas, Liputan6, atau Detik.
2. Klik **Ambil Artikel**.
3. Konten artikel akan otomatis masuk ke textarea artikel berita.
4. Klik **Ringkas Artikel** untuk menjalankan summarization seperti biasa.

Domain yang didukung saat ini:

- `www.kompas.com`
- `regional.kompas.com`
- `nasional.kompas.com`
- `megapolitan.kompas.com`
- `surabaya.kompas.com`
- `bandung.kompas.com`
- `medan.kompas.com`
- `makassar.kompas.com`
- `lestari.kompas.com`
- `www.liputan6.com`
- `m.liputan6.com`
- `www.detik.com`
- `detik.com`
- `news.detik.com`

---

## API Endpoint

### `POST /scrape`

Menerima URL artikel Kompas, Liputan6, atau Detik dan mengembalikan metadata serta isi artikel.

**Request:**
```json
{
  "url": "https://regional.kompas.com/read/..."
}
```

**Response sukses:**
```json
{
  "success": true,
  "data": {
    "title": "Judul artikel",
    "url": "https://regional.kompas.com/read/...",
    "source": "Kompas.com",
    "published_date": "2026-06-21T10:00:00+07:00",
    "author": "Nama penulis",
    "content": "Isi artikel..."
  }
}
```

**Response gagal jika domain belum didukung:**
```json
{
  "success": false,
  "message": "Saat ini hanya mendukung Kompas, Liputan6, dan Detik."
}
```

### `POST /summarize`

Menerima teks artikel dan mengembalikan ringkasan beserta skor tiap kalimat.

**Request:**
```json
{
  "article": "Teks berita bencana di sini..."
}
```

**Response:**
```json
{
  "summary": "Ringkasan hasil ekstraksi.",
  "important_sentences": [
    {
      "sentence": "Kalimat penting pertama.",
      "score": 0.9421
    }
  ]
}
```

---

## Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| Model | IndoBERT-base (fine-tuned) |
| Framework ML | HuggingFace Transformers + PyTorch |
| Tokenizer | NLTK `sent_tokenize` |
| Backend | FastAPI + Uvicorn |
| Frontend | React + TypeScript + Tailwind CSS v4 |
| Font | DM Sans + Space Grotesk |

---
