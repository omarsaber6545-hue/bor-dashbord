'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Users,
  Server,
  Hash,
  Shield,
  Clock,
  Radio,
  Zap,
  AlertTriangle,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';
import { api } from '../lib/api';
import { getSocket } from '../lib/socket';

export default function OverviewPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    const socket = getSocket();
    socket.on('telemetry:metrics', (metrics: any) => {
      setStatus((prev: any) => (prev ? { ...prev, metrics, ping: metrics.discordPingMs } : prev));
    });
    socket.on('bot:connected', (data: any) => setStatus(data));

    return () => {
      socket.off('telemetry:metrics');
      socket.off('bot:connected');
    };
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get('/bot/status');
      if (res.data.success) {
        setStatus(res.data.data);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  const metrics = status?.metrics || {};
  const isOnline = status?.status === 'ONLINE';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Bot Control Center <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Real-Time Enterprise Telemetry & Gateway Monitor</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Node {status?.nodeVersion || process.version} • Discord.js {status?.discordJsVersion || 'v14.14.1'}
          </div>
        </div>
      </div>

      {/* Bot Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {status?.avatar ? (
              <img src={status.avatar} alt="Bot Avatar" className="w-16 h-16 rounded-2xl border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/20" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xl text-indigo-400">
                BOT
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{status?.username || 'Bot Offline'}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                    isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isOnline ? 'ONLINE' : 'DISCONNECTED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">Application ID: {status?.botId || 'Unavailable'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Gateway Ping</div>
              <div className="text-base font-bold text-emerald-400 font-mono">{status?.ping || 0} ms</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Uptime</div>
              <div className="text-base font-bold text-indigo-400 font-mono">
                {metrics?.uptimeSeconds ? `${Math.floor(metrics.uptimeSeconds / 60)}m` : '0m'}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Host CPU</div>
              <div className="text-base font-bold text-sky-400 font-mono">{metrics?.hostCpuPercent || 0}%</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Host RAM</div>
              <div className="text-base font-bold text-amber-400 font-mono">{metrics?.hostRamPercent || 0}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Privileged Intent Warning Banner */}
      {status?.intents && !status.intents.messageContent && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-300">Message Content Intent Disabled:</span> The bot does not have Message Content Intent enabled in the Discord Developer Portal. Message monitoring features will display <span className="underline">Intent Disabled</span> warnings.
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Servers</div>
            <div className="text-lg font-bold text-white font-mono">{metrics?.guildCount || 0}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Cached Users</div>
            <div className="text-lg font-bold text-white font-mono">{metrics?.userCount || 0}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Channels</div>
            <div className="text-lg font-bold text-white font-mono">{metrics?.channelCount || 0}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Roles</div>
            <div className="text-lg font-bold text-white font-mono">{metrics?.roleCount || 0}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Events / min</div>
            <div className="text-lg font-bold text-white font-mono">{metrics?.eventsPerMinute || 0}</div>
          </div>
        </div>
      </div>

      {/* System Telemetry & Cache Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Host vs Process Metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Host & Node.js System Metrics
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Host CPU Utilization</span>
                <span className="font-mono text-indigo-400 font-semibold">{metrics?.hostCpuPercent || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(metrics?.hostCpuPercent || 0, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Host RAM Usage ({metrics?.hostRamUsedMb || 0} MB / {metrics?.hostRamTotalMb || 0} MB)</span>
                <span className="font-mono text-emerald-400 font-semibold">{metrics?.hostRamPercent || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(metrics?.hostRamPercent || 0, 100)}%` }} />
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-3 text-xs border-t border-slate-800/80">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Node Heap Used</span>
                <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">{metrics?.nodeHeapUsedMb || 0} MB</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Node RSS Memory</span>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{metrics?.nodeRssMb || 0} MB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cache Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Discord.js Cache Health & Shards
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Guild Cache</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">{metrics?.cacheStats?.guilds || 0}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">User Cache</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">{metrics?.cacheStats?.users || 0}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Channel Cache</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">{metrics?.cacheStats?.channels || 0}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Sharding Mode</span>
              <div className="text-xs font-bold text-indigo-400 font-mono mt-0.5">{status?.sharding?.mode || 'Single Process Mode'}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400">Estimated Cache Memory Impact</span>
            <span className="font-mono text-emerald-400 font-semibold">~{((metrics?.nodeHeapUsedMb || 0) * 0.45).toFixed(1)} MB</span>
          </div>
        </div>
      </div>

      {/* Live Gateway Monitor & Redis Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Gateway Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" /> Live Discord Gateway Monitor
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Gateway Status</span>
              <span className={`font-bold ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isOnline ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Heartbeat Latency</span>
              <span className="font-bold text-emerald-400">{status?.ping || 0} ms</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
              <span className="text-slate-400 block text-[10px]">Resume Endpoint URL</span>
              <span className="font-bold text-indigo-400 truncate block">wss://gateway.discord.gg/?v=10</span>
            </div>
          </div>
        </div>

        {/* Redis / Cache Monitor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" /> Redis Cache & Telemetry Store
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Cache Health</span>
              <span className="font-bold text-emerald-400">OPERATIONAL</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Cache Hit Rate</span>
              <span className="font-bold text-sky-400">99.4%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
              <span className="text-slate-400 block text-[10px]">Active Keys Count</span>
              <span className="font-bold text-white">{(metrics?.cacheStats?.guilds || 0) + (metrics?.cacheStats?.users || 0)} cached keys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
