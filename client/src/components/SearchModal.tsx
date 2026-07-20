'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Server, Terminal, Shield, Hash } from 'lucide-react';
import { api } from '../lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [guilds, setGuilds] = useState<any[]>([]);
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gRes, cRes] = await Promise.all([
        api.get('/guilds').catch(() => ({ data: { data: [] } })),
        api.get('/commands').catch(() => ({ data: { data: [] } })),
      ]);
      setGuilds(gRes.data.data || []);
      setCommands(cRes.data.data || []);
    } catch {
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredGuilds = guilds.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()));
  const filteredCommands = commands.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search servers, slash commands, roles..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 console-scrollbar">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400">Searching system index...</div>
          ) : (
            <>
              {/* Guilds */}
              {filteredGuilds.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" /> Servers ({filteredGuilds.length})
                  </div>
                  <div className="space-y-1">
                    {filteredGuilds.map((g) => (
                      <div
                        key={g.id}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          {g.icon ? (
                            <img src={g.icon} alt={g.name} className="w-7 h-7 rounded-full" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-600/30 flex items-center justify-center font-bold text-xs text-indigo-400">
                              {g.name.substring(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-semibold text-white">{g.name}</div>
                            <div className="text-[11px] text-slate-400">{g.memberCount} members • Owner: {g.ownerTag}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commands */}
              {filteredCommands.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Slash Commands ({filteredCommands.length})
                  </div>
                  <div className="space-y-1">
                    {filteredCommands.map((c) => (
                      <div
                        key={c.id || c.name}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition"
                      >
                        <div>
                          <div className="text-xs font-semibold text-indigo-400">/{c.name}</div>
                          <div className="text-[11px] text-slate-400">{c.description}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {c.executionCount} execs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredGuilds.length === 0 && filteredCommands.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No matching records found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
