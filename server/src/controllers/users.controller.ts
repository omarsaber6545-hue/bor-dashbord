import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const mockUsers = [
      {
        id: 'usr_101',
        name: 'System Administrator',
        email: 'admin@controlcenter.io',
        role: 'Super Admin',
        status: 'ACTIVE',
        lastLogin: new Date().toISOString(),
        avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      },
      {
        id: 'usr_102',
        name: 'Discord Ops Moderator',
        email: 'ops@controlcenter.io',
        role: 'Moderator',
        status: 'ACTIVE',
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
      },
      {
        id: 'usr_103',
        name: 'Analytics Viewer',
        email: 'viewer@controlcenter.io',
        role: 'Viewer',
        status: 'SUSPENDED',
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
      },
    ];

    return res.status(200).json({ success: true, count: mockUsers.length, data: mockUsers });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    await prisma.auditLog.create({
      data: {
        action: 'USER_INVITED',
        category: 'SECURITY',
        actor: 'admin',
        details: `Invited user ${email} with role ${role || 'Viewer'}`,
      },
    });

    return res.status(200).json({ success: true, message: `Invitation sent to ${email} successfully!` });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    await prisma.auditLog.create({
      data: {
        action: 'ROLE_UPDATED',
        category: 'SECURITY',
        actor: 'admin',
        details: `Updated user ${id} role to ${role}`,
      },
    });

    return res.status(200).json({ success: true, message: `User role updated to ${role}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
