import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: {},
      create: { id: 'global', theme: 'dark', language: 'en', timezone: 'UTC' },
    });

    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    return res.status(200).json({ success: true, settings, auditLogs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { theme, language, timezone, notificationsEnabled, webhookUrl } = req.body;

    const updated = await prisma.settings.upsert({
      where: { id: 'global' },
      update: {
        ...(theme ? { theme } : {}),
        ...(language ? { language } : {}),
        ...(timezone ? { timezone } : {}),
        ...(notificationsEnabled !== undefined ? { notificationsEnabled } : {}),
        ...(webhookUrl !== undefined ? { webhookUrl } : {}),
      },
      create: {
        id: 'global',
        theme: theme || 'dark',
        language: language || 'en',
        timezone: timezone || 'UTC',
        notificationsEnabled: notificationsEnabled ?? true,
        webhookUrl,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'SETTINGS_UPDATED',
        category: 'SETTINGS',
        actor: 'admin',
        details: `Updated settings (Theme: ${updated.theme}, Lang: ${updated.language})`,
      },
    });

    return res.status(200).json({ success: true, settings: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
