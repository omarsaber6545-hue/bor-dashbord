import { Request, Response } from 'express';
import { z } from 'zod';
import { DiscordManager } from '../discord/DiscordManager';
import { prisma } from '../prisma/client';

const connectSchema = z.object({
  token: z.string().min(10, 'Bot token is required'),
  clientSecret: z.string().optional(),
});

export const connectBot = async (req: Request, res: Response) => {
  try {
    const validated = connectSchema.parse(req.body);
    const discordManager = DiscordManager.getInstance();

    const result = await discordManager.connectBot(validated.token, validated.clientSecret);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const disconnectBot = async (req: Request, res: Response) => {
  try {
    const discordManager = DiscordManager.getInstance();
    await discordManager.disconnectBot();
    return res.status(200).json({ success: true, message: 'Bot disconnected successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getBotStatus = async (req: Request, res: Response) => {
  try {
    const discordManager = DiscordManager.getInstance();
    const status = await discordManager.getBotStatus();
    return res.status(200).json({ success: true, data: status });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllBots = async (req: Request, res: Response) => {
  try {
    const bots = await prisma.botConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const discordManager = DiscordManager.getInstance();
    const currentStatus = await discordManager.getBotStatus();

    const formatted = bots.map((b: any) => {
      const isCurrentActive = currentStatus.botId === b.botId && currentStatus.status === 'ONLINE';
      return {
        id: b.id,
        botId: b.botId || b.clientId || 'N/A',
        username: b.botUsername || 'Discord Bot',
        avatar: b.botAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
        status: isCurrentActive ? 'ONLINE' : (b.status || 'DISCONNECTED'),
        ping: isCurrentActive ? currentStatus.ping : 0,
        uptimeSeconds: isCurrentActive ? (currentStatus.metrics?.uptimeSeconds || 0) : 0,
        guildCount: isCurrentActive ? (currentStatus.metrics?.guildCount || 0) : 0,
        createdAt: b.createdAt.toISOString(),
      };
    });

    // Fallback if no database bots exist yet but a bot is connected
    if (formatted.length === 0 && currentStatus.status === 'ONLINE') {
      formatted.push({
        id: 'default',
        botId: currentStatus.botId || 'N/A',
        username: currentStatus.username || 'Active Bot',
        avatar: currentStatus.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
        status: 'ONLINE',
        ping: currentStatus.ping || 0,
        uptimeSeconds: currentStatus.metrics?.uptimeSeconds || 0,
        guildCount: currentStatus.metrics?.guildCount || 0,
        createdAt: new Date().toISOString(),
      });
    }

    return res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const startBot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bot = await prisma.botConfig.findUnique({ where: { id } });
    if (!bot || !bot.tokenEncrypted) {
      return res.status(404).json({ success: false, message: 'Bot configuration not found' });
    }

    const { decryptSecret } = require('../security/crypto');
    const token = decryptSecret(bot.tokenEncrypted);

    const discordManager = DiscordManager.getInstance();
    const result = await discordManager.connectBot(token);

    if (result.success) {
      await prisma.botConfig.update({
        where: { id },
        data: { status: 'ONLINE', botUsername: result.botInfo?.username, botAvatar: result.botInfo?.avatar, botId: result.botInfo?.botId },
      });
    }

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const stopBot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discordManager = DiscordManager.getInstance();
    await discordManager.disconnectBot();

    await prisma.botConfig.updateMany({
      where: { id },
      data: { status: 'DISCONNECTED' },
    });

    return res.status(200).json({ success: true, message: 'Bot stopped successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.botConfig.delete({ where: { id } }).catch(() => {});
    return res.status(200).json({ success: true, message: 'Bot removed successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
