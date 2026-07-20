import { Request, Response } from 'express';
import { DiscordManager } from '../discord/DiscordManager';

export const getGuilds = async (req: Request, res: Response) => {
  try {
    const discordManager = DiscordManager.getInstance();
    const guilds = await discordManager.getGuildsList();
    return res.status(200).json({ success: true, count: guilds.length, data: guilds });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getGuildById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discordManager = DiscordManager.getInstance();
    const guilds = await discordManager.getGuildsList();
    const found = guilds.find((g) => g.id === id);

    if (!found) {
      return res.status(404).json({ success: false, message: 'Guild not found or inaccessible' });
    }

    return res.status(200).json({ success: true, data: found });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
