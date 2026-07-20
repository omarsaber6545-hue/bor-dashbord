'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, Database, Shield, Zap, Terminal } from 'lucide-react';

export default function ExportCenterPage() {
  const [dataset, setDataset] = useState('commands');
  const [format, setFormat] = useState('json');

  const handleExport = () => {
    const downloadUrl = `http://localhost:5000/api/export?type=${dataset}&format=${format}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Data Export Center <Download className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Multi-Format Telemetry & Audit Log Exporters (JSON / CSV)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Configuration Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Export Settings & Filters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Dataset to Export</label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setDataset('commands')}
                  className={`p-3 rounded-xl border text-left text-xs flex items-center gap-3 transition ${
                    dataset === 'commands'
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-semibold">Command Usage History</div>
                    <div className="text-[10px] text-slate-400">Recorded slash command execution metrics & durations</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDataset('events')}
                  className={`p-3 rounded-xl border text-left text-xs flex items-center gap-3 transition ${
                    dataset === 'events'
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold">Live Gateway Events Payload</div>
                    <div className="text-[10px] text-slate-400">Socket.IO real-time Gateway event logs</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDataset('audit')}
                  className={`p-3 rounded-xl border text-left text-xs flex items-center gap-3 transition ${
                    dataset === 'audit'
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold">Security Audit Trail Logs</div>
                    <div className="text-[10px] text-slate-400">Authentication, role changes & settings modifications</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Export File Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('json')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    format === 'json'
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <FileJson className="w-4 h-4" /> Standard JSON
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    format === 'csv'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" /> CSV Spreadsheet
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" /> Export Selected Dataset ({format.toUpperCase()})
          </button>
        </div>

        {/* Format Preview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileJson className="w-4 h-4 text-sky-400" /> Export Format Specification
          </h3>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto console-scrollbar">
            {format === 'json' ? (
              <pre>{`[
  {
    "id": "cm_849201",
    "commandName": "ping",
    "guildName": "Official Support Server",
    "durationMs": 42,
    "success": true,
    "timestamp": "2026-07-20T01:30:00.000Z"
  }
]`}</pre>
            ) : (
              <pre>{`id,commandName,guildName,durationMs,success,timestamp
"cm_849201","ping","Official Support Server",42,true,"2026-07-20T01:30:00.000Z"`}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
