import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getStatsHistory = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const history = await prisma.telemetry.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    const formatted = history.reverse().map((t) => ({
      timestamp: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      hostCpu: t.hostCpuPercent,
      hostRam: t.hostRamPercent,
      nodeHeap: t.nodeHeapUsedMb,
      nodeRss: t.nodeRssMb,
      ping: t.discordPingMs,
      guilds: t.guildCount,
      users: t.userCount,
      eventsPerMinute: t.eventsPerMinute,
      errorCount: t.errorCount,
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
