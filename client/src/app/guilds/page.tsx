'use client';

import React, { useState, useEffect } from 'react';
import { Server, Users, Hash, Shield, Crown, Lock, KeyRound, Sparkles, Volume2, Folder, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';

export default function GuildsPage() {
  const [guilds, setGuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuilds();
  }, []);

  const fetchGuilds = async () => {
    try {
      const res = await api.get('/guilds');
      if (res.data.success) {
        setGuilds(res.data.data);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Connected Servers ({guilds.length})
          </h1>
          <p className="text-xs text-slate-400">Detailed Guild Infrastructure & Permission Breakdown</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading server topology...</div>
      ) : guilds.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Server className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Servers Accessible</h3>
          <p className="text-xs text-slate-400">Connect a bot or invite it to servers to inspect guild infrastructure.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map((guild) => (
            <div
              key={guild.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-indigo-500/40 transition shadow-xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                {guild.icon ? (
                  <img src={guild.icon} alt={guild.name} className="w-14 h-14 rounded-2xl border border-slate-700" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center font-bold text-lg text-indigo-400">
                    {guild.name.substring(0, 2)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white truncate">{guild.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate">ID: {guild.id}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium mt-0.5">
                    <Crown className="w-3.5 h-3.5" /> Owner: {guild.ownerTag}
                  </div>
                </div>
              </div>

              {/* Server Metrics Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-[10px] text-slate-400">Members</div>
                    <div className="font-bold text-white font-mono">{guild.memberCount}</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-[10px] text-slate-400">Boost Tier</div>
                    <div className="font-bold text-white font-mono">Tier {guild.premiumTier}</div>
                  </div>
                </div>
              </div>

              {/* Channels Breakdown */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-300 text-[11px]">Channel Breakdown ({guild.channelCount})</div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-center">
                  <div className="p-1.5 rounded bg-slate-900 text-sky-400">
                    <Hash className="w-3 h-3 inline mr-1" /> {guild.textChannels} Text
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 text-emerald-400">
                    <Volume2 className="w-3 h-3 inline mr-1" /> {guild.voiceChannels} Voice
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 text-amber-400">
                    <Folder className="w-3 h-3 inline mr-1" /> {guild.categoryCount} Categories
                  </div>
                </div>
              </div>

              {/* Features & Counts */}
              <div className="grid grid-cols-3 gap-2 text-[11px] text-center text-slate-300">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Roles</span>
                  <span className="font-bold font-mono text-indigo-400">{guild.roleCount}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Emojis</span>
                  <span className="font-bold font-mono text-purple-400">{guild.emojiCount}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Stickers</span>
                  <span className="font-bold font-mono text-pink-400">{guild.stickerCount}</span>
                </div>
              </div>

              {/* Invites Status Badge */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Invites:</span>
                {guild.invitesStatus === 'OK' ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                    {guild.inviteCount} active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-semibold border border-rose-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Permission Required
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
