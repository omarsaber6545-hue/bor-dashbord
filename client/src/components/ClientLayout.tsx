'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { ConnectBotModal } from './ConnectBotModal';
import { SearchModal } from './SearchModal';
import { getSocket } from '../lib/socket';
import { api } from '../lib/api';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [botStatus, setBotStatus] = useState<any>(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchBotStatus();

    const socket = getSocket();
    socket.on('bot:connected', (data) => setBotStatus(data));
    socket.on('bot:disconnected', () => fetchBotStatus());
    socket.on('telemetry:metrics', (metrics) => {
      setBotStatus((prev: any) => (prev ? { ...prev, metrics, ping: metrics.discordPingMs } : prev));
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      socket.off('bot:connected');
      socket.off('bot:disconnected');
      socket.off('telemetry:metrics');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchBotStatus = async () => {
    try {
      const res = await api.get('/bot/status');
      if (res.data.success) {
        setBotStatus(res.data.data);
      }
    } catch {
      // Ignore initial offline state
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex w-full">
      <Navigation
        botStatus={botStatus}
        onOpenConnectModal={() => setIsConnectOpen(true)}
        onOpenSearchModal={() => setIsSearchOpen(true)}
      />
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        {children}
      </main>

      <ConnectBotModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        onSuccess={fetchBotStatus}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
