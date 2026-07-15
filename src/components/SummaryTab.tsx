import React from "react";
import { EquityReport } from "../data/types";
import { ShieldCheck, Activity, DollarSign, TrendingUp, Clock } from "lucide-react";

interface SummaryTabProps {
  report: EquityReport;
}

export default function SummaryTab({ report }: SummaryTabProps) {
  const { summary, scorecard, verdict, technical } = report;
  const ticker = summary.ticker.toUpperCase();

  // Helper for ASCII progress bar: █████████░
  const getAsciiBar = (val: number, max: number = 100) => {
    const percentage = val / max;
    const filledCount = Math.min(10, Math.max(0, Math.round(percentage * 10)));
    const emptyCount = 10 - filledCount;
    return "█".repeat(filledCount) + "░".repeat(emptyCount);
  };

  // Helper for Premium Separator
  const renderSeparator = (number: string, title: string) => {
    return (
      <div className="my-6">
        <div className="text-gray-600 font-mono text-xs select-none">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <div className="flex items-center gap-3 font-mono text-xs text-white font-bold my-1">
          <span className="text-emerald-400">{number}</span>
          <span className="text-gray-400">│</span>
          <span>{title}</span>
        </div>
        <div className="text-gray-600 font-mono text-xs select-none">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      </div>
    );
  };

  // Pre-compiled company metrics for ASCII charts or snapshots
  const getCompanySpecifics = () => {
    if (ticker === "NVDA") {
      return {
        fullName: "NVIDIA CORPORATION",
        recommendation: "🟢 BUY",
        score: 91,
        price: "182.40$",
        fairValue: "205$",
        upside: "+12.4%",
        conviction: "ALTA",
        moat: "9.4/10",
        risk: "3.1/10",
        snapshot: {
          ticker: "NVDA",
          sector: "Semiconductors",
          industry: "AI Chips",
          country: "USA",
          marketCap: "4.5T",
          employees: "36,000",
          ipo: "1999",
          ceo: "Jensen Huang"
        },
        metrics: {
          revenueGrowth: { val: 28, text: "28%" },
          operatingMargin: { val: 31, text: "31%" },
          roic: { val: 41, text: "41%" },
          netDebt: { val: 20, text: "Caja Neta" },
          fcfConversion: { val: 97, text: "97%" }
        },
        scores: {
          quality: 92,
          valuation: 64,
          growth: 96,
          financials: 84,
          momentum: 81
        },
        heatmap: {
          margins: "🟢",
          roic: "🟢",
          debt: "🟡",
          governance: "🟢",
          valuation: "🔴"
        },
        asciiChart: [
          { year: "2021", bar: "██" },
          { year: "2022", bar: "████" },
          { year: "2023", bar: "██████" },
          { year: "2024", bar: "█████████" },
          { year: "2025", bar: "███████████" }
        ],
        thesis: {
          bull: "Excepcional escalado de Blackwell Ultra con nubes soberanas que supera expectativas sectoriales.",
          base: "Demanda sostenida de clústeres GPU Hopper y Blackwell de parte de grandes hyperscalers.",
          bear: "Problemas de empaquetado térmico CoWoS de TSMC o aranceles severos de exportación.",
          catalysts: ["Lanzamiento de Blackwell Ultra en volumen.", "Expansión comercial de IA en Europa."],
          risks: ["Riesgo geopolítico de conflicto en Taiwán.", "Presión antimonopolio por parte de la FTC."]
        }
      };
    } else if (ticker === "AAPL") {
      return {
        fullName: "APPLE INCORPORATED",
        recommendation: "🟢 BUY",
        score: 82,
        price: summary.price + "$",
        fairValue: summary.targetPrice + "$",
        upside: summary.upside,
        conviction: "ALTA",
        moat: "8.9/10",
        risk: "2.4/10",
        snapshot: {
          ticker: "AAPL",
          sector: "Consumer Tech",
          industry: "Hardware & Services",
          country: "USA",
          marketCap: summary.marketCap,
          employees: "164,000",
          ipo: "1980",
          ceo: "Tim Cook"
        },
        metrics: {
          revenueGrowth: { val: 12, text: "12%" },
          operatingMargin: { val: 30, text: "30%" },
          roic: { val: 56, text: "56%" },
          netDebt: { val: 15, text: "Caja Neta" },
          fcfConversion: { val: 98, text: "98%" }
        },
        scores: {
          quality: 94,
          valuation: 55,
          growth: 78,
          financials: 92,
          momentum: 74
        },
        heatmap: {
          margins: "🟢",
          roic: "🟢",
          debt: "🟢",
          governance: "🟢",
          valuation: "🟡"
        },
        asciiChart: [
          { year: "2021", bar: "██████" },
          { year: "2022", bar: "████████" },
          { year: "2023", bar: "████████" },
          { year: "2024", bar: "█████████" },
          { year: "2025", bar: "██████████" }
        ],
        thesis: {
          bull: "Súper ciclo acelerado de renovación de dispositivos móviles iOS guiado por Apple Intelligence.",
          base: "Estabilidad en hardware con fuerte tracción y monetización de la rama de Servicios.",
          bear: "Demandas antimonopolio en Europa por App Store o pérdida de cuota de mercado en China.",
          catalysts: ["Lanzamiento de Apple Intelligence global.", "Crecimiento de suscripciones iCloud."],
          risks: ["Escrutinio regulador de la Comisión Europea.", "Competencia local extrema en Asia."]
        }
      };
    } else {
      // TSLA or dynamic fallback
      const priceNum = parseFloat(summary.price) || 240;
      const targetNum = parseFloat(summary.targetPrice) || 220;
      const calculatedScore = Math.round(scorecard.quality * 0.25 + scorecard.growth * 0.15 + scorecard.valuation * 0.20 + scorecard.financialStrength * 0.20 + scorecard.momentum * 0.20);
      return {
        fullName: summary.company.toUpperCase(),
        recommendation: verdict.decision.includes("COMPRAR") ? "🟢 BUY" : verdict.decision.includes("EVITAR") ? "🔴 SELL" : "🟡 HOLD",
        score: calculatedScore || 68,
        price: summary.price + "$",
        fairValue: summary.targetPrice + "$",
        upside: summary.upside,
        conviction: verdict.conviction.toUpperCase(),
        moat: "7.2/10",
        risk: "5.8/10",
        snapshot: {
          ticker: summary.ticker,
          sector: summary.sector,
          industry: summary.industry,
          country: summary.country,
          marketCap: summary.marketCap,
          employees: "140,000",
          ipo: "2010",
          ceo: "Elon Musk"
        },
        metrics: {
          revenueGrowth: { val: 18, text: "18%" },
          operatingMargin: { val: 11, text: "11%" },
          roic: { val: 14, text: "14%" },
          netDebt: { val: 10, text: "Caja Neta" },
          fcfConversion: { val: 64, text: "64%" }
        },
        scores: {
          quality: scorecard.quality || 74,
          valuation: scorecard.valuation || 35,
          growth: scorecard.growth || 82,
          financials: scorecard.financialStrength || 88,
          momentum: scorecard.momentum || 62
        },
        heatmap: {
          margins: "🟡",
          roic: "🟡",
          debt: "🟢",
          governance: "🔴",
          valuation: "🔴"
        },
        asciiChart: [
          { year: "2021", bar: "███" },
          { year: "2022", bar: "██████" },
          { year: "2023", bar: "████████" },
          { year: "2024", bar: "████████" },
          { year: "2025", bar: "█████████" }
        ],
        thesis: {
          bull: "Aprobación masiva y comercialización del Robotaxi FSD autónomo sin supervisión en EEUU.",
          base: "Consolidación de volumen automotriz con excelente aceleración de almacenamiento de energía.",
          bear: "Retrasos extremos de homologación en FSD o guerra de precios de fabricantes chinos.",
          catalysts: ["Homologación de FSD en Europa y China.", "Lanzamiento del modelo de bajo coste."],
          risks: ["Riesgos de gobernanza corporativa directiva.", "Compresión de márgenes industriales."]
        }
      };
    }
  };

  const specifics = getCompanySpecifics();

  return (
    <div className="space-y-6" id="summary-tab-pane">
      {/* 1. Dashboard superior (Financial Times / Lex style block) */}
      <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs relative overflow-hidden">
        <div className="text-gray-500 font-bold select-none leading-none">══════════════════════════════════════════════════════</div>
        
        <div className="grid gap-4 md:grid-cols-4 my-3 text-gray-300">
          <div>
            <div className="font-bold text-white text-base leading-tight">{specifics.fullName}</div>
            <div className="text-gray-500 text-[10px] mt-0.5">NASDAQ: {specifics.snapshot.ticker}</div>
            <div className="mt-2 text-sm font-extrabold text-white">{specifics.recommendation}</div>
          </div>

          <div className="border-l border-[#1E2533]/50 pl-4">
            <div className="text-[10px] text-gray-500">INVESTMENT SCORE:</div>
            <div className="text-emerald-400 font-bold tracking-tighter mt-1 text-[11px] leading-none">
              {getAsciiBar(specifics.score)}
            </div>
            <div className="font-bold text-white text-sm mt-1">{specifics.score} / 100</div>
          </div>

          <div className="border-l border-[#1E2533]/50 pl-4 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Precio:</span>
              <strong className="text-white">{specifics.price}</strong>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Valor razonable:</span>
              <strong className="text-emerald-400">{specifics.fairValue}</strong>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Upside:</span>
              <strong className="text-emerald-400">{specifics.upside}</strong>
            </div>
          </div>

          <div className="border-l border-[#1E2533]/50 pl-4 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Convicción:</span>
              <strong className="text-white">{specifics.conviction}</strong>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Moat:</span>
              <strong className="text-emerald-400">{specifics.moat}</strong>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-500">Riesgo:</span>
              <strong className="text-red-400">{specifics.risk}</strong>
            </div>
          </div>
        </div>

        <div className="text-gray-500 font-bold select-none leading-none">══════════════════════════════════════════════════════</div>
      </div>

      {/* Grid: Snapshot & Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 2. Company Snapshot */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs space-y-4">
          <div className="border-b border-[#1E2533]/60 pb-2">
            <span className="font-bold text-white text-xs block uppercase tracking-wider">🟢 COMPANY SNAPSHOT</span>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex justify-between border-b border-[#1E2533]/30 pb-1.5">
              <span className="text-gray-500">Ticker:</span>
              <strong className="text-white">{specifics.snapshot.ticker}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1E2533]/30 pb-1.5">
              <span className="text-gray-500">Sector:</span>
              <strong className="text-white truncate max-w-[100px]">{specifics.snapshot.sector}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1E2533]/30 pb-1.5">
              <span className="text-gray-500">Industry:</span>
              <strong className="text-white truncate max-w-[100px]">{specifics.snapshot.industry}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1E2533]/30 pb-1.5">
              <span className="text-gray-500">Country:</span>
              <strong className="text-white">{specifics.snapshot.country}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1E2533]/30 pb-1.5">
              <span className="text-gray-500">Market Cap:</span>
              <strong className="text-emerald-400">{specifics.snapshot.marketCap}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1E2533]/30 pb-1.5">
              <span className="text-gray-500">Employees:</span>
              <strong className="text-white">{specifics.snapshot.employees}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1E2533]/30 pb-1.5">
              <span className="text-gray-500">IPO:</span>
              <strong className="text-white">{specifics.snapshot.ipo}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1E2533]/30 pb-1.5">
              <span className="text-gray-500">CEO:</span>
              <strong className="text-white truncate max-w-[100px]">{specifics.snapshot.ceo}</strong>
            </div>
          </div>
        </div>

        {/* 3. Key Metrics Dashboard */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs space-y-4">
          <div className="border-b border-[#1E2533]/60 pb-2">
            <span className="font-bold text-white text-xs block uppercase tracking-wider">🟢 KEY METRICS DASHBOARD</span>
          </div>
          <div className="space-y-2.5">
            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-300">
                <span>Revenue Growth:</span>
                <strong className="text-white">{specifics.metrics.revenueGrowth.text}</strong>
              </div>
              <div className="text-emerald-400 tracking-tight text-[11px] leading-none">
                {getAsciiBar(specifics.metrics.revenueGrowth.val, 50)}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-300">
                <span>Operating Margin:</span>
                <strong className="text-white">{specifics.metrics.operatingMargin.text}</strong>
              </div>
              <div className="text-emerald-400 tracking-tight text-[11px] leading-none">
                {getAsciiBar(specifics.metrics.operatingMargin.val, 50)}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-300">
                <span>ROIC:</span>
                <strong className="text-white">{specifics.metrics.roic.text}</strong>
              </div>
              <div className="text-emerald-400 tracking-tight text-[11px] leading-none">
                {getAsciiBar(specifics.metrics.roic.val, 50)}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-300">
                <span>Net Debt / Leverage:</span>
                <strong className="text-white">{specifics.metrics.netDebt.text}</strong>
              </div>
              <div className="text-emerald-400 tracking-tight text-[11px] leading-none">
                {getAsciiBar(specifics.metrics.netDebt.val, 50)}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex justify-between text-gray-300">
                <span>FCF Conversion %:</span>
                <strong className="text-white">{specifics.metrics.fcfConversion.text}</strong>
              </div>
              <div className="text-emerald-400 tracking-tight text-[11px] leading-none">
                {getAsciiBar(specifics.metrics.fcfConversion.val, 100)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator 1 */}
      {renderSeparator("SECCIÓN I", "CUADRO MANDO CUANTITATIVO & RENTABILIDAD")}

      {/* Scorecards & Heatmaps & Mini chart */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* 4. Investment Score Cards */}
        <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs space-y-4 md:col-span-6">
          <span className="font-bold text-white text-xs block uppercase tracking-wider">🟢 INVESTMENT SCORE CARDS</span>
          <div className="space-y-3">
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-400">QUALITY</span>
                <strong className="text-white">{specifics.scores.quality}</strong>
              </div>
              <div className="text-emerald-400 text-[11px] leading-none">{getAsciiBar(specifics.scores.quality)}</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-400">VALUATION</span>
                <strong className="text-white">{specifics.scores.valuation}</strong>
              </div>
              <div className="text-emerald-400 text-[11px] leading-none">{getAsciiBar(specifics.scores.valuation)}</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-400">GROWTH</span>
                <strong className="text-white">{specifics.scores.growth}</strong>
              </div>
              <div className="text-emerald-400 text-[11px] leading-none">{getAsciiBar(specifics.scores.growth)}</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-400">FINANCIALS</span>
                <strong className="text-white">{specifics.scores.financials}</strong>
              </div>
              <div className="text-emerald-400 text-[11px] leading-none">{getAsciiBar(specifics.scores.financials)}</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-400">MOMENTUM</span>
                <strong className="text-white">{specifics.scores.momentum}</strong>
              </div>
              <div className="text-emerald-400 text-[11px] leading-none">{getAsciiBar(specifics.scores.momentum)}</div>
            </div>
          </div>
        </div>

        {/* 7. Heatmaps & 8. Mini ASCII chart */}
        <div className="space-y-6 md:col-span-6 flex flex-col justify-between">
          {/* 7. Heatmap Panel */}
          <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs space-y-3">
            <span className="font-bold text-white text-xs block uppercase tracking-wider">🟢 HEATMAPS DE FILTRADO</span>
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] mt-1">
              <div className="bg-[#0A0D14] p-2 rounded border border-[#1E2533]">
                <span className="text-gray-500 block">Margins</span>
                <span className="text-sm block mt-1">{specifics.heatmap.margins}</span>
              </div>
              <div className="bg-[#0A0D14] p-2 rounded border border-[#1E2533]">
                <span className="text-gray-500 block">ROIC</span>
                <span className="text-sm block mt-1">{specifics.heatmap.roic}</span>
              </div>
              <div className="bg-[#0A0D14] p-2 rounded border border-[#1E2533]">
                <span className="text-gray-500 block">Debt</span>
                <span className="text-sm block mt-1">{specifics.heatmap.debt}</span>
              </div>
              <div className="bg-[#0A0D14] p-2 rounded border border-[#1E2533]">
                <span className="text-gray-500 block">Gov.</span>
                <span className="text-sm block mt-1">{specifics.heatmap.governance}</span>
              </div>
              <div className="bg-[#0A0D14] p-2 rounded border border-[#1E2533]">
                <span className="text-gray-500 block">Valuation</span>
                <span className="text-sm block mt-1">{specifics.heatmap.valuation}</span>
              </div>
            </div>
          </div>

          {/* 8. Mini ASCII graphics (Revenue trend) */}
          <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs space-y-2">
            <span className="font-bold text-white text-xs block uppercase tracking-wider">🟢 REVENUE TREND (HISTÓRICO ASCII)</span>
            <div className="space-y-1.5 pt-1.5 text-xs">
              {specifics.asciiChart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-gray-500 w-8">{item.year}:</span>
                  <span className="text-emerald-400 font-bold tracking-tight select-none">{item.bar}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Separator 2 */}
      {renderSeparator("SECCIÓN II", "ANÁLISIS DE ESCENARIOS & CATALIZADORES")}

      {/* 9. Investment Snapshot */}
      <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs space-y-4">
        <span className="font-bold text-white text-xs block uppercase tracking-wider">🟢 9. INVESTMENT SNAPSHOT (DIAGNÓSTICO DE ESCENARIOS)</span>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] space-y-1">
            <span className="text-blue-400 font-bold block">📈 BULL CASE</span>
            <p className="font-sans text-xs text-gray-300 leading-relaxed">{specifics.thesis.bull}</p>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] space-y-1">
            <span className="text-emerald-400 font-bold block">🟢 BASE CASE</span>
            <p className="font-sans text-xs text-gray-300 leading-relaxed">{specifics.thesis.base}</p>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] space-y-1">
            <span className="text-red-400 font-bold block">🔴 BEAR CASE</span>
            <p className="font-sans text-xs text-gray-300 leading-relaxed">{specifics.thesis.bear}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 pt-2 border-t border-[#1E2533]/50">
          <div>
            <span className="text-emerald-400 font-bold block mb-1">🟢 CATALYSTS:</span>
            <ul className="list-disc pl-5 font-sans text-xs text-gray-300 space-y-0.5">
              {specifics.thesis.catalysts.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-red-400 font-bold block mb-1">🔴 CRITICAL RISKS:</span>
            <ul className="list-disc pl-5 font-sans text-xs text-gray-300 space-y-0.5">
              {specifics.thesis.risks.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 9. Technical & Support Dashboard */}
      <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs space-y-3">
        <div className="flex items-center gap-1.5 border-b border-[#1E2533]/50 pb-2 mb-1">
          <span className="font-bold text-white text-xs block uppercase tracking-wider">📈 TENDENCIAS Y SOPORTES TÉCNICOS</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] space-y-0.5">
            <span className="text-gray-500 text-[10px] block">TENDENCIA PRIMARIA</span>
            <strong className="text-white">{technical.trend}</strong>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] space-y-0.5">
            <span className="text-gray-500 text-[10px] block">MEDIAS MOVIL S SMA 50 & 200</span>
            <strong className="text-white block">SMA 50: {technical.ma50}</strong>
            <strong className="text-gray-300 block text-[11px] mt-0.5">SMA 200: {technical.ma200}</strong>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] space-y-0.5">
            <span className="text-gray-500 text-[10px] block">RSI & VOLUMEN</span>
            <strong className="text-white block">RSI: {technical.rsi}</strong>
            <strong className="text-gray-300 block text-[11px] mt-0.5">Soporte: {technical.support}</strong>
          </div>
        </div>
      </div>

      {/* Separator 3 */}
      {renderSeparator("SECCIÓN III", "DICTAMEN DEL COMITÉ & VEREDICTO DE CAPITAL")}

      {/* 10. Investment Committee Summary */}
      <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 font-mono text-xs space-y-4">
        <div className="border-b border-[#1E2533]/60 pb-2">
          <span className="font-bold text-white text-xs block uppercase tracking-wider">🏦 10. INVESTMENT COMMITTEE SUMMARY</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 font-mono text-xs">
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] text-center">
            <span className="text-gray-500 text-[10px] block uppercase">Recomendación de Compra</span>
            <strong className="text-emerald-400 text-sm block mt-1.5">{specifics.recommendation}</strong>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] text-center">
            <span className="text-gray-500 text-[10px] block uppercase">Precio Objetivo</span>
            <strong className="text-white text-sm block mt-1.5">{specifics.fairValue}</strong>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] text-center">
            <span className="text-gray-500 text-[10px] block uppercase">Retorno Esperado</span>
            <strong className="text-emerald-400 text-sm block mt-1.5">{specifics.upside}</strong>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533] text-center">
            <span className="text-gray-500 text-[10px] block uppercase">Nivel de Convicción</span>
            <strong className="text-white text-sm block mt-1.5">{specifics.conviction}</strong>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 font-mono text-xs pt-1">
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533]">
            <span className="text-gray-500 text-[10px] block">NIVEL DE RIESGO SECTORIAL:</span>
            <strong className="text-red-400 block mt-1">{specifics.risk}</strong>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533]">
            <span className="text-gray-500 text-[10px] block">PESO RECOMENDADO CARTERA:</span>
            <strong className="text-emerald-400 block mt-1">{verdict.assetAllocation}</strong>
          </div>
          <div className="bg-[#0A0D14] p-3 rounded border border-[#1E2533]">
            <span className="text-gray-500 text-[10px] block">NOTA GLOBAL CALCULADA:</span>
            <strong className="text-emerald-400 block mt-1">{specifics.score} / 100</strong>
          </div>
        </div>

        <div className="rounded bg-[#0A0D14] p-4 border border-[#1E2533] space-y-1.5">
          <span className="font-bold text-white flex items-center gap-1.5">
            🏦 TEST DE LOS 500 MILLONES DE DÓLARES (ACTIVO ILÍQUIDO A 5 AÑOS):
          </span>
          <p className="font-sans text-xs text-[#A1AAB8] leading-relaxed">
            {verdict.test500m}
          </p>
        </div>
      </div>
    </div>
  );
}