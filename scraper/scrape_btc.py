import argparse
import csv
import json
import os
import re
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from camoufox.sync_api import Camoufox
from lxml import html as lxml_html

# Fund metadata mapping (TICKER -> Issuer and Fund Name)
FUND_METADATA = {
    "IBIT": {"name": "iShares Bitcoin Trust", "issuer": "BlackRock"},
    "FBTC": {"name": "Wise Origin Bitcoin Trust", "issuer": "Fidelity"},
    "BITB": {"name": "Bitwise Bitcoin ETF", "issuer": "Bitwise"},
    "ARKB": {"name": "ARK 21Shares Bitcoin ETF", "issuer": "ARK / 21Shares"},
    "BTCO": {"name": "Invesco Galaxy Bitcoin ETF", "issuer": "Invesco"},
    "EZBC": {"name": "Franklin Bitcoin ETF", "issuer": "Franklin Templeton"},
    "BRRR": {"name": "Valkyrie Bitcoin Fund", "issuer": "CoinShares / Valkyrie"},
    "HODL": {"name": "VanEck Bitcoin Trust", "issuer": "VanEck"},
    "BTCW": {"name": "WisdomTree Bitcoin Fund", "issuer": "WisdomTree"},
    "MSBT": {"name": "Grayscale Bitcoin Mini Trust", "issuer": "Grayscale"},
    "GBTC": {"name": "Grayscale Bitcoin Trust", "issuer": "Grayscale"},
    "BTC": {"name": "Grayscale Bitcoin Mini Trust / Others", "issuer": "Grayscale"},
}

FARSIDE_BTC_URL = "https://farside.co.uk/btc/"
FARSIDE_ALL_URL = "https://farside.co.uk/bitcoin-etf-flow-all-data/"


def parse_numeric(val: str) -> Optional[float]:
    """Parse numeric values from Farside table:
    handles:
      - '284.7' -> 284.7
      - '(201.9)' -> -201.9
      - '64,056' -> 64056.0
      - '-' or '' or '0.0' -> 0.0
    """
    if not val:
        return 0.0
    val = val.strip().replace(",", "")
    if val in ("-", "", "–", "—", "N/A", "n/a"):
        return 0.0

    # Negative numbers represented in parentheses, e.g. (201.9)
    if val.startswith("(") and val.endswith(")"):
        inner = val[1:-1].strip()
        try:
            return -float(inner)
        except ValueError:
            return None

    try:
        return float(val)
    except ValueError:
        return None


