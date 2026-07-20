export const DISCORD_PERMISSIONS = [
  { id: 'ADMINISTRATOR', name: 'Administrator', value: '8', category: 'General' },
  { id: 'MANAGE_GUILD', name: 'Manage Server', value: '32', category: 'General' },
  { id: 'MANAGE_ROLES', name: 'Manage Roles', value: '268435456', category: 'General' },
  { id: 'MANAGE_CHANNELS', name: 'Manage Channels', value: '16', category: 'General' },
  { id: 'KICK_MEMBERS', name: 'Kick Members', value: '2', category: 'Membership' },
  { id: 'BAN_MEMBERS', name: 'Ban Members', value: '4', category: 'Membership' },
  { id: 'CREATE_INSTANT_INVITE', name: 'Create Invite', value: '1', category: 'General' },
  { id: 'VIEW_CHANNEL', name: 'View Channels', value: '1024', category: 'Text' },
  { id: 'SEND_MESSAGES', name: 'Send Messages', value: '2048', category: 'Text' },
  { id: 'EMBED_LINKS', name: 'Embed Links', value: '16384', category: 'Text' },
  { id: 'ATTACH_FILES', name: 'Attach Files', value: '32768', category: 'Text' },
  { id: 'READ_MESSAGE_HISTORY', name: 'Read Message History', value: '65536', category: 'Text' },
  { id: 'USE_EXTERNAL_EMOJIS', name: 'Use External Emojis', value: '262144', category: 'Text' },
  { id: 'ADD_REACTIONS', name: 'Add Reactions', value: '64', category: 'Text' },
  { id: 'CONNECT', name: 'Connect Voice', value: '1048576', category: 'Voice' },
  { id: 'SPEAK', name: 'Speak Voice', value: '2097152', category: 'Voice' },
  { id: 'MUTE_MEMBERS', name: 'Mute Members', value: '4194304', category: 'Voice' },
  { id: 'DEAFEN_MEMBERS', name: 'Deafen Members', value: '8388608', category: 'Voice' },
];

export const DISCORD_SCOPES = [
  { id: 'bot', name: 'bot', default: true },
  { id: 'applications.commands', name: 'applications.commands', default: true },
  { id: 'identify', name: 'identify', default: false },
  { id: 'guilds', name: 'guilds', default: false },
];

export function buildDiscordInviteUrl(clientId: string, selectedPermissions: string[], selectedScopes: string[]): string {
  if (!clientId) return '';

  let permissionsBitfield = BigInt(0);
  for (const permId of selectedPermissions) {
    const found = DISCORD_PERMISSIONS.find((p) => p.id === permId);
    if (found) {
      permissionsBitfield |= BigInt(found.value);
    }
  }

  const scopes = selectedScopes.length > 0 ? selectedScopes.join('%20') : 'bot%20applications.commands';

  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissionsBitfield.toString()}&scope=${scopes}`;
}
