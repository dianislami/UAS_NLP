# Struktur dan Panduan Project

### `indobert_disaster_summarizer/`
Folder yang berisi model hasil training. Isi folder ini digunakan oleh backend untuk melakukan prediksi.

**File penting:**
* **`model.safetensors`**: Berisi bobot (*weights*) model hasil *fine-tuning*.
* **`config.json`**: Berisi konfigurasi arsitektur model.
* **`tokenizer.json`** & **`tokenizer_config.json`**: Digunakan untuk mengubah teks menjadi token yang dapat dipahami oleh model.

---

### `app.py`
Backend API menggunakan FastAPI.

**File ini:**
* Memuat model IndoBERT
* Menerima request dari frontend
* Menjalankan proses prediksi
* Mengirim hasil ringkasan dalam format JSON

**Menjalankan server:**
```bash
uvicorn app:app --reload
```

* **Setelah berjalan:** http://127.0.0.1:8000
* **Dokumentasi API:** http://127.0.0.1:8000/docs
* **Endpoint utama:** `POST /summarize`

---

### `predict.py`
Berisi fungsi inferensi model.

**Tugas file ini:**
* Menerima artikel
* Memecah artikel menjadi kalimat
* Menghitung skor kepentingan setiap kalimat
* Memilih kalimat penting
* Membentuk ringkasan

*File ini dipanggil oleh `app.py`.*

---

### `requirements.txt`
Daftar library Python yang dibutuhkan project.

**Install seluruh dependency:**
```bash
pip install -r requirements.txt
```

**Library yang digunakan:**
* `torch`
* `transformers`
* `fastapi`
* `uvicorn`
* `numpy`
* `nltk`

---

### `sample_input_output.json`
Contoh format request dan response API. Digunakan sebagai referensi untuk frontend agar mengetahui format data yang harus dikirim dan diterima.

---

## Menjalankan Project

1. **Install Dependency**
   ```bash
   pip install -r requirements.txt
   ```
2. **Jalankan Backend**
   ```bash
   uvicorn app:app --reload
   ```
3. **Buka Dokumentasi API**
   * Buka: http://127.0.0.1:8000/docs
   * Di halaman tersebut endpoint dapat dicoba langsung tanpa membuat frontend terlebih dahulu.