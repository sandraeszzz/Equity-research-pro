import React, { useState, useEffect } from "react";
import { demoReports } from "./data/demoReports";
import { EquityReport } from "./data/types";
import ReportHeader from "./components/ReportHeader";
import SummaryTab from "./components/SummaryTab";
import ThesisTab from "./components/ThesisTab";
import FundamentalsTab from "./components/FundamentalsTab";
import ValuationTab from "./components/ValuationTab";
import CompetitorsTab from "./components/CompetitorsTab";
import PremiumTab from "./components/PremiumTab";
import { Terminal, Clock, User, Award, ShieldAlert, Activity, ChevronRight, HelpCircle } from "lucide-react";
console.log("APP CARGADA");
export default function App() {
  const [selectedReport, setSelectedReport] = useState<EquityReport>(demoReports["AAPL"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [reportSource, setReportSource] = useState<string>("preloaded");
  
  // Custom states for DCF modeler (synchronized on report changes)
  const [customWacc, setCustomWacc] = useState(9.2);
  const [customG, setCustomG] = useState(3.5);

  const [activeTab, setActiveTab] = useState<"resumen" | "tesis" | "fundamentos" | "valoracion" | "competidores" | "premium">("resumen");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "NFLX", "AMD", "JPM", "DIS"
  ]);

  // Sync DCF sensitivity parameters when selected company report changes
  useEffect(() => {
    if (selectedReport) {
      setCustomWacc(selectedReport.dcf.baseWacc);
      setCustomG(selectedReport.dcf.baseG);
    }
  }, [selectedReport?.summary.ticker]);

  // Loading step simulation logs for terminal feel
  const loadingLogs = [
    "Conectando con Equity Research Pro Core Engine...",
    "Consultando base de datos global de Financial Modeling Prep (FMP)...",
    "Extrayendo estados financieros consolidados e historicos para 2026...",
    "Verificando Calidad de Beneficios (Métricas de Accruals y Conversión FCF)...",
    "Procesando valoración por flujos descontados (DCF) y regresión a la media...",
    "Sintetizando informe final con inteligencia cualitativa..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingLogs.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const triggerLiveAnalysis = async (ticker: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: ticker }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo completar el análisis del activo.");
      }

      setSelectedReport(data.report);
      setReportSource(data.source || "gemini-fmp");
      
      const upperTicker = data.report.summary.ticker.toUpperCase();
      if (!recentSearches.includes(upperTicker)) {
        setRecentSearches((prev) => [upperTicker, ...prev]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudo completar el análisis del activo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Select predefined reports
  const handleSelectTicker = async (tick: string) => {
    setError(null);
    if (demoReports[tick]) {
      setSelectedReport(demoReports[tick]);
      setReportSource("preloaded");
    } else {
      await triggerLiveAnalysis(tick);
    }
  };

  // Live analysis search action
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery;
    setSearchQuery("");
    await triggerLiveAnalysis(q);
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-gray-100 font-sans flex flex-col bloomberg-grid" id="main-app">
      {/* Bloomberg-style Top Console Header */}
      <ReportHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
        onSelectTicker={handleSelectTicker}
        activeTicker={selectedReport?.summary.ticker}
      />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Left column: Recent list and Committee Status details */}
        <aside className="w-full lg:w-[260px] flex flex-col gap-5 shrink-0" id="side-panel">
          {/* Status badge */}
          <div className="rounded border border-[#1E2533] bg-[#0E121B] p-4 font-mono text-[11px] space-y-2.5">
            <span className="font-bold text-gray-400 block border-b border-[#1E2533] pb-1.5 uppercase">ESTADO DE SESIÓN</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">ANALISTA:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <User className="h-3 w-3" /> Equity Pro
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">ROL:</span>
              <span className="text-gray-300 font-semibold">Comité Senior</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">CAPITAL:</span>
              <span className="text-yellow-400 font-bold">500M USD/Activo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">FECHA UTC:</span>
              <span className="text-gray-400 font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" /> 2026-07-15
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#1E2533]/50">
              <span className="text-gray-500">FUERZA DE DATOS:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                reportSource === "preloaded"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : reportSource === "gemini-fmp"
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.1)]"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
              }`}>
                {reportSource === "preloaded"
                  ? "DEMO PRE-CARGADO"
                  : reportSource === "gemini-fmp"
                  ? "GEMINI + LIVE FMP"
                  : "MOTOR REAL-TIME FMP"}
              </span>
            </div>
          </div>

          {/* Recent searches history list */}
          <div className="rounded border border-[#1E2533] bg-[#0E121B] p-4 space-y-3">
            <span className="font-mono text-[11px] font-bold text-gray-400 block border-b border-[#1E2533] pb-1.5 uppercase">
              COBERTURA DE ACCIONES
            </span>
            <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto custom-scrollbar">
              {recentSearches.map((tick) => {
                const isPreloaded = !!demoReports[tick];
                return (
                  <button
                    key={tick}
                    onClick={() => {
                      handleSelectTicker(tick);
                    }}
                    className={`flex items-center justify-between rounded px-3 py-2 text-left font-mono text-xs transition-colors ${
                      selectedReport?.summary.ticker === tick
                        ? "bg-[#1E2536] text-white border-l-2 border-emerald-500"
                        : "text-gray-400 hover:bg-[#121622] hover:text-gray-200"
                    }`}
                    id={`recent-tick-${tick}`}
                    type="button"
                  >
                    <span>{tick}</span>
                    <span className="text-[10px] text-gray-500 bg-[#161B26] px-1.5 py-0.5 rounded">
                      {isPreloaded ? "DEMO" : "LIVE"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick instructions panel */}
          <div className="rounded border border-[#1E2533] bg-[#0E121B] p-4 text-xs space-y-2">
            <span className="font-mono text-[11px] font-bold text-gray-400 block border-b border-[#1E2533] pb-1.5 uppercase flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-blue-400" /> METODOLOGÍA PRO
            </span>
            <p className="text-gray-400 leading-relaxed font-sans">
              Escribe cualquier empresa global (ej: <strong>Microsoft</strong>, <strong>Alphabet</strong> o <strong>Tesla</strong>) en la barra superior. 
              El modelo activará búsquedas en tiempo real para recopilar datos de consenso reales antes de estructurar el dictamen.
            </p>
          </div>
        </aside>

        {/* Right column: Main Terminal Screen */}
        <main className="flex-1 flex flex-col gap-6" id="main-terminal-screen">
          {isLoading ? (
            /* Terminal style loading screen */
            <div className="flex-1 rounded border border-[#1E2533] bg-[#0A0D14] p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-full max-w-md space-y-6">
                <div className="flex items-center gap-3">
                  <Terminal className="h-6 w-6 text-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs text-emerald-400 font-bold">ANALIZANDO ACTIVO EN TIEMPO REAL...</span>
                </div>
                
                {/* Progress status */}
                <div className="space-y-2 font-mono text-xs">
                  {loadingLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 transition-opacity duration-300 ${
                        idx < loadingStep
                          ? "text-gray-400"
                          : idx === loadingStep
                          ? "text-emerald-400 font-bold animate-pulse"
                          : "text-gray-600 opacity-30"
                      }`}
                    >
                      {idx < loadingStep ? (
                        <span className="text-emerald-500">✔</span>
                      ) : idx === loadingStep ? (
                        <span className="animate-spin text-emerald-400">⚡</span>
                      ) : (
                        <span>•</span>
                      )}
                      <span>{log}</span>
                    </div>
                  ))}
                </div>

                {/* Animated loading bar */}
                <div className="h-1.5 w-full rounded bg-[#161B26] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${((loadingStep + 1) / loadingLogs.length) * 100}%` }}
                  />
                </div>
                <p className="font-sans text-xs text-gray-500 text-center leading-relaxed">
                  Buscando en SEC filings, Yahoo Finance, Koyfin y Bloomberg consensus. Esto tarda unos segundos debido al análisis cruzado con Google Search.
                </p>
              </div>
            </div>
          ) : error ? (
            /* Visual error screen with custom setup instructions */
            <div className="flex-1 rounded border border-red-500/20 bg-[#0A0D14] p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="max-w-xl text-center space-y-6">
                <div className="inline-flex rounded-full bg-red-500/10 p-3 border border-red-500/30 text-red-400">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-bold text-white">ERROR EN EL MOTOR DE ANÁLISIS</h3>
                  <p className="font-mono text-xs text-red-400 bg-red-500/5 p-4 rounded border border-red-500/20 leading-relaxed max-h-[150px] overflow-y-auto">
                    {error}
                  </p>
                </div>

                {error.includes("Clave de API") && (
                  <div className="rounded border border-[#1E2533] bg-[#0E121B] p-5 text-left font-sans text-xs space-y-3">
                    <span className="font-mono text-[11px] font-bold text-emerald-400 block border-b border-[#1E2533] pb-1.5 uppercase">
                      🛠 INSTRUCCIONES DE CONFIGURACIÓN
                    </span>
                    <p className="text-gray-300">
                      Para realizar consultas en tiempo real para cualquier empresa del mundo, necesitas configurar tu clave API de Google Gemini:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5 text-[#A1AAB8]">
                      <li>Abre el panel de <strong>Settings</strong> (icono de engranaje) en el menú lateral derecho de la pantalla.</li>
                      <li>Haz clic en la pestaña <strong>Secrets</strong>.</li>
                      <li>Añade un secreto con el nombre: <code className="rounded bg-[#161B26] px-1.5 py-0.5 text-white font-mono text-[11px]">GEMINI_API_KEY</code></li>
                      <li>Pega tu clave de API de Gemini y haz clic en guardar.</li>
                    </ol>
                    <p className="text-[#A1AAB8] pt-1">
                      <em>Nota: Puedes seguir navegando usando las pestañas pre-cargadas de <strong>AAPL</strong>, <strong>TSLA</strong> y <strong>NVDA</strong> de inmediato sin necesidad de clave API.</em>
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleSelectTicker("AAPL")}
                  className="rounded bg-emerald-600 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
                  type="button"
                >
                  VOLVER A MODO DEMO (AAPL)
                </button>
              </div>
            </div>
          ) : selectedReport ? (
            /* Executive Dashboard Panels */
            <div className="flex-1 flex flex-col gap-6">
              {/* Dashboard Tabs bar */}
              <div className="flex border-b border-[#1E2533] bg-[#0E121B] rounded-t overflow-x-auto" id="terminal-tabs">
                {(
                  [
                    { id: "resumen", label: "🟢 Terminal Resumen" },
                    { id: "tesis", label: "🏦 Tesis FT & ESG" },
                    { id: "fundamentos", label: "📈 Estados Financieros" },
                    { id: "valoracion", label: "🏦 Valoración e Histórico" },
                    { id: "competidores", label: "📈 Competidores & Macro" },
                    { id: "premium", label: "🏦 Auditoría Premium" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-3.5 font-mono text-xs font-bold border-r border-[#1E2533] transition-all shrink-0 ${
                      activeTab === tab.id
                        ? "bg-[#070A0F] text-emerald-400 border-t-2 border-t-emerald-500"
                        : "text-gray-400 hover:bg-[#121622] hover:text-gray-200"
                    }`}
                    id={`tab-btn-${tab.id}`}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Tab Panel renderer */}
              <div className="flex-1 min-h-[500px]">
                {activeTab === "resumen" && <SummaryTab report={selectedReport} />}
                {activeTab === "tesis" && <ThesisTab report={selectedReport} />}
                {activeTab === "fundamentos" && <FundamentalsTab report={selectedReport} />}
                {activeTab === "valoracion" && (
                  <ValuationTab
                    report={selectedReport}
                    customWacc={customWacc}
                    setCustomWacc={setCustomWacc}
                    customG={customG}
                    setCustomG={setCustomG}
                  />
                )}
                {activeTab === "competidores" && <CompetitorsTab report={selectedReport} />}
                {activeTab === "premium" && <PremiumTab report={selectedReport} />}
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* Terminal Footer */}
      <footer className="border-t border-[#1E2533] bg-[#0E121B] px-6 py-3 font-mono text-[10px] text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" id="terminal-footer">
        <div>
          <span>EQUITY RESEARCH PRO // REGULADO POR EL COMITÉ DE INVERSIÓN INSTITUCIONAL</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> NODO ONLINE
          </span>
          <span>© 2026 EQUITY RESEARCH INC.</span>
        </div>
      </footer>
    </div>
  );
}