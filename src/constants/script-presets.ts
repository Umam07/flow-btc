import { ScriptKey, ScriptPreset } from "@/types/flow";

export const scriptPresets: Record<ScriptKey, ScriptPreset> = {
  zscore: {
    file: "indicator_zscore.ts",
    metric: "14D Flow Z-Score",
    value: "+1.84 σ",
    signal: "Strong Institutional Demand",
    signalColor: "text-klarna-ink font-black",
    code: `// Calculating 14-day Rolling Z-Score for Flow Volatility
const window = 14;
const series = dataset.map(d => d.total);
const mean = series.reduce((a, b) => a + b, 0) / window;
const stdDev = Math.sqrt(series.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / window);
const currentZScore = (series[series.length - 1] - mean) / stdDev;
return { indicator: "14D Z-Score", value: currentZScore.toFixed(2), sentiment: currentZScore > 1 ? "Euphoric" : "Accumulating" };`,
  },
  rotation: {
    file: "indicator_rotation.ts",
    metric: "IBIT vs GBTC Rotation Ratio",
    value: "6.15x",
    signal: "Structural Rebalance to Low-Fee Issuers",
    signalColor: "text-klarna-success font-black",
    code: `// Calculating BlackRock (IBIT) Inflows vs Grayscale (GBTC) Outflows Ratio
const ibitRecent = dataset.slice(0, 7).reduce((acc, d) => acc + d.ibit, 0);
const gbtcRecent = Math.abs(dataset.slice(0, 7).reduce((acc, d) => acc + d.gbtc, 0));
const rotationRatio = (ibitRecent / (gbtcRecent || 1)).toFixed(2);
return { indicator: "Rotation Multiple", value: rotationRatio + "x", signal: "Capital flight to fee-advantaged trust" };`,
  },
  velocity: {
    file: "indicator_velocity.ts",
    metric: "Net Capital Acceleration",
    value: "+$142.3M / session",
    signal: "Momentum Expanding",
    signalColor: "text-klarna-success font-black",
    code: `// Velocity of Cumulative Flow (1st Derivative across 5 trading days)
const diffs = [];
for (let i = 0; i < 5; i++) {
  diffs.push(dataset[i].total - dataset[i + 1].total);
}
const avgVelocity = (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1);
return { indicator: "Velocity", value: (avgVelocity > 0 ? "+" : "") + "$" + avgVelocity + "M/session", momentum: "Positive" };`,
  },
};
