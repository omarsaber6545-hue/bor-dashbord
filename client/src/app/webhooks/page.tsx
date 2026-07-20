'use client';

import React, { useState, useEffect } from 'react';
import { Webhook, Plus, CheckCircle2, RefreshCw, Radio, Link as LinkIcon, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';

interface WebhookItem {
  id: string;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  lastTriggered: string;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/webhooks');
      if (res.data.success) {
        setWebhooks(res.data.data);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    try {
      const res = await api.post('/webhooks', {
        name,
        url,
        events: ['BOT_DISCONNECT', 'HIGH_CPU_ALERT', 'ERROR_LOGGED'],
      });
      if (res.data.success) {
        setMsg(`Webhook "${name}" registered successfully!`);
        setName('');
        setUrl('');
        fetchWebhooks();
        setTimeout(() => setMsg(null), 3000);
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
            Outgoing Webhook Manager <Webhook className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Stream Live Telemetry, Gateway Events & System Alerts to Slack, Discord or Datadog</p>
        </div>

        <button
          onClick={fetchWebhooks}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Webhooks
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Register Webhook Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl h-fit">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" /> Register Outgoing Webhook
          </h3>

          {msg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Webhook Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Slack Security Alert Bridge"
                required
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Endpoint URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                required
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
            >
              <Webhook className="w-4 h-4" /> Register Endpoint
            </button>
          </form>
        </div>

        {/* Registered Webhooks List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" /> Registered Webhook Subscribers
          </h3>

          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div key={wh.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-sky-400" />
                    {wh.name}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ACTIVE
                  </span>
                </div>

                <div className="font-mono text-slate-400 text-[11px] truncate">{wh.url}</div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {wh.events.map((ev) => (
                      <span key={ev} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[9px] font-mono border border-slate-800">
                        {ev}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Last triggered: {new Date(wh.lastTriggered).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
