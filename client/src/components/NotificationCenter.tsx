'use client';

import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    {
      id: '1',
      title: 'Gateway Telemetry Online',
      type: 'INFO',
      message: 'Discord Gateway WebSocket ping latency: 24ms',
      time: 'Just now',
    },
    {
      id: '2',
      title: 'AES-256-GCM Encryption Active',
      type: 'SUCCESS',
      message: 'Bot credentials encrypted and masked safely',
      time: '2m ago',
    },
    {
      id: '3',
      title: 'Message Content Intent',
      type: 'WARN',
      message: 'Check Discord Developer Portal if Message Content Intent is disabled',
      time: '5m ago',
    },
  ]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition relative"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-bold text-xs text-white">Notification Center</h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto console-scrollbar">
            {notifications.map((n) => (
              <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    {n.type === 'WARN' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
