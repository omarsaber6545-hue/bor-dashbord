'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Filter, Download, Trash2, ArrowDown, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import { getSocket } from '../../lib/socket';

interface LogItem {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TRACE';
  source: string;
  message: string;
  metadata?: any;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLogs();

    const socket = getSocket();
    socket.on('log:entry', (entry: LogItem) => {
      setLogs((prev) => [...prev, entry]);
    });

    return () => {
      socket.off('log:entry');
    };
  }, []);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/logs');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch {
      // Handle error
    }
  };

  const handleExport = (format: 'json' | 'txt') => {
    window.open(`http://localhost:5000/api/logs/export?format=${format}`, '_blank');
  };

  const handleClear = async () => {
    try {
      await api.delete('/logs');
      setLogs([]);
    } catch {
      setLogs([]);
    }
  };

  const filtered = logs.filter((l) => {
    const matchesLevel = filterLevel === 'ALL' || l.level === filterLevel;
    const matchesSearch =
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.source.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-rose-400 font-bold';
      case 'WARN':
        return 'text-amber-400 font-bold';
      case 'INFO':
        return 'text-sky-400 font-semibold';
      case 'DEBUG':
        return 'text-emerald-400';
      case 'TRACE':
        return 'text-purple-400';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            VSCode Live Console & Structured Logs <Terminal className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">High-Performance Terminal Stream & File Exporter</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search console logs..."
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
          </select>

          <button
            onClick={() => handleExport('txt')}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export TXT
          </button>

          <button
            onClick={() => handleExport('json')}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>

          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 hover:bg-rose-500/20 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* VSCode Monospace Terminal Body */}
      <div className="bg-[#0b0e14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Terminal Header Bar */}
        <div className="px-4 py-2.5 bg-[#121722] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[11px] text-slate-400 font-semibold">Terminal Output — {filtered.length} entries</span>
          </div>

          <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
            />
            <span>Auto-Scroll</span>
          </label>
        </div>

        {/* Log Lines Container */}
        <div className="p-4 h-[550px] overflow-y-auto space-y-1 console-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-slate-600 text-center py-40 select-none">
              Console stream initialized. Awaiting system logs...
            </div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className="hover:bg-slate-900/60 py-0.5 px-2 rounded flex items-start gap-3 leading-relaxed">
                <span className="text-slate-500 shrink-0 select-none">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className={`w-14 shrink-0 uppercase select-none ${getLevelColor(log.level)}`}>
                  [{log.level}]
                </span>
                <span className="text-indigo-400 shrink-0 select-none">[{log.source}]</span>
                <span className="text-slate-200 flex-1 break-all">{log.message}</span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
