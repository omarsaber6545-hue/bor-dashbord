import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const exportData = async (req: Request, res: Response) => {
  try {
    const { type, format } = req.query;

    let data: any[] = [];
    if (type === 'commands') {
      data = await prisma.commandUsage.findMany({ take: 500, orderBy: { timestamp: 'desc' } });
    } else if (type === 'audit') {
      data = await prisma.auditLog.findMany({ take: 500, orderBy: { timestamp: 'desc' } });
    } else {
      data = await prisma.gatewayEvent.findMany({ take: 500, orderBy: { timestamp: 'desc' } });
    }

    if (format === 'csv') {
      if (data.length === 0) {
        res.setHeader('Content-Type', 'text/csv');
        return res.send('No data available');
      }
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((item) => Object.values(item).map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','));
      const csvContent = [headers, ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type || 'export'}-data.csv"`);
      return res.status(200).send(csvContent);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${type || 'export'}-data.json"`);
    return res.status(200).send(JSON.stringify(data, null, 2));
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
