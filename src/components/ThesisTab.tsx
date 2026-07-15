import React from "react";
import { EquityReport } from "../data/types";
import { Shield, Sparkles, AlertTriangle, Crosshair, Users, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface ThesisTabProps {
  report: EquityReport;
}

export default function ThesisTab({ report }: ThesisTabProps) {
  const { thesis } = report;

  const getMoatTrendIcon = (trend: string) => {
    const clean = trend.toLowerCase();
    if (clean.includes("expanding") || clean.includes("expansión") || clean.includes("creciente")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
          <ArrowUpRight className="h-3 w-3" /> EXPANDING
        </span>
      );
    }
    if (clean.includes("contracting") || clean.includes("contracción") || clean.includes("decreciente")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-400 border border-red-500/20">
          <ArrowDownRight className="h-3 w-3" /> CONTRACTING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded bg-yellow-500/10 px-2 py-0.5 text-xs font-bold text-yellow-400 border border-yellow-500/20">
        <Minus className="h-3 w-3" /> STABLE
      </span>
    );
  };

  return (
    <div className="space-y-6" id="thesis-tab-pane">
      {/* Introduction banner mimicking FT editorial design */}
      <div className="border-l-4 border-amber-500 bg-[#161310] p-5 rounded-r">
        <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500 font-bold">FINANCIAL TIMES / LEX COLUMN REVIEW</span>
        <h3 className="mt-1 font-display text-base font-bold text-[#F3E6D5]">Tesis de Inversión Institucional</h3>
        <p className="mt-2 text-xs text-gray-300 leading-relaxed font-sans">
          Análisis cualitativo del foso de mercado, catalizadores de capital a 12-18 meses y riesgos geopolíticos de cola, estructurado bajo la filosofía analítica de la columna de opinión financiera más influyente del mundo.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pillar 1: Catalizadores Clave */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <div className="rounded bg-emerald-500/10 p-1.5 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              1. Catalizadores Clave (Drivers de 12-18m)
            </h4>
          </div>
          <div className="whitespace-pre-wrap font-sans text-xs text-[#A1AAB8] leading-relaxed space-y-1">
            {thesis.catalysts.split("\n").map((line, idx) => (
              <p key={idx} className="pl-4 relative">
                <span className="absolute left-0 text-emerald-500">•</span>
                {line.replace(/^[0-9•.\s*-]+/g, "")}
              </p>
            ))}
          </div>
        </div>

        {/* Pillar 2: Moat Económico */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <div className="rounded bg-blue-500/10 p-1.5 text-blue-400 border border-blue-500/20">
              <Shield className="h-4 w-4" />
            </div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              2. Foso Económico (Economic Moat)
            </h4>
            <div className="ml-auto">{getMoatTrendIcon(thesis.moatTrend)}</div>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-gray-500 block text-[10px]">VENTAJA COMPETITIVA DE BASE</span>
              <p className="font-sans text-xs text-white leading-relaxed mt-1">
                {thesis.moat}
              </p>
            </div>
            <div className="border-t border-[#1E2533] pt-2">
              <span className="text-gray-500 block text-[10px]">TENDENCIA DEL MOAT (TREND)</span>
              <p className="font-sans text-xs text-gray-300 leading-relaxed mt-1">
                {thesis.moatTrend}
              </p>
            </div>
          </div>
        </div>

        {/* Pillar 3: Riesgos de Cola (Tail Risks) */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <div className="rounded bg-red-500/10 p-1.5 text-red-400 border border-red-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              3. Riesgos de Cola (Tail Risks)
            </h4>
          </div>
          <div className="whitespace-pre-wrap font-sans text-xs text-[#A1AAB8] leading-relaxed space-y-1">
            {thesis.tailRisks.split("\n").map((line, idx) => (
              <p key={idx} className="pl-4 relative">
                <span className="absolute left-0 text-red-500">•</span>
                {line.replace(/^[0-9•.\s*-]+/g, "")}
              </p>
            ))}
          </div>
        </div>

        {/* Pillar 4: Destrucción de Valor */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <div className="rounded bg-yellow-500/10 p-1.5 text-yellow-400 border border-yellow-500/20">
              <Crosshair className="h-4 w-4" />
            </div>
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              4. Spread de Valor (ROIC vs WACC)
            </h4>
          </div>
          <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
            {thesis.valueDestruction}
          </p>
        </div>
      </div>

      {/* Pillar 5: Factores ESG / Gobernanza Críticos */}
      <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
          <div className="rounded bg-[#A855F7]/10 p-1.5 text-[#A855F7] border border-[#A855F7]/20">
            <Users className="h-4 w-4" />
          </div>
          <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
            5. Estructura de Gobernanza Corporativa & ESG Críticos
          </h4>
        </div>
        <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
          {thesis.esg}
        </p>
      </div>
    </div>
  );
}
