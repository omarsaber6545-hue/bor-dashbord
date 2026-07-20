import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const exportBackup = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    const commandConfigs = await prisma.commandConfig.findMany();
    const botConfig = await prisma.botConfig.findUnique({ where: { id: 'default' } });

    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      settings: settings || { theme: 'dark', language: 'en', timezone: 'UTC' },
      commandConfigs,
      botMetadata: {
        publicBot: botConfig?.publicBot ?? true,
        messageContentIntent: botConfig?.messageContentIntent ?? false,
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="discord-control-center-backup.json"');
    return res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const importBackup = async (req: Request, res: Response) => {
  try {
    const { backupData } = req.body;
    if (!backupData || typeof backupData !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid backup JSON payload' });
    }

    if (backupData.settings) {
      await prisma.settings.upsert({
        where: { id: 'global' },
        update: {
          theme: backupData.settings.theme || 'dark',
          language: backupData.settings.language || 'en',
          timezone: backupData.settings.timezone || 'UTC',
        },
        create: {
          id: 'global',
          theme: backupData.settings.theme || 'dark',
          language: backupData.settings.language || 'en',
          timezone: backupData.settings.timezone || 'UTC',
        },
      });
    }

    if (Array.isArray(backupData.commandConfigs)) {
      for (const cfg of backupData.commandConfigs) {
        if (cfg.commandName) {
          await prisma.commandConfig.upsert({
            where: { commandName: cfg.commandName },
            update: { enabled: cfg.enabled ?? true, category: cfg.category || 'SlashCommand' },
            create: { commandName: cfg.commandName, enabled: cfg.enabled ?? true, category: cfg.category || 'SlashCommand' },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        action: 'BACKUP_RESTORED',
        category: 'SYSTEM',
        actor: 'admin',
        details: 'Configuration restored successfully from backup JSON',
      },
    });

    return res.status(200).json({ success: true, message: 'Configuration backup imported and restored successfully!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
