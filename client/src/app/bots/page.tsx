'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Plus, Play, Square, Trash2, RefreshCw, CheckCircle2, XCircle, Server, Radio, Clock, Shield } from 'lucide-react';
import { api } from '../../lib/api';

interface BotItem {
  id: string;
  botId: string;
  username: string;
  avatar: string;
  status: string;
  ping: number;
  uptimeSeconds: number;
  guildCount: number;
  createdAt: string;
}

export default function BotsOverviewPage() {
  const [bots, setBots] = useState<BotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bots');
      if (res.data.success) {
        setBots(res.data.data);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (id: string) => {
    try {
      const res = await api.post(`/bots/${id}/start`);
      if (res.data.success) {
        setActionMsg('Bot instance connected successfully!');
        fetchBots();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch {
      // Error
    }
  };

  const handleStop = async (id: string) => {
    try {
      const res = await api.post(`/bots/${id}/stop`);
      if (res.data.success) {
        setActionMsg('Bot instance disconnected.');
        fetchBots();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch {
      // Error
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/bots/${id}`);
      if (res.data.success) {
        setActionMsg('Bot removed from cluster.');
        fetchBots();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch {
      // Error
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Multi-Bot Management Platform <Bot className="w-6 h-6 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Independent Telemetry, Isolated Gateways & Multi-Bot Cluster Fleet</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBots}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Cluster
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Scanning active Discord bot cluster...</div>
      ) : bots.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xl">
          <Bot className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Discord Bots Connected</h3>
          <p className="text-xs text-slate-400">Use the quick connect modal in the navigation sidebar to register your first bot token.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((b) => {
            const isOnline = b.status === 'ONLINE';
            return (
              <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={b.avatar} alt="Bot Avatar" className="w-12 h-12 rounded-xl border-2 border-indigo-500/30" />
                    <div>
                      <h3 className="font-bold text-sm text-white">{b.username}</h3>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {b.botId}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center pt-2 border-t border-slate-800">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">Ping</span>
                    <span className="font-bold text-emerald-400">{b.ping} ms</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">Guilds</span>
                    <span className="font-bold text-sky-400">{b.guildCount}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">Uptime</span>
                    <span className="font-bold text-indigo-400">{Math.floor(b.uptimeSeconds / 60)}m</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
                  {isOnline ? (
                    <button
                      onClick={() => handleStop(b.id)}
                      className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-800 text-rose-400 text-xs font-semibold rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 transition"
                    >
                      <Square className="w-3.5 h-3.5 fill-rose-400" /> Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStart(b.id)}
                      className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Connect
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded-xl border border-slate-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
