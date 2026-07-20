import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma/client';

export const getApiKeys = async (req: Request, res: Response) => {
  try {
    const mockKeys = [
      {
        id: 'key_live_9482',
        name: 'Production Monitoring Service',
        keyPrefix: 'cc_live_9482...',
        permissions: ['READ_TELEMETRY', 'READ_LOGS', 'READ_GUILDS'],
        createdAt: new Date(Date.now() - 2592000000).toISOString(),
        lastUsedAt: new Date().toISOString(),
        expiresAt: 'Never',
      },
      {
        id: 'key_test_1049',
        name: 'CI/CD Automation Pipeline',
        keyPrefix: 'cc_test_1049...',
        permissions: ['MANAGE_COMMANDS', 'EXECUTE_BACKUP'],
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        lastUsedAt: new Date(Date.now() - 86400000).toISOString(),
        expiresAt: '2027-01-01T00:00:00.000Z',
      },
    ];

    return res.status(200).json({ success: true, count: mockKeys.length, data: mockKeys });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createApiKey = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'API Key Name is required' });
    }

    const rawKey = `cc_live_${crypto.randomBytes(16).toString('hex')}`;

    await prisma.auditLog.create({
      data: {
        action: 'API_KEY_CREATED',
        category: 'SECURITY',
        actor: 'admin',
        details: `Generated new API key "${name}" with permissions: ${(permissions || ['READ_TELEMETRY']).join(', ')}`,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'API Key generated successfully! Please store it securely.',
      apiKey: rawKey,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
