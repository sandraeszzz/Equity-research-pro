import React from "react";
import { EquityReport } from "../data/types";
import { Globe, AlertTriangle, Layers, BarChart2, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

interface CompetitorsTabProps {
  report: EquityReport;
}

export default function CompetitorsTab({ report }: CompetitorsTabProps) {
  const { competitors, macroGeopolitics, summary, growthMargins, capitalReturns, liquiditySolvency } = report;

  // Extract company margin and ROIC for comparison chart
  const getCleanNumber = (valStr: string) => {
    return parseFloat(valStr.replace(/[^0-9.-]/g, "")) || 0;
  };

  const companyOpMargin = getCleanNumber(growthMargins.find(g => g.metric.toLowerCase().includes("operating margin"))?.value || "25");
  const companyRoic = getCleanNumber(capitalReturns.find(c => c.metric.toLowerCase().includes("roic"))?.value || "20");

  // Format dataset for Recharts comparison
  const chartData = [
    {
      name: summary.ticker,
      "Margen Operativo %": companyOpMargin,
      "ROIC %": companyRoic,
    },
    ...competitors.map(c => ({
      name: c.ticker,
      "Margen Operativo %": getCleanNumber(c.operatingMargin),
      "ROIC %": getCleanNumber(c.roic),
    }))
  ];

  return (
    <div className="space-y-6" id="competitors-tab-pane">
      {/* 6. MATRIZ COMPETITIVA DE COMPATIBILIDAD */}
      <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2533] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <h2 className="font-display text-base font-bold text-white tracking-wide">
              📈 6. MATRIZ COMPETITIVA DE COMPATIBILIDAD (BENCHMARKING)
            </h2>
          </div>
          <span className="font-mono text-[10px] text-gray-500">MÉTRICAS COMPARATIVAS DE MERCADO</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Competitor Table (Left) */}
          <div className="overflow-x-auto lg:col-span-7">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#242C3E] text-gray-400 bg-[#141A26]">
                  <th className="px-3 py-2.5 font-bold">ACTIVO</th>
                  <th className="px-3 py-2.5 font-bold text-right">P/E (PER)</th>
                  <th className="px-3 py-2.5 font-bold text-right">MARGEN OP.</th>
                  <th className="px-3 py-2.5 font-bold text-right">ROIC</th>
                  <th className="px-3 py-2.5 font-bold text-right">CREC. VENTAS</th>
                  <th className="px-3 py-2.5 font-bold text-right">APALAN.</th>
                  <th className="px-3 py-2.5 font-bold text-center">NOTA (0-100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2533]/50 text-gray-300">
                {/* Target Company Row */}
                <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 font-bold text-emerald-400 border-b border-[#1E2533]">
                  <td className="px-3 py-3 text-white">{summary.ticker} <span className="text-[9px] font-normal text-gray-400">(Objetivo)</span></td>
                  <td className="px-3 py-3 text-right">{report.multiples.per}</td>
                  <td className="px-3 py-3 text-right">{companyOpMargin.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-right">{companyRoic.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-right">
                    {growthMargins.find(g => g.metric.includes("3y"))?.value || "N/D"}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {liquiditySolvency.find(l => l.metric.includes("Net Debt / EBITDA"))?.value || "N/D"}
                  </td>
                  <td className="px-3 py-3 text-center text-white">{report.verdict.score.toFixed(0)}</td>
                </tr>

                {/* Competitors Rows */}
                {competitors.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-[#121824] transition-colors border-b border-[#1E2533]/50">
                    <td className="px-3 py-3 font-bold text-white">
                      {comp.name} <span className="font-mono text-[9px] text-gray-500">({comp.ticker})</span>
                    </td>
                    <td className="px-3 py-3 text-right">{comp.per}</td>
                    <td className="px-3 py-3 text-right text-gray-300">{comp.operatingMargin}</td>
                    <td className="px-3 py-3 text-right text-emerald-400">{comp.roic}</td>
                    <td className="px-3 py-3 text-right text-blue-400">{comp.salesGrowth}</td>
                    <td className="px-3 py-3 text-right">{comp.leverage}</td>
                    <td className="px-3 py-3 text-center">{comp.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Quality/Price Conclusion text box */}
            <div className="mt-4 rounded bg-[#0A0D14] p-4 border border-[#1E2533] space-y-1.5">
              <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4" /> DICTAMEN DE RELACIÓN CALIDAD / PRECIO (VALUATION GAP)
              </span>
              <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
                {competitors[0]?.qualityPriceConclusion || 
                  "Tras evaluar el foso de patentes, el spread de ROIC vs WACC y las primas de PER de los competidores globales, el comité determina que el activo analizado ofrece la asimetría de retorno más defensiva dentro del sector."}
              </p>
            </div>
          </div>

          {/* Competitor Chart comparison (Right) */}
          <div className="lg:col-span-5 h-[270px] bg-[#0A0D14] p-4 rounded border border-[#1E2533] flex flex-col justify-between">
            <span className="font-mono text-[10px] text-gray-400 block font-bold mb-2 uppercase">
              COMPARACIÓN DE MÁRGENES Y RENTABILIDAD DEL CAPITAL (%)
            </span>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="name" stroke="#6B7280" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#6B7280" tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0E121B", borderColor: "#242C3E", fontSize: 11, fontFamily: "monospace" }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                  <Bar dataKey="Margen Operativo %" fill="#10B981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="ROIC %" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ANÁLISIS MACRO Y RIESGOS GEOPOLÍTICOS AVANZADOS */}
      <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1E2533] pb-3">
          <Globe className="h-5 w-5 text-blue-400" />
          <h2 className="font-display text-base font-bold text-white tracking-wide">
            🌍 5. ANÁLISIS MACRO Y RIESGOS GEOPOLÍTICOS AVANZADOS
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 font-mono text-xs">
          {/* Ciclo Macro */}
          <div className="rounded bg-[#0A0D14] p-4 border border-[#1E2533] space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-blue-400" /> CICLO MACROECONÓMICO
            </span>
            <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
              {macroGeopolitics.macroCycle}
            </p>
          </div>

          {/* Supply Chain */}
          <div className="rounded bg-[#0A0D14] p-4 border border-[#1E2533] space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" /> CADENA DE SUMINISTRO Y RELOCALIZACIÓN
            </span>
            <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
              {macroGeopolitics.supplyChain}
            </p>
          </div>

          {/* Exposición China */}
          <div className="rounded bg-[#0A0D14] p-4 border border-[#1E2533] space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-red-400" /> EXPOSICIÓN A CHINA / BLOQUES GEOPOLÍTICOS
            </span>
            <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
              {macroGeopolitics.chinaExposure}
            </p>
          </div>

          {/* Disrupción */}
          <div className="rounded bg-[#0A0D14] p-4 border border-[#1E2533] space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-purple-400" /> RIESGOS DE DISRUPCIÓN (IA & ENERGÍA)
            </span>
            <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
              {macroGeopolitics.disruption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
