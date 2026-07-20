import { Server as SocketServer } from 'socket.io';

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  metadata?: Record<string, any>;
}

class LoggerService {
  private logsMemory: LogEntry[] = [];
  private maxLogs = 1000;
  private ioServer: SocketServer | null = null;

  public setSocketServer(io: SocketServer) {
    this.ioServer = io;
  }

  private emitLog(entry: LogEntry) {
    this.logsMemory.unshift(entry);
    if (this.logsMemory.length > this.maxLogs) {
      this.logsMemory.pop();
    }

    if (this.ioServer) {
      this.ioServer.emit('log:entry', entry);
    }
  }

  public log(level: LogLevel, source: string, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      metadata,
    };

    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.source}] ${entry.message}`;
    if (level === 'ERROR') console.error(formatted, metadata || '');
    else if (level === 'WARN') console.warn(formatted, metadata || '');
    else console.log(formatted, metadata || '');

    this.emitLog(entry);
  }

  public info(source: string, message: string, metadata?: Record<string, any>) {
    this.log('INFO', source, message, metadata);
  }

  public warn(source: string, message: string, metadata?: Record<string, any>) {
    this.log('WARN', source, message, metadata);
  }

  public error(source: string, message: string, metadata?: Record<string, any>) {
    this.log('ERROR', source, message, metadata);
  }

  public debug(source: string, message: string, metadata?: Record<string, any>) {
    this.log('DEBUG', source, message, metadata);
  }

  public trace(source: string, message: string, metadata?: Record<string, any>) {
    this.log('TRACE', source, message, metadata);
  }

  public getRecentLogs(query?: { level?: string; search?: string; limit?: number }): LogEntry[] {
    let filtered = [...this.logsMemory];

    if (query?.level && query.level !== 'ALL') {
      filtered = filtered.filter((l) => l.level === query.level?.toUpperCase());
    }

    if (query?.search) {
      const s = query.search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.message.toLowerCase().includes(s) ||
          l.source.toLowerCase().includes(s) ||
          JSON.stringify(l.metadata || {}).toLowerCase().includes(s)
      );
    }

    const limit = query?.limit || 200;
    return filtered.slice(0, limit);
  }

  public clearLogs() {
    this.logsMemory = [];
  }
}

export const logger = new LoggerService();
