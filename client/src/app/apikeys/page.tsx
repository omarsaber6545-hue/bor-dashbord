'use client';

import React, { useState, useEffect } from 'react';
import { Key, Plus, CheckCircle2, RefreshCw, Copy, Check, Shield, Lock } from 'lucide-react';
import { api } from '../../lib/api';

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await api.get('/apikeys');
      if (res.data.success) {
        setKeys(res.data.data);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await api.post('/apikeys', {
        name,
        permissions: ['READ_TELEMETRY', 'READ_LOGS', 'READ_GUILDS'],
      });
      if (res.data.success) {
        setNewKeyRaw(res.data.apiKey);
        setName('');
        fetchKeys();
      }
    } catch {
      // Error
    }
  };

  const handleCopy = () => {
    if (!newKeyRaw) return;
    navigator.clipboard.writeText(newKeyRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            API Key & Token Manager <Key className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Generate, Scrape & Rotate Secure Access Credentials for Programmatic REST APIs</p>
        </div>

        <button
          onClick={fetchKeys}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Keys
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generate Key Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl h-fit">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" /> Generate New API Key
          </h3>

          {newKeyRaw && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
              <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> API Key Generated!
              </div>
              <p className="text-[11px] text-slate-300">Copy your API key now. It will not be shown again:</p>
              <div className="p-2 bg-slate-950 rounded-lg font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                <span className="truncate">{newKeyRaw}</span>
                <button onClick={handleCopy} className="p-1 text-slate-300 hover:text-white shrink-0">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Key Name / Service</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Datadog Ingestion Key"
                required
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
            >
              <Key className="w-4 h-4" /> Generate Access Key
            </button>
          </form>
        </div>

        {/* API Keys Table List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Active API Keys
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Key Name</th>
                  <th className="p-3">Prefix</th>
                  <th className="p-3">Permissions</th>
                  <th className="p-3">Last Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-semibold text-white font-sans">{k.name}</td>
                    <td className="p-3 text-sky-400">{k.keyPrefix}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {k.permissions.map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 text-[9px] border border-slate-800">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(k.lastUsedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
