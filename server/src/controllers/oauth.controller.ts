import { Request, Response } from 'express';
import { DiscordManager } from '../discord/DiscordManager';
import { DISCORD_PERMISSIONS, DISCORD_SCOPES, buildDiscordInviteUrl } from '../utils/oauth';

export const getOAuthOptions = async (req: Request, res: Response) => {
  try {
    const discordManager = DiscordManager.getInstance();
    const botStatus = await discordManager.getBotStatus();

    return res.status(200).json({
      success: true,
      data: {
        clientId: botStatus.botId,
        permissions: DISCORD_PERMISSIONS,
        scopes: DISCORD_SCOPES,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const generateInviteUrl = async (req: Request, res: Response) => {
  try {
    const { clientId, permissions, scopes } = req.body;
    const discordManager = DiscordManager.getInstance();
    const botStatus = await discordManager.getBotStatus();

    const targetClientId = clientId || botStatus.botId;

    if (!targetClientId) {
      return res.status(400).json({ success: false, message: 'Bot Client ID is missing. Connect a bot first or provide a Client ID.' });
    }

    const selectedPermissions = Array.isArray(permissions) ? permissions : [];
    const selectedScopes = Array.isArray(scopes) ? scopes : ['bot', 'applications.commands'];

    const inviteUrl = buildDiscordInviteUrl(targetClientId, selectedPermissions, selectedScopes);

    return res.status(200).json({ success: true, inviteUrl });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
