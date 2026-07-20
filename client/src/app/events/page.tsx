'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, Trash2, Search, Filter, Shield, AlertTriangle, X, Copy, Check } from 'lucide-react';
import { getSocket } from '../../lib/socket';

interface GatewayEventItem {
  id: string;
  eventName: string;
  guildId: string | null;
  details: string;
  timestamp: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<GatewayEventItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('ALL');
  const [inspectEvent, setInspectEvent] = useState<GatewayEventItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const handleEvent = (data: GatewayEventItem) => {
      if (!isPaused) {
        setEvents((prev) => [data, ...prev.slice(0, 199)]);
      }
    };

    socket.on('discord:event', handleEvent);
    return () => {
      socket.off('discord:event', handleEvent);
    };
  }, [isPaused]);

  const getEventBadgeColor = (name: string) => {
    if (name.includes('error') || name.includes('Delete')) return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (name.includes('warn') || name.includes('Disconnect')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (name.includes('Create') || name.includes('ready') || name.includes('Add')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
  };

  const filtered = events.filter((e) => {
    const matchesSearch = e.eventName.toLowerCase().includes(search.toLowerCase()) || e.details.toLowerCase().includes(search.toLowerCase());
    const matchesEvent = selectedEvent === 'ALL' || e.eventName === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  const eventTypes = Array.from(new Set(events.map((e) => e.eventName)));

  const handleCopy = () => {
    if (!inspectEvent) return;
    navigator.clipboard.writeText(JSON.stringify(inspectEvent, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Live Gateway Event Stream <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          </h1>
          <p className="text-xs text-slate-400">Real-Time Socket.IO Pipeline & Event Inspector</p>
        </div>

        {/* Controls & Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            {eventTypes.map((et) => (
              <option key={et} value={et}>{et}</option>
            ))}
          </select>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              isPaused ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>

          <button
            onClick={() => setEvents([])}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event payload..."
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Events Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 min-h-[500px]">
        {filtered.length === 0 ? (
          <div className="text-center py-32 text-xs text-slate-500">
            Waiting for live Discord Gateway events... interact with the bot or join/leave voice channels to see real-time updates.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((e) => (
              <div
                key={e.id}
                onClick={() => setInspectEvent(e)}
                className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs hover:border-indigo-500/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border uppercase ${getEventBadgeColor(e.eventName)}`}>
                    {e.eventName}
                  </span>
                  <span className="text-slate-300 font-medium">{e.details}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                  {e.guildId && <span>Guild: {e.guildId}</span>}
                  <span>{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Inspector Modal */}
      {inspectEvent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${getEventBadgeColor(inspectEvent.eventName)}`}>
                  {inspectEvent.eventName}
                </span>
                <span className="text-xs font-bold text-white">Event Payload Inspector</span>
              </div>
              <button onClick={() => setInspectEvent(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto console-scrollbar max-h-80">
                <pre>{JSON.stringify(inspectEvent, null, 2)}</pre>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Timestamp: {new Date(inspectEvent.timestamp).toLocaleString()}</span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Payload' : 'Copy Payload JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
