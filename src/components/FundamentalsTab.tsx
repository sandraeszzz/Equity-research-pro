import React from "react";
import { EquityReport } from "../data/types";
import { ShieldCheck, Activity, BarChart2, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

interface FundamentalsTabProps {
  report: EquityReport;
}

export default function FundamentalsTab({ report }: FundamentalsTabProps) {
  const { growthMargins, capitalReturns, liquiditySolvency, earningsQuality, capitalAllocation } = report;

  const renderStatusBulb = (status: string) => {
    switch (status) {
      case "🟢":
        return <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">🟢 Excelente</span>;
      case "🟡":
        return <span className="inline-flex items-center gap-1 text-yellow-400 font-bold">🟡 Neutro</span>;
      case "🟠":
        return <span className="inline-flex items-center gap-1 text-orange-400 font-bold">🟠 Precaución</span>;
      case "🔴":
        return <span className="inline-flex items-center gap-1 text-red-400 font-bold">🔴 Crítico</span>;
      default:
        return <span className="text-gray-400 font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6" id="fundamentals-tab-pane">
      {/* 3. ANÁLISIS FUNDAMENTAL */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Table 1: Growth & Margins */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Crecimiento y Márgenes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-[#242C3E] text-gray-500">
                  <th className="pb-2">MÉTRICA</th>
                  <th className="pb-2 text-right">VALOR</th>
                  <th className="pb-2 text-right">BENCHMARK</th>
                  <th className="pb-2 text-center">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2533]/50 text-gray-300">
                {growthMargins.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#121622] transition-colors">
                    <td className="py-2.5 font-bold text-white">{item.metric}</td>
                    <td className="py-2.5 text-right font-semibold text-emerald-400">{item.value}</td>
                    <td className="py-2.5 text-right text-gray-400">{item.benchmark || "N/D"}</td>
                    <td className="py-2.5 text-center">{renderStatusBulb(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Returns on Capital */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <BarChart2 className="h-4 w-4 text-blue-400" />
            <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Retornos sobre Capital
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-[#242C3E] text-gray-500">
                  <th className="pb-2">MÉTRICA</th>
                  <th className="pb-2 text-right">VALOR</th>
                  <th className="pb-2 text-right">BENCHMARK</th>
                  <th className="pb-2 text-center">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2533]/50 text-gray-300">
                {capitalReturns.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#121622] transition-colors">
                    <td className="py-2.5 font-bold text-white">{item.metric}</td>
                    <td className="py-2.5 text-right font-semibold text-blue-400">{item.value}</td>
                    <td className="py-2.5 text-right text-gray-400">{item.benchmark || "N/D"}</td>
                    <td className="py-2.5 text-center">{renderStatusBulb(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Liquidity & Solvency */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <Activity className="h-4 w-4 text-purple-400" />
            <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Liquidez y Solvencia
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-[#242C3E] text-gray-500">
                  <th className="pb-2">MÉTRICA</th>
                  <th className="pb-2 text-right">VALOR</th>
                  <th className="pb-2 text-right">BENCHMARK</th>
                  <th className="pb-2 text-center">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2533]/50 text-gray-300">
                {liquiditySolvency.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#121622] transition-colors">
                    <td className="py-2.5 font-bold text-white">{item.metric}</td>
                    <td className="py-2.5 text-right font-semibold text-purple-400">{item.value}</td>
                    <td className="py-2.5 text-right text-gray-400">{item.benchmark || "N/D"}</td>
                    <td className="py-2.5 text-center">{renderStatusBulb(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Anti-Fraud filter Panel: Earnings Quality */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              🔍 Calidad del Beneficio (Filtro Anti-Fraude)
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Accruals Ratio */}
            <div className="rounded bg-[#0A0D14] p-3.5 border border-[#1E2533] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-400">ACCRUALS RATIO (RATIO DE DEVENGO)</span>
                {renderStatusBulb(earningsQuality.accrualsStatus)}
              </div>
              <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
                {earningsQuality.accrualsRatio}
              </p>
            </div>

            {/* FCF Conversion */}
            <div className="rounded bg-[#0A0D14] p-3.5 border border-[#1E2533] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-400">FCF CONVERSION RATE (FCF / NET INCOME)</span>
                {renderStatusBulb(earningsQuality.fcfConversionStatus)}
              </div>
              <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
                {earningsQuality.fcfConversion}
              </p>
            </div>

            {/* Maintenance vs Growth Capex */}
            <div className="rounded bg-[#0A0D14] p-3.5 border border-[#1E2533] space-y-1">
              <span className="font-bold text-gray-400">CAPEX DE MANTENIMIENTO VS. CRECIMIENTO</span>
              <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
                {earningsQuality.capexAnalysis}
              </p>
            </div>
          </div>
        </div>

        {/* Capital Allocation & Insiders */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <Sparkles className="h-4 w-4 text-[#A855F7]" />
            <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              💼 Asignación de Capital y Transacciones Insiders
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
                <span className="text-gray-500 text-[10px] block">DIVIDEND YIELD</span>
                <span className="font-bold text-lg text-white mt-1 block">{capitalAllocation.dividendYield}</span>
              </div>
              <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
                <span className="text-gray-500 text-[10px] block">PAYOUT RATIO</span>
                <span className="font-bold text-lg text-white mt-1 block">{capitalAllocation.dividendPayout}</span>
              </div>
            </div>

            <div className="rounded bg-[#0A0D14] p-3 border border-[#1E2533] space-y-1">
              <span className="font-bold text-gray-400">% INSIDER OWNERSHIP</span>
              <p className="font-sans text-xs text-white leading-relaxed">
                {capitalAllocation.insiderOwnership}
              </p>
            </div>

            <div className="rounded bg-[#0A0D14] p-3 border border-[#1E2533] space-y-1">
              <span className="font-bold text-gray-400">ACCIONES / VENTAS DE INSIDERS RECIENTES</span>
              <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
                {capitalAllocation.insiderActivity}
              </p>
            </div>

            <div className="rounded bg-[#0A0D14] p-3 border border-[#1E2533] space-y-1">
              <span className="font-bold text-gray-400">EFICACIA EN RECOMPRA DE ACCIONES (BUYBACKS)</span>
              <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
                {capitalAllocation.buybacksAnalysis}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
