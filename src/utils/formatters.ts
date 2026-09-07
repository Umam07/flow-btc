/**
 * Parses raw date string into human-readable label format (e.g. "Sep 04")
 */
export function parseDateLabel(dateStr: string, rawDate?: string): string {
  if (rawDate && /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/.test(rawDate.trim())) {
    const parts = rawDate.trim().split(/\s+/);
    return `${parts[1]} ${parts[0].padStart(2, "0")}`;
  }
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const m = parseInt(parts[1], 10);
    return `${months[m - 1] || parts[1]} ${parts[2]}`;
  }
  return dateStr;
}

/**
 * Formats millions value to compact format (e.g. 24810M -> "24.81B")
 */
export function formatFlowValue(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 1000) {
    return (val / 1000).toFixed(2) + "B";
  }
  return val.toFixed(1) + "M";
}

/**
 * Formats a Date or ISO date string into Indonesian Western Time (WIB, UTC+7).
 * Example: "21:01 WIB"
 */
export function formatToWIB(dateInput?: string | Date | number | null): string {
  if (!dateInput) return "21:01 WIB";
  try {
    const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "21:01 WIB";
    const timeStr = d.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(".", ":");
    return `${timeStr} WIB`;
  } catch {
    return "21:01 WIB";
  }
}
