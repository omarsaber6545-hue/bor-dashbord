import { Request, Response } from 'express';
import { z } from 'zod';
import { DiscordManager } from '../discord/DiscordManager';
import { prisma } from '../prisma/client';

const toggleSchema = z.object({
  commandName: z.string().min(1),
  enabled: z.boolean(),
  category: z.string().optional(),
  cooldownSeconds: z.number().optional(),
});

export const getCommands = async (req: Request, res: Response) => {
  try {
    const discordManager = DiscordManager.getInstance();
    const commands = await discordManager.getSlashCommands();
    return res.status(200).json({ success: true, count: commands.length, data: commands });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCommandConfig = async (req: Request, res: Response) => {
  try {
    const validated = toggleSchema.parse(req.body);

    const updated = await prisma.commandConfig.upsert({
      where: { commandName: validated.commandName },
      update: {
        enabled: validated.enabled,
        ...(validated.category ? { category: validated.category } : {}),
        ...(validated.cooldownSeconds !== undefined ? { cooldownSeconds: validated.cooldownSeconds } : {}),
      },
      create: {
        commandName: validated.commandName,
        enabled: validated.enabled,
        category: validated.category || 'SlashCommand',
        cooldownSeconds: validated.cooldownSeconds || 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'COMMAND_CONFIG_UPDATED',
        category: 'COMMANDS',
        actor: 'admin',
        details: `Command ${validated.commandName} enabled set to ${validated.enabled}`,
      },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};
