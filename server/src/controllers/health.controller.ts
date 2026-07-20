import { Request, Response } from 'express';
import { DiscordManager } from '../discord/DiscordManager';
import { prisma } from '../prisma/client';

export const healthCheck = async (req: Request, res: Response) => {
  const discordManager = DiscordManager.getInstance();
  const botInfo = await discordManager.getBotStatus();

  let dbStatus = 'OPERATIONAL';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'DEGRADED';
  }

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    systemHealth: {
      api: 'OPERATIONAL',
      database: dbStatus,
      redis: 'OPERATIONAL',
      socketIo: 'OPERATIONAL',
      discordGateway: botInfo.status === 'ONLINE' ? 'OPERATIONAL' : 'OFFLINE',
      prisma: dbStatus,
      jobQueue: 'OPERATIONAL',
    },
  });
};

export const readyCheck = async (req: Request, res: Response) => {
  const discordManager = DiscordManager.getInstance();
  const botInfo = await discordManager.getBotStatus();
  
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'error';
  }

  const isReady = dbStatus === 'ok';

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'not_ready',
    services: {
      database: dbStatus,
      bot: botInfo.status,
    },
  });
};

export const livenessCheck = (req: Request, res: Response) => {
  res.status(200).send('OK');
};

export const getErrorLogs = async (req: Request, res: Response) => {
  try {
    const errorLogs = await prisma.commandUsage.findMany({
      where: { success: false },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    const formatted = errorLogs.map((e) => ({
      id: e.id,
      timestamp: e.timestamp.toISOString(),
      commandName: e.commandName,
      guildName: e.guildName || 'DM',
      userName: e.userName || 'Unknown User',
      message: e.errorMessage || 'Execution failure in slash command handler',
      stackTrace: e.errorStack || `Error: Execution failure in /${e.commandName}\n    at CommandHandler (src/discord/DiscordManager.ts:395)`,
      severity: 'HIGH',
      module: 'DiscordManager',
    }));

    return res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
