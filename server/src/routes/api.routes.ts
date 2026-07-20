import { Router } from 'express';
import * as healthCtrl from '../controllers/health.controller';
import * as botCtrl from '../controllers/bot.controller';
import * as guildsCtrl from '../controllers/guilds.controller';
import * as commandsCtrl from '../controllers/commands.controller';
import * as logsCtrl from '../controllers/logs.controller';
import * as statsCtrl from '../controllers/stats.controller';
import * as oauthCtrl from '../controllers/oauth.controller';
import * as settingsCtrl from '../controllers/settings.controller';
import * as analyticsCtrl from '../controllers/analytics.controller';
import * as backupCtrl from '../controllers/backup.controller';
import * as metricsCtrl from '../controllers/metrics.controller';
import * as usersCtrl from '../controllers/users.controller';
import * as exportCtrl from '../controllers/export.controller';
import * as webhooksCtrl from '../controllers/webhooks.controller';
import * as apikeysCtrl from '../controllers/apikeys.controller';

const router = Router();

// API Root Index Endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    name: 'Discord Bot Control Center REST API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      health: '/api/health',
      botStatus: '/api/bot/status',
      guilds: '/api/guilds',
      commands: '/api/commands',
      systemInspect: '/api/system/inspect',
      metrics: '/api/metrics',
    },
  });
});

// Observability & Metrics Endpoints
router.get('/health', healthCtrl.healthCheck);
router.get('/ready', healthCtrl.readyCheck);
router.get('/live', healthCtrl.livenessCheck);
router.get('/errors', healthCtrl.getErrorLogs);
router.get('/metrics', metricsCtrl.getPrometheusMetrics);
router.get('/system/inspect', metricsCtrl.getSystemInspector);
router.get('/database/inspect', metricsCtrl.getDatabaseInspector);
router.get('/websocket/inspect', metricsCtrl.getWebSocketInspector);

// User Management & RBAC Endpoints
router.get('/users', usersCtrl.getUsers);
router.post('/users/invite', usersCtrl.inviteUser);
router.patch('/users/:id/role', usersCtrl.updateUserRole);

// Webhook & API Keys Endpoints
router.get('/webhooks', webhooksCtrl.getWebhooks);
router.post('/webhooks', webhooksCtrl.createWebhook);
router.get('/apikeys', apikeysCtrl.getApiKeys);
router.post('/apikeys', apikeysCtrl.createApiKey);

// Export Center Endpoints
router.get('/export', exportCtrl.exportData);

// Bot Management & Multi-Bot Endpoints
router.get('/bots', botCtrl.getAllBots);
router.post('/bot/connect', botCtrl.connectBot);
router.post('/bot/disconnect', botCtrl.disconnectBot);
router.get('/bot/status', botCtrl.getBotStatus);
router.post('/bots/:id/start', botCtrl.startBot);
router.post('/bots/:id/stop', botCtrl.stopBot);
router.delete('/bots/:id', botCtrl.deleteBot);

// Guilds & Servers Endpoints
router.get('/guilds', guildsCtrl.getGuilds);
router.get('/guilds/:id', guildsCtrl.getGuildById);

// Commands Endpoints
router.get('/commands', commandsCtrl.getCommands);
router.post('/commands/config', commandsCtrl.updateCommandConfig);

// Live Gateway & Redis Monitor Endpoints
router.get('/gateway/monitor', analyticsCtrl.getGatewayMonitorData);
router.get('/analytics/commands', analyticsCtrl.getCommandAnalytics);
router.get('/analytics/redis', analyticsCtrl.getRedisStats);

// Backup & Restore Endpoints
router.get('/backup/export', backupCtrl.exportBackup);
router.post('/backup/import', backupCtrl.importBackup);

// Console Logs Endpoints
router.get('/logs', logsCtrl.getLogs);
router.get('/logs/export', logsCtrl.exportLogs);
router.delete('/logs', logsCtrl.clearLogs);

// Telemetry & Statistics Endpoints
router.get('/stats/history', statsCtrl.getStatsHistory);

// OAuth & Invites Endpoints
router.get('/oauth/options', oauthCtrl.getOAuthOptions);
router.post('/oauth/invite-url', oauthCtrl.generateInviteUrl);

// Settings & Audit Logs Endpoints
router.get('/settings', settingsCtrl.getSettings);
router.post('/settings', settingsCtrl.updateSettings);

export default router;
