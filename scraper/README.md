# Bitcoin ETF Flow Scraper (Camoufox Stealth Browser)

Script scraper untuk mengambil data Bitcoin Spot ETF net flows dari [Farside Investors](https://farside.co.uk/btc/) menggunakan browser anti-deteksi **Camoufox** (C++ engine-level stealth Firefox).

---

## Fitur

1. **Bypass Anti-Bot / Cloudflare 403:**
   Situs Farside Investors memblokir HTTP request biasa (403 Forbidden). Camoufox menjalankan browser stealth headless untuk memuat halaman secara natural dan melewati proteksi.
2. **Ekstraksi Lengkap:**
   - 12 ETF Tickers: `IBIT`, `FBTC`, `BITB`, `ARKB`, `BTCO`, `EZBC`, `BRRR`, `HODL`, `BTCW`, `MSBT`, `GBTC`, `BTC` + Total.
   - Fee sponsor per fund (`0.25%`, dll).
   - Angka net flow harian (dalam jutaan USD / US$m), otomatis mem-parsing angka negatif format kurung `(201.9)` -> `-201.9` dan format ribuan `64,056`.
   - Ringkasan statistik agregat (`Total`, `Average`, `Maximum`, `Minimum`).
3. **Multi-Format Output:**
   - Menyimpan ke format `JSON` (metadata terstruktur, daily flows, flat records, fee mapping, summary stats).
   - Menyimpan ke format `CSV` tabular harian.
   - Otomatis menyalin data JSON ke `public/data/` agar langsung dapat dikonsumsi oleh aplikasi frontend Next.js.
4. **Dukungan Historical All-Data:**
   - Default: Scrape data terbaru dari `https://farside.co.uk/btc/` (~13 hari perdagangan terakhir).
   - Opsi `--all`: Scrape seluruh data historis dari awal peluncuran (Januari 2024 hingga sekarang, 680+ hari perdagangan) dari `https://farside.co.uk/bitcoin-etf-flow-all-data/`.

---

## Cara Menjalankan

### 1. Menjalankan Scrape Data Terbaru (Default)
```bash
python scraper/scrape_btc.py
```
Output disimpan ke:
- `scraper/data/btc_etf_flows.json`
- `scraper/data/btc_etf_flows.csv`
- `public/data/btc_etf_flows.json` (untuk Next.js)

### 2. Menjalankan Scrape Seluruh Data Historis (All Data)
```bash
python scraper/scrape_btc.py --all
```
Output disimpan ke:
- `scraper/data/btc_etf_flows_all.json`
- `scraper/data/btc_etf_flows_all.csv`
- `public/data/btc_etf_flows_all.json` (untuk Next.js)

### 3. Opsi Tambahan
- `--url <URL>`: Menentukan URL kustom target scraping.
- `--headful`: Menjalankan browser dengan window GUI terlihat (untuk visual debugging).
- `--no-copy-public`: Tidak menyalin hasil ke folder `public/data/`.
- `--output-dir <DIR>`: Menentukan folder output kustom.

---

## Struktur File

```
scraper/
├── scrape_btc.py          # Script utama scraping Camoufox
├── requirements.txt       # Dependensi Python (camoufox, lxml, playwright)
├── README.md              # Dokumentasi scraper
└── data/
    ├── btc_etf_flows.json     # Data scrape terbaru (JSON)
    ├── btc_etf_flows.csv      # Data scrape terbaru (CSV)
    ├── btc_etf_flows_all.json # Data scrape historis lengkap (JSON)
    └── btc_etf_flows_all.csv  # Data scrape historis lengkap (CSV)
```
