import React from "react";
import { Search, Activity, RefreshCw } from "lucide-react";

interface ReportHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isLoading: boolean;
  onSelectTicker: (ticker: string) => void;
  activeTicker: string;
}

export default function ReportHeader({
  searchQuery,
  setSearchQuery,
  onSearch,
  isLoading,
  onSelectTicker,
  activeTicker,
}: ReportHeaderProps) {
  const popularTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "NFLX", "AMD", "JPM", "DIS"];

  return (
    <header className="border-b border-[#1E2533] bg-[#0E121B] px-6 py-4" id="terminal-header">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left Side: Brand and status indicators */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="font-display text-lg font-bold tracking-wider text-white">
              EQUITY RESEARCH PRO
            </h1>
            <span className="rounded bg-[#1E2533] px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
              INSTITUTIONAL v4.2
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-gray-500">
            <span>COMMITTEE TERMINAL</span>
            <span className="hidden sm:inline">•</span>
            <span>PORT: 3000 (INGRESS ACTIVE)</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-500">ACTIVE: GEMINI-3.5-FLASH + SEARCH</span>
          </div>
        </div>

        {/* Center: Quick preloaded toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1.5 font-mono text-[11px] text-gray-400">ACCIONES POPULARES:</span>
          {popularTickers.map((tick) => (
            <button
              key={tick}
              onClick={() => onSelectTicker(tick)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide transition-all ${
                activeTicker === tick
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                  : "bg-[#161B26] text-gray-300 border border-[#242C3E] hover:bg-[#1E2536] hover:text-white"
              }`}
              id={`ticker-btn-${tick}`}
              type="button"
            >
              {tick}
            </button>
          ))}
        </div>

        {/* Right Side: Command search line */}
        <form onSubmit={onSearch} className="flex items-center gap-2" id="search-form">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              placeholder="AAPL <EQUITY> GO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-[200px] rounded border border-[#242C3E] bg-[#0A0D14] py-1.5 pl-9 pr-3 font-mono text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-emerald-500 focus:shadow-[0_0_8px_rgba(16,185,129,0.15)]"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded bg-emerald-600 px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-50"
            id="go-btn"
          >
            {isLoading ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <span>GO</span>
            )}
          </button>
        </form>
      </div>
    </header>
  );
}
