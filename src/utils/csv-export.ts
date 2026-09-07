import { FlowRecord } from "@/types/flow";

export function exportFlowsToCSV(records: FlowRecord[]): void {
  let csv = "Date,Session_Label,Total_Net_Flow_USD_M,IBIT_M,FBTC_M,BITB_M,ARKB_M,GBTC_M,Others_M\n";
  records.forEach((r) => {
    csv += `${r.date},${r.label},${r.total},${r.ibit},${r.fbtc},${r.bitb},${r.arkb},${r.gbtc},${r.others}\n`;
  });

  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `btc_etf_flows_${records.length}_sessions.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
