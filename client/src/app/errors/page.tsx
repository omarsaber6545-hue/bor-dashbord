'use client';

import React, { useState, useEffect } from 'react';
import { AlertOctagon, RefreshCw, Copy, Check, Download, ChevronRight, ShieldAlert, Terminal } from 'lucide-react';
import { api } from '../../lib/api';

interface ErrorItem {
  id: string;
  timestamp: string;
  commandName?: string;
  guildName?: string;
  userName?: string;
  message: string;
  stackTrace: string;
  severity: string;
  module: string;
}

export default function ErrorCenterPage() {
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedError, setSelectedError] = useState<ErrorItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/errors');
      if (res.data.success) {
        setErrors(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedError(res.data.data[0]);
        }
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!selectedError) return;
    navigator.clipboard.writeText(selectedError.stackTrace || selectedError.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!selectedError) return;
    const blob = new Blob([JSON.stringify(selectedError, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-${selectedError.id}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Enterprise Error Center <AlertOctagon className="w-5 h-5 text-rose-400" />
          </h1>
          <p className="text-xs text-slate-400">Recorded Exception Stack Traces & Diagnostic Diagnostics</p>
        </div>

        <button
          onClick={fetchErrors}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Diagnostics
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Scanning exception diagnostic logs...</div>
      ) : errors.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xl">
          <ShieldAlert className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Active System Errors</h3>
          <p className="text-xs text-slate-400">The gateway pipeline, slash commands, and REST APIs are operating with 100% clean success.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Error List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 h-[600px] overflow-y-auto console-scrollbar">
            {errors.map((err) => {
              const isSelected = selectedError?.id === err.id;
              return (
                <div
                  key={err.id}
                  onClick={() => setSelectedError(err)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition space-y-1.5 ${
                    isSelected
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-400 font-mono text-[11px] truncate">
                      {err.commandName ? `/${err.commandName}` : 'Gateway Exception'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[9px] uppercase border border-rose-500/30">
                      {err.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate font-mono">{err.message}</p>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>{err.guildName}</span>
                    <span>{new Date(err.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stack Trace Inspector Detail */}
          {selectedError && (
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-rose-400" />
                      {selectedError.commandName ? `Exception in /${selectedError.commandName}` : 'System Exception'}
                    </h3>
                    <p className="text-xs text-slate-400">Module: {selectedError.module} • Guild: {selectedError.guildName}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(selectedError.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200 text-xs font-mono">
                  {selectedError.message}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">Full Call Stack Trace</h4>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto console-scrollbar max-h-80 leading-relaxed">
                    <pre>{selectedError.stackTrace}</pre>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={fetchErrors}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Execution
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Stack'}</span>
                  </button>

                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Export JSON
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
