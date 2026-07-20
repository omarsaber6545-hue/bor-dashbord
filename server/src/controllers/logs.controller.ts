import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export const getLogs = (req: Request, res: Response) => {
  try {
    const level = req.query.level as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 200;

    const logs = logger.getRecentLogs({ level, search, limit });
    return res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const exportLogs = (req: Request, res: Response) => {
  try {
    const format = (req.query.format as string) || 'json';
    const logs = logger.getRecentLogs({ limit: 1000 });

    if (format === 'txt') {
      const textContent = logs
        .map((l) => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message} ${JSON.stringify(l.metadata || {})}`)
        .join('\n');

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="discord-control-center-logs.txt"');
      return res.status(200).send(textContent);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="discord-control-center-logs.json"');
      return res.status(200).send(JSON.stringify(logs, null, 2));
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const clearLogs = (req: Request, res: Response) => {
  try {
    logger.clearLogs();
    return res.status(200).json({ success: true, message: 'Console logs cleared' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
