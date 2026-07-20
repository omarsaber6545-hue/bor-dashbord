'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, Shield, CheckSquare, Square, Copy, Check, ExternalLink, Info, Sparkles, Layers } from 'lucide-react';
import { api } from '../../lib/api';
import { DISCORD_PERMISSIONS, DISCORD_SCOPES } from '../../lib/constants';

export default function OAuthPage() {
  const [botStatus, setBotStatus] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'SEND_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
  ]);
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['bot', 'applications.commands']);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBotInfo();
  }, []);

  useEffect(() => {
    generateInvite();
  }, [selectedPermissions, selectedScopes, botStatus]);

  const fetchBotInfo = async () => {
    try {
      const res = await api.get('/bot/status');
      if (res.data.success) {
        setBotStatus(res.data.data);
      }
    } catch {
      // Offline
    }
  };

  const generateInvite = async () => {
    if (!botStatus?.botId) return;
    try {
      const res = await api.post('/oauth/invite-url', {
        clientId: botStatus.botId,
        permissions: selectedPermissions,
        scopes: selectedScopes,
      });
      if (res.data.success) {
        setGeneratedUrl(res.data.inviteUrl);
      }
    } catch {
      // Fallback url build
    }
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const toggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    );
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Bot Info & OAuth2 Invite Generator <KeyRound className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400">Interactive Scope & Permission Calculator for Official Discord Invites</p>
        </div>
      </div>

      {/* Bot Info Application Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Application Client ID</span>
          <span className="text-sm font-bold text-indigo-400 font-mono">{botStatus?.botId || 'Connect bot first'}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Public Bot Status</span>
          <span className="text-sm font-bold text-emerald-400">{botStatus?.publicBot ? 'Public Application' : 'Private Application'}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Message Content Intent</span>
          <span className={`text-sm font-bold ${botStatus?.intents?.messageContent ? 'text-emerald-400' : 'text-amber-400'}`}>
            {botStatus?.intents?.messageContent ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Installed Guild Count</span>
          <span className="text-sm font-bold text-white font-mono">{botStatus?.metrics?.guildCount || 0} servers</span>
        </div>
      </div>

      {/* Interactive Generator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Permission Checkboxes Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scopes Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> OAuth2 Scopes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DISCORD_SCOPES.map((sc) => {
                const isSelected = selectedScopes.includes(sc.id);
                return (
                  <button
                    key={sc.id}
                    onClick={() => toggleScope(sc.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" /> : <Square className="w-4 h-4 shrink-0" />}
                    <span>{sc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Bot Permissions
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPermissions(DISCORD_PERMISSIONS.map((p) => p.id))}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => setSelectedPermissions([])}
                  className="text-[11px] text-slate-400 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {DISCORD_PERMISSIONS.map((perm) => {
                const isSelected = selectedPermissions.includes(perm.id);
                return (
                  <button
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2.5 transition ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{perm.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live URL Result Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 sticky top-6 shadow-xl">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Generated Invite Link
            </h3>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 break-all leading-relaxed">
              {generatedUrl || 'Connect bot to calculate URL...'}
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCopy}
                disabled={!generatedUrl}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Invite URL'}</span>
              </button>

              {generatedUrl && (
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition"
                >
                  <ExternalLink className="w-4 h-4" /> Authorize in Discord
                </a>
              )}
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Invites use official Discord OAuth2 endpoints and respect specified permission bitfields.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
