import React, { useState, useEffect } from "react";
import { EquityReport } from "../data/types";
import { Sliders, DollarSign, ArrowRightLeft, Percent, HelpCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface ValuationTabProps {
  report: EquityReport;
  customWacc: number;
  setCustomWacc: (val: number) => void;
  customG: number;
  setCustomG: (val: number) => void;
}

export default function ValuationTab({
  report,
  customWacc,
  setCustomWacc,
  customG,
  setCustomG,
}: ValuationTabProps) {
  const { multiples, dcf, meanReversion, valuationClassification, summary } = report;

  // Recalculate dynamic DCF Fair Price based on custom WACC and g sliders
  const calculateDynamicPrice = (wVal: number, gVal: number) => {
    const fcf = dcf.fcfValues;
    const yearsCount = fcf.length;
    if (!fcf || yearsCount === 0 || wVal <= gVal) return 0;

    const waccDec = wVal / 100;
    const gDec = gVal / 100;

    // 1. Discount explicit forecasted FCFs
    let pvExplicit = 0;
    for (let i = 0; i < yearsCount; i++) {
      pvExplicit += fcf[i] / Math.pow(1 + waccDec, i + 1);
    }

    // 2. Calculate Terminal Value and discount it
    const terminalValue = (fcf[yearsCount - 1] * (1 + gDec)) / (waccDec - gDec);
    const pvTerminal = terminalValue / Math.pow(1 + waccDec, yearsCount);

    // 3. Enterprise Value
    const ev = pvExplicit + pvTerminal;

    // 4. Calculate Equity Value and Price per Share
    const shares = dcf.sharesOutstanding || 0;
    const netDebt = dcf.netDebt || 0;

    if (shares > 0) {
      const equityValue = ev - netDebt;
      return Math.max(0, equityValue / shares);
    } else {
      // Proportional fallback approximation if shares are not specified
      const baseWaccDec = dcf.baseWacc / 100;
      const baseGDec = dcf.baseG / 100;
      let basePvExplicit = 0;
      for (let i = 0; i < yearsCount; i++) {
        basePvExplicit += fcf[i] / Math.pow(1 + baseWaccDec, i + 1);
      }
      const baseTerminalValue = (fcf[yearsCount - 1] * (1 + baseGDec)) / (baseWaccDec - baseGDec);
      const basePvTerminal = baseTerminalValue / Math.pow(1 + baseWaccDec, yearsCount);
      const baseEv = basePvExplicit + basePvTerminal;

      if (baseEv <= 0) return dcf.fairValue;
      const ratio = ev / baseEv;
      return Math.max(0, dcf.fairValue * ratio);
    }
  };

  const dynamicFairValue = calculateDynamicPrice(customWacc, customG);
  const currentPriceNum = parseFloat(summary.price.replace(/[^0-9.]/g, ""));

  // Calculate dynamic Margin of Safety
  const dynamicMarginOfSafety = dynamicFairValue > 0 
    ? ((dynamicFairValue - currentPriceNum) / dynamicFairValue) * 100 
    : 0;

  // Chart data matching custom parameters in real-time
  const chartData = dcf.fcfYears.map((year, idx) => {
    const rawValue = dcf.fcfValues[idx];
    const waccDec = customWacc / 100;
    const discountedValue = rawValue / Math.pow(1 + waccDec, idx + 1);
    return {
      year,
      "FCF Proyectado": Math.round(rawValue),
      "FCF Descontado": Math.round(discountedValue),
    };
  });

  const getClassBadge = (classification: string) => {
    const clean = classification.toLowerCase();
    if (clean.includes("muy barata") || clean.includes("barata")) {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    }
    if (clean.includes("justa")) {
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
    }
    return "bg-red-500/10 text-red-400 border border-red-500/30";
  };

  return (
    <div className="space-y-6" id="valuation-tab-pane">
      {/* multiples and mean reversion bento panel */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 4. Múltiplos Actuales */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 shadow-sm lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Múltiplos de Valoración Actuales
            </h3>
            <span className={`ml-auto inline-block rounded px-2.5 py-0.5 font-mono text-[11px] font-bold ${getClassBadge(valuationClassification)}`}>
              Clasificación: {valuationClassification}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-xs">
            <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
              <span className="text-gray-500 text-[10px]">P/E (PER)</span>
              <span className="font-bold text-base text-white mt-1 block">{multiples.per}</span>
            </div>
            <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
              <span className="text-gray-500 text-[10px]">FORWARD P/E</span>
              <span className="font-bold text-base text-white mt-1 block">{multiples.forwardPer}</span>
            </div>
            <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
              <span className="text-gray-500 text-[10px]">PEG RATIO</span>
              <span className="font-bold text-base text-white mt-1 block">{multiples.peg}</span>
            </div>
            <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
              <span className="text-gray-500 text-[10px]">EV / EBITDA</span>
              <span className="font-bold text-base text-white mt-1 block">{multiples.evEbitda}</span>
            </div>
            <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
              <span className="text-gray-500 text-[10px]">EV / SALES</span>
              <span className="font-bold text-base text-white mt-1 block">{multiples.evSales}</span>
            </div>
            <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
              <span className="text-gray-500 text-[10px]">PRICE / BOOK</span>
              <span className="font-bold text-base text-white mt-1 block">{multiples.priceBook}</span>
            </div>
            <div className="rounded bg-[#161B26] p-3 border border-[#242C3E]">
              <span className="text-gray-500 text-[10px]">PRICE / FCF</span>
              <span className="font-bold text-base text-white mt-1 block">{multiples.priceFcf}</span>
            </div>
            <div className="rounded bg-[#161B26] p-3 border border-[#242C3E] flex flex-col justify-center">
              <span className="text-gray-500 text-[10px]">MARGEN DE SEGURIDAD</span>
              <span className={`font-bold text-base mt-0.5 block ${report.marginOfSafety >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {report.marginOfSafety >= 0 ? `+${report.marginOfSafety.toFixed(1)}%` : `${report.marginOfSafety.toFixed(1)}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Reversión a la media */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 shadow-sm lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2533] pb-2">
            <ArrowRightLeft className="h-4 w-4 text-blue-400" />
            <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Reversión a la Media Histórica
            </h3>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded bg-[#161B26] p-2.5 border border-[#242C3E] text-center">
                <span className="text-gray-500 text-[9px] block">MEDIA PER 5A</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{meanReversion.multiple5y}</span>
              </div>
              <div className="rounded bg-[#161B26] p-2.5 border border-[#242C3E] text-center">
                <span className="text-gray-500 text-[9px] block">MEDIA PER 10A</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{meanReversion.multiple10y}</span>
              </div>
            </div>
            <div className="rounded bg-[#0A0D14] p-3 border border-[#1E2533] space-y-1">
              <span className="font-bold text-gray-400 block text-[10px]">VALORACIÓN SÍCLICA</span>
              <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
                {meanReversion.currentVsMean}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DCF MODELER */}
      <div className="rounded border border-[#1E2533] bg-[#0E121B] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#1E2533] pb-3 gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-emerald-400 animate-pulse" />
            <h2 className="font-display text-base font-bold text-white tracking-wide">
              🧮 MODELADOR DINÁMICO DE FLUJOS DE CAJA (DCF)
            </h2>
          </div>
          <span className="font-mono text-[10px] text-gray-500 bg-[#161B26] px-2 py-0.5 rounded border border-[#242C3E]">
            PARÁMETROS SENSIBLES EN TIEMPO REAL
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sliders (Left) */}
          <div className="space-y-6 lg:col-span-4 font-mono text-xs bg-[#0A0D14] p-4 rounded border border-[#1E2533]">
            <h4 className="font-bold text-gray-400 border-b border-[#1E2533] pb-2">CONTROLES DE SENSIBILIDAD</h4>

            {/* Slider 1: WACC */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white font-semibold flex items-center gap-1">
                  WACC (Tasa de Descuento):
                </span>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {customWacc.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="4.0"
                max="18.0"
                step="0.1"
                value={customWacc}
                onChange={(e) => setCustomWacc(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1E2533] rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>4.0% (Conservador)</span>
                <span>Default: {dcf.baseWacc}%</span>
                <span>18.0% (Riesgo Alto)</span>
              </div>
            </div>

            {/* Slider 2: Terminal growth g */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white font-semibold flex items-center gap-1">
                  g (Crecimiento Terminal):
                </span>
                <span className="text-blue-400 font-bold text-sm bg-blue-500/10 px-1.5 py-0.5 rounded">
                  {customG.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={customG}
                onChange={(e) => setCustomG(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1E2533] rounded-lg appearance-none cursor-pointer accent-blue-500"
                disabled={customG >= customWacc - 0.2} // Prevent dividing by negative or zero
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>0.5% (PIB Bajo)</span>
                <span>Default: {dcf.baseG}%</span>
                <span>6.0% (PIB Elevado)</span>
              </div>
            </div>

            <div className="rounded bg-[#161B26] p-3 text-[11px] text-[#A1AAB8] font-sans leading-relaxed border border-[#242C3E]">
              <HelpCircle className="h-4 w-4 text-yellow-500 inline mr-1 mb-0.5" />
              Al deslizar los parámetros, recalculamos dinámicamente el valor actual neto de los flujos futuros {dcf.fcfYears.join("-")} y su valor terminal. Pruébalo para simular tasas de inflación elevadas o primas de riesgo variables.
            </div>
          </div>

          {/* Recalculation Output (Center) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-3 font-mono text-xs">
            <div className="rounded bg-[#161B26] p-4 border border-[#242C3E] flex flex-col justify-between">
              <div>
                <span className="text-gray-500 text-[10px]">PRECIO ACTUAL</span>
                <span className="text-2xl font-bold text-white mt-1 block">{summary.price} USD</span>
              </div>
              <div className="border-t border-[#242C3E] pt-2 mt-2">
                <span className="text-gray-500 text-[9px]">VALOR RAZONABLE INICIAL (CONSENSO):</span>
                <span className="font-bold text-gray-300 block">{dcf.fairValue.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="rounded bg-[#0F1C1B] p-4 border border-emerald-500/30 flex flex-col justify-between shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <div>
                <span className="text-emerald-400 text-[10px] font-bold">VALOR RAZONABLE DINÁMICO (TU MODELO)</span>
                <span className="text-3xl font-display font-bold text-emerald-400 mt-1 block">
                  {dynamicFairValue.toFixed(2)} USD
                </span>
              </div>
              <div className="border-t border-emerald-500/20 pt-2 mt-2">
                <span className="text-gray-500 text-[9px]">NUEVO MARGEN DE SEGURIDAD:</span>
                <span className={`font-bold block text-sm ${dynamicMarginOfSafety >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {dynamicMarginOfSafety >= 0 ? `+${dynamicMarginOfSafety.toFixed(1)}%` : `${dynamicMarginOfSafety.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Recharts Area Chart (Right) */}
          <div className="lg:col-span-5 h-[240px] bg-[#0A0D14] p-4 rounded border border-[#1E2533] flex flex-col">
            <span className="font-mono text-[10px] text-gray-400 mb-2 block font-bold">
              VISUALIZACIÓN DE FLUJO DE CAJA LIBRE (FCF EN MILLONES)
            </span>
            <div className="flex-1 w-full min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fcfColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="fcfColorDisc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="year" stroke="#6B7280" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#6B7280" tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0E121B", borderColor: "#242C3E", fontSize: 11, fontFamily: "monospace" }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="FCF Proyectado"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#fcfColor)"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="FCF Descontado"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#fcfColorDisc)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

