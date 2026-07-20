'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Search, Filter, Shield, Clock, Check, X, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';

export default function CommandsPage() {
  const [commands, setCommands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ENABLED' | 'DISABLED'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      const res = await api.get('/commands');
      if (res.data.success) {
        setCommands(res.data.data);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (cmd: any) => {
    const newEnabled = !cmd.enabled;
    setCommands((prev) => prev.map((c) => (c.name === cmd.name ? { ...c, enabled: newEnabled } : c)));

    try {
      await api.post('/commands/config', {
        commandName: cmd.name,
        enabled: newEnabled,
        category: cmd.category,
      });
    } catch {
      // Revert on error
      setCommands((prev) => prev.map((c) => (c.name === cmd.name ? { ...c, enabled: !newEnabled } : c)));
    }
  };

  const categories = Array.from(new Set(commands.map((c) => c.category || 'SlashCommand')));

  const filtered = commands.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'ENABLED' && c.enabled) || (filterStatus === 'DISABLED' && !c.enabled);
    const matchesCategory = filterCategory === 'ALL' || c.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Slash Commands Control ({commands.length})
          </h1>
          <p className="text-xs text-slate-400">Internal Telemetry & Global Permission Management</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands..."
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e: any) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ENABLED">Enabled Only</option>
            <option value="DISABLED">Disabled Only</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Inspecting registered Discord slash commands...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Terminal className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Commands Found</h3>
          <p className="text-xs text-slate-400">Ensure the connected bot has registered global or guild slash commands.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Command</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Permissions</th>
                  <th className="p-4">Telemetry Executions</th>
                  <th className="p-4">Last Execution</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((cmd) => (
                  <tr key={cmd.name} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-indigo-400 font-mono text-sm">/{cmd.name}</div>
                      <div className="text-slate-400 text-[11px] max-w-sm truncate">{cmd.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium text-[11px]">
                        {cmd.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {cmd.permissions.map((p: string) => (
                          <span key={p} className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-900 text-indigo-300 font-mono text-[10px]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {cmd.executionCount}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {cmd.lastUsed}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cmd.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {cmd.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggle(cmd)}
                        className={`p-1.5 rounded-xl transition ${
                          cmd.enabled ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        {cmd.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
