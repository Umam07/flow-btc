# Bitcoin ETF Flow Dashboard (Next.js + Tailwind CSS)

A responsive, institutional-grade market intelligence dashboard tracking US Spot Bitcoin ETF net capital flows, cumulative trajectories, issuer breakdowns, and historical daily ledger records.

Built with **Next.js (App Router)**, **Tailwind CSS v4**, **TypeScript**, and **Chart.js**.

---

## ⚡ Features

- **Live Flow Metrics & Horizon Filters**: Real-time computed net inflow/outflow, prior window comparisons, and dominant fund share for 7D, 30D, 90D, YTD, and All-Time horizons.
- **Interactive Chart Terminal**:
  - Daily Net Flows with positive (Ink) and negative (Semantic Red) bars.
  - 7-Day Moving Average trend line.
  - Cumulative Net Flow Trajectory with gradient area fill.
  - Multi-fund stacked distribution (IBIT, FBTC, BITB, ARKB, GBTC).
- **Issuers Directory**: Card-level breakdown of all 11 Spot Bitcoin ETF trusts with live fees, latest session volumes, and multi-criteria sorting (inflow, fee, ticker).
- **Granular Historical Ledger**:
  - Date filtering and directional filtering (Inflows vs. Outflows).
  - Clean empty state with filter reset.
  - One-click CSV export of full or filtered datasets.
- **Indicator Studio (Lab)**: Sandboxed custom algorithm preview running rolling Z-score, rotation ratios, and capital acceleration indicators.
- **Data Pipeline Spec**: Node.js / Cheerio scraper architecture with PostgreSQL idempotency for `farside.co.uk` data ingestion.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Visuals & Charts**: [Chart.js 4](https://www.chartjs.org)
- **Typography**: Plus Jakarta Sans & JetBrains Mono
- **Language**: TypeScript

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Umam07/flow-btc.git
cd flow-btc
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
npm run build
npm run start
```

---

## 📄 License

MIT License. Designed for informational and portfolio demonstration purposes. Not financial advice.
