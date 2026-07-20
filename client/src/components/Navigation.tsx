'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  Terminal,
  Activity,
  BarChart3,
  KeyRound,
  Settings as SettingsIcon,
  Search,
  Bot,
  Zap,
  CheckCircle2,
  XCircle,
  AlertOctagon,
} from 'lucide-react';

import { NotificationCenter } from './NotificationCenter';

interface NavigationProps {
  botStatus?: any;
  onOpenConnectModal: () => void;
  onOpenSearchModal: () => void;
}

export function Navigation({ botStatus, onOpenConnectModal, onOpenSearchModal }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Bot Fleet', href: '/bots', icon: Bot },
    { name: 'Servers', href: '/guilds', icon: Server },
    { name: 'Commands', href: '/commands', icon: Terminal },
    { name: 'Live Events', href: '/events', icon: Zap },
    { name: 'System Monitor', href: '/system', icon: Activity },
    { name: 'VSCode Console', href: '/logs', icon: Activity },
    { name: 'Analytics', href: '/stats', icon: BarChart3 },
    { name: 'Error Center', href: '/errors', icon: AlertOctagon },
    { name: 'User & RBAC', href: '/users', icon: KeyRound },
    { name: 'Webhooks', href: '/webhooks', icon: KeyRound },
    { name: 'API Keys', href: '/apikeys', icon: KeyRound },
    { name: 'Export Center', href: '/export', icon: KeyRound },
    { name: 'Bot Info & OAuth', href: '/oauth', icon: KeyRound },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  const isOnline = botStatus?.status === 'ONLINE';

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white">Bot Control Center</h1>
            <p className="text-xs text-slate-400 font-medium">Enterprise Dashboard</p>
          </div>
        </div>
        <NotificationCenter />
      </div>

      {/* Bot Connection Quick Pill */}
      <div className="p-3 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-xs font-semibold text-slate-200">
              {isOnline ? 'Bot Online' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={onOpenConnectModal}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
          >
            {isOnline ? 'Change' : 'Connect'}
          </button>
        </div>
        {isOnline && (
          <div className="text-xs text-slate-400 truncate">
            <span className="text-indigo-400 font-medium">{botStatus.username}</span> ({botStatus.ping}ms)
          </div>
        )}
      </div>

      {/* Search Bar Button Trigger */}
      <div className="px-3 mb-2">
        <button
          onClick={onOpenSearchModal}
          className="w-full flex items-center justify-between px-3 py-2 text-xs bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-lg text-slate-400 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search anything...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation Items List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Details */}
      <div className="p-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
        Discord.js v14 • Node.js {process.version}
      </div>
    </aside>
  );
}