def parse_date_to_iso(date_str: str) -> Optional[str]:
    """Parse dates like '19 Aug 2026' or '11 Jan 2024' into 'YYYY-MM-DD'."""
    clean_date = re.sub(r"\s+", " ", date_str.strip())
    # Try multiple common formats
    formats = ["%d %b %Y", "%d %B %Y", "%Y-%m-%d", "%m/%d/%Y"]
    for fmt in formats:
        try:
            dt = datetime.strptime(clean_date, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def scrape_farside_btc(target_url: str = FARSIDE_BTC_URL, headless: bool = True) -> Dict[str, Any]:
    """Scrape Bitcoin ETF flows table from farside using Camoufox stealth browser."""
    print(f"[+] Launching Camoufox stealth browser (headless={headless})...")
    
    with Camoufox(headless=headless) as browser:
        page = browser.new_page()
        print(f"[+] Navigating to: {target_url}")
        page.goto(target_url, timeout=60000, wait_until="domcontentloaded")
        
        # Wait a moment to ensure table DOM is settled
        page.wait_for_timeout(2000)
        content = page.content()
        title = page.title()
        print(f"[+] Page loaded successfully! Title: {title}")

    # Parse HTML using lxml
    tree = lxml_html.fromstring(content)
    tables = tree.xpath("//table")
    if not tables:
        raise RuntimeError("No <table> elements found on page.")

    # Find the main data table (the one containing ETF tickers like IBIT, FBTC)
    target_table = None
    for t in tables:
        text = t.text_content()
        if "IBIT" in text and "FBTC" in text:
            target_table = t
            break

    if target_table is None:
        target_table = tables[0]

    rows = target_table.xpath(".//tr")
    print(f"[+] Found ETF data table with {len(rows)} rows.")

    tickers: List[str] = []
    fees: Dict[str, str] = {}
    daily_flows: List[Dict[str, Any]] = []
    summary_stats: Dict[str, Dict[str, Optional[float]]] = {}

    ticker_row_idx = -1
    for idx, r in enumerate(rows):
        cells = [c.text_content().strip() for c in r.xpath("./th|./td")]
        if any("IBIT" in c for c in cells):
            ticker_row_idx = idx
            # Extract ticker headers (skip initial empty column if date column)
            for c in cells:
                t = c.strip()
                if t and t not in ("Date", "Total", "Fee"):
                    tickers.append(t)
            break

    print(f"[+] Identified {len(tickers)} ETF tickers: {', '.join(tickers)}")

    # Iterate remaining rows
    for r in rows[ticker_row_idx + 1:]:
        cells = [c.text_content().strip() for c in r.xpath("./th|./td")]
        if not cells or all(c == "" for c in cells):
            continue

        label = cells[0].strip()

        # Check if this is the Fee row
        if label.lower() == "fee":
            for i, ticker in enumerate(tickers):
                cell_idx = i + 1
                if cell_idx < len(cells):
                    fees[ticker] = cells[cell_idx]
            continue

        # Check if this is a summary row (Total, Average, Maximum, Minimum)
        if label.lower() in ("total", "average", "maximum", "minimum"):
            stat_name = label.lower()
            summary_stats[stat_name] = {}
            for i, ticker in enumerate(tickers):
                cell_idx = i + 1
                if cell_idx < len(cells):
                    summary_stats[stat_name][ticker] = parse_numeric(cells[cell_idx])
            # Total column for summary
            total_idx = len(tickers) + 1
            if total_idx < len(cells):
                summary_stats[stat_name]["total"] = parse_numeric(cells[total_idx])
            continue

        # Otherwise, check if this is a date row
        iso_date = parse_date_to_iso(label)
        if iso_date:
            flows: Dict[str, float] = {}
            for i, ticker in enumerate(tickers):
                cell_idx = i + 1
                if cell_idx < len(cells):
                    val = parse_numeric(cells[cell_idx])
                    flows[ticker] = val if val is not None else 0.0
                else:
                    flows[ticker] = 0.0

            # Total column (usually last column or right after tickers)
            total_val = None
            total_idx = len(tickers) + 1
            if total_idx < len(cells):
                total_val = parse_numeric(cells[total_idx])
            if total_val is None:
                total_val = round(sum(flows.values()), 1)

            daily_flows.append({
                "date": iso_date,
                "raw_date": label,
                "total": total_val,
                "flows": flows
            })

    # Sort daily flows chronologically (oldest to newest)
    daily_flows.sort(key=lambda x: x["date"])

    # Build flat records for relational / database / chart series consumption
    flat_records = []
    for d in daily_flows:
        for ticker, flow in d["flows"].items():
            flat_records.append({
                "date": d["date"],
                "ticker": ticker,
                "flow_usd_millions": flow,
                "fund_name": FUND_METADATA.get(ticker, {}).get("name", ticker),
                "issuer": FUND_METADATA.get(ticker, {}).get("issuer", "Unknown")
            })

    result = {
        "metadata": {
            "source_url": target_url,
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "currency": "USD (millions)",
            "total_days": len(daily_flows),
            "date_range": {
                "start": daily_flows[0]["date"] if daily_flows else None,
                "end": daily_flows[-1]["date"] if daily_flows else None,
            },
            "tickers": tickers,
            "funds": {
                t: FUND_METADATA.get(t, {"name": t, "issuer": "Unknown"})
                for t in tickers
            },
        },
        "fees": fees,
        "summary": summary_stats,
        "daily_flows": daily_flows,
        "flat_records": flat_records,
    }

    return result


def save_results(data: Dict[str, Any], output_dir: str, filename_prefix: str = "btc_etf_flows", copy_to_public: bool = True):
    """Save scraped data to JSON and CSV formats."""
    os.makedirs(output_dir, exist_ok=True)
    json_name = f"{filename_prefix}.json"
    csv_name = f"{filename_prefix}.csv"
    json_path = os.path.join(output_dir, json_name)
    csv_path = os.path.join(output_dir, csv_name)

    # 1. Save JSON
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"[+] JSON saved to: {json_path}")

    # 2. Save CSV (Daily table format)
    tickers = data["metadata"]["tickers"]
    fieldnames = ["date", "raw_date", "total"] + tickers
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in data["daily_flows"]:
            flat_row = {
                "date": row["date"],
                "raw_date": row["raw_date"],
                "total": row["total"],
            }
            flat_row.update(row["flows"])
            writer.writerow(flat_row)
    print(f"[+] CSV saved to: {csv_path}")

    # 3. Optionally copy JSON to Next.js public directory for immediate frontend use
    if copy_to_public:
        # Resolve project root: directory containing the 'scraper' folder
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        public_dir = os.path.join(project_root, "public", "data")
        os.makedirs(public_dir, exist_ok=True)
        public_json = os.path.join(public_dir, json_name)
        with open(public_json, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"[+] Copied to Next.js public dir: {public_json}")


def main():
    parser = argparse.ArgumentParser(description="Scrape Bitcoin ETF flows data from Farside Investors using Camoufox.")
    parser.add_argument(
        "--all",
        action="store_true",
        help="Scrape all historical data from /bitcoin-etf-flow-all-data/ instead of recent /btc/",
    )
    parser.add_argument(
        "--url",
        type=str,
        default=None,
        help="Custom URL to scrape (default: https://farside.co.uk/btc/)",
    )
    parser.add_argument(
        "--headful",
        action="store_true",
        help="Run browser in headful mode (visible window)",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "data"),
        help="Directory to save output files (default: scraper/data)",
    )
    parser.add_argument(
        "--no-copy-public",
        action="store_true",
        help="Do not copy scraped JSON to public/data/",
    )

    args = parser.parse_args()

    target_url = args.url
    prefix = "btc_etf_flows_all" if args.all else "btc_etf_flows"
    if not target_url:
        target_url = FARSIDE_ALL_URL if args.all else FARSIDE_BTC_URL

    try:
        data = scrape_farside_btc(target_url=target_url, headless=not args.headful)
        save_results(
            data=data,
            output_dir=args.output_dir,
            filename_prefix=prefix,
            copy_to_public=not args.no_copy_public,
        )
        print(f"\n[OK] Successfully scraped {data['metadata']['total_days']} days of Bitcoin ETF flows!")
        print(f"[OK] Date range: {data['metadata']['date_range']['start']} -> {data['metadata']['date_range']['end']}")
    except Exception as e:
        print(f"[ERROR] Scraping failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
