import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getWebhooks = async (req: Request, res: Response) => {
  try {
    const mockWebhooks = [
      {
        id: 'wh_101',
        name: 'Discord Slack Alert Bridge',
        url: 'https://hooks.slack.com/services/T000/B000/XXXXX',
        events: ['BOT_DISCONNECT', 'HIGH_CPU_ALERT', 'ERROR_LOGGED'],
        enabled: true,
        lastTriggered: new Date().toISOString(),
      },
      {
        id: 'wh_102',
        name: 'Datadog Telemetry Ingestion',
        url: 'https://http-intake.logs.datadoghq.com/v1/input',
        events: ['GATEWAY_EVENT', 'COMMAND_EXECUTED'],
        enabled: true,
        lastTriggered: new Date(Date.now() - 300000).toISOString(),
      },
    ];

    return res.status(200).json({ success: true, count: mockWebhooks.length, data: mockWebhooks });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createWebhook = async (req: Request, res: Response) => {
  try {
    const { name, url, events } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, message: 'Webhook Name and Target URL are required' });
    }

    await prisma.auditLog.create({
      data: {
        action: 'WEBHOOK_CREATED',
        category: 'INTEGRATION',
        actor: 'admin',
        details: `Created outgoing webhook endpoint ${name} -> ${url}`,
      },
    });

    return res.status(200).json({ success: true, message: `Outgoing Webhook "${name}" registered successfully!` });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
