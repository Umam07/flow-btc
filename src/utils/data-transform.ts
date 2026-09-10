import { FlowRecord, Issuer, ScrapedFlowJson } from "@/types/flow";
import { parseDateLabel } from "./formatters";

export function transformScrapedData(json: ScrapedFlowJson): { convertedFlows: FlowRecord[]; computedIssuers: Issuer[] } {
  if (!json?.daily_flows || !Array.isArray(json.daily_flows)) {
    return { convertedFlows: [], computedIssuers: [] };
  }

  // Daily flows from JSON is oldest to newest.
  // In the dashboard, flowData is ordered newest-first (flowData[0] = latest session)
  const convertedFlows: FlowRecord[] = json.daily_flows
    .slice()
    .reverse()
    .map((item) => {
      const f = item.flows || {};
      const ibit = f["IBIT"] ?? 0;
      const fbtc = f["FBTC"] ?? 0;
      const bitb = f["BITB"] ?? 0;
      const arkb = f["ARKB"] ?? 0;
      const gbtc = f["GBTC"] ?? 0;

      const others = Math.round(
        ((f["BTCO"] ?? 0) +
          (f["EZBC"] ?? 0) +
          (f["BRRR"] ?? 0) +
          (f["HODL"] ?? 0) +
          (f["BTCW"] ?? 0) +
          (f["MSBT"] ?? 0) +
          (f["BTC"] ?? 0)) *
          10
      ) / 10;

      const total = item.total ?? Math.round((ibit + fbtc + bitb + arkb + gbtc + others) * 10) / 10;

      // Determine primary driver fund for this session
      let topTicker = "IBIT";
      let topMagnitude = 0;
      let topValue = 0;

      Object.entries(f).forEach(([ticker, val]) => {
        const mag = Math.abs(val);
        if (mag > topMagnitude) {
          topMagnitude = mag;
          topTicker = ticker;
          topValue = val;
        }
      });

      const pct = total !== 0 ? Math.round((Math.abs(topValue) / Math.abs(total)) * 100) : 0;
      const badgeText =
        topValue >= 0
          ? `Led by ${topTicker} (+${topValue.toFixed(1)}M)`
          : `${topTicker} Drag (${topValue.toFixed(1)}M)`;

      return {
        date: item.date,
        label: parseDateLabel(item.date, item.raw_date),
        total,
        ibit,
        fbtc,
        bitb,
        arkb,
        gbtc,
        others,
        breakdown: f,
        marketDriver: {
          ticker: topTicker,
          name: topTicker,
          amount: topValue,
          pctOfTotal: Math.min(pct, 100),
          isPositive: topValue >= 0,
          badgeText,
        },
      };
    });

  const latestSessionFlows = json.daily_flows[json.daily_flows.length - 1]?.flows || {};
  const totalSummary = json.summary?.total || {};

  const majorTickers = ["IBIT", "FBTC", "ARKB", "BITB", "GBTC", "BTC", "HODL"];
  const computedIssuers: Issuer[] = majorTickers.map((ticker) => {
    const fundMeta = json.metadata?.funds?.[ticker] || { name: ticker, issuer: "Asset Manager" };
    const rawFee = json.fees?.[ticker] || "0.25%";
    const feeNum = parseFloat(rawFee.replace("%", "")) || 0.25;
    const totalInflow = totalSummary[ticker] ?? 0;
    const latest = latestSessionFlows[ticker] ?? 0;

    return {
      ticker,
      name: fundMeta.name,
      manager: fundMeta.issuer,
      fee: feeNum,
      totalInflow: Math.round(totalInflow * 10) / 10,
      latestSession: Math.round(latest * 10) / 10,
      highlight: ticker === "IBIT" ? "Market Leader (58%)" : undefined,
      isLeader: ticker === "IBIT",
      isNegative: totalInflow < 0,
    };
  });

  const otherTickers = ["BTCO", "EZBC", "BRRR", "BTCW", "MSBT"];
  const otherTotalInflow = otherTickers.reduce((acc, t) => acc + (totalSummary[t] ?? 0), 0);
  const otherLatestSession = otherTickers.reduce((acc, t) => acc + (latestSessionFlows[t] ?? 0), 0);
  computedIssuers.push({
    ticker: "OTHERS",
    name: "BTCO, EZBC, BRRR, MSBT...",
    manager: "Invesco, Franklin, Valkyrie, etc.",
    fee: 0.25,
    totalInflow: Math.round(otherTotalInflow * 10) / 10,
    latestSession: Math.round(otherLatestSession * 10) / 10,
    isNegative: otherTotalInflow < 0,
  });

  return { convertedFlows, computedIssuers };
}
