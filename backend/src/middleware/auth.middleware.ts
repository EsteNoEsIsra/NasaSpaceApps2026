import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { users } from '../db/schema';

export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

let defaultUserEnsured = false;

async function ensureDefaultAstronaut(): Promise<void> {
  if (defaultUserEnsured) return;

  const existing = await db.query.users.findFirst({
    where: eq(users.id, DEMO_USER_ID),
  });

  if (!existing) {
    await db.insert(users).values({
      id: DEMO_USER_ID,
      name: 'Cmdr. Elena Vance',
      email: 'elena.vance@artemis-crew.nasa.gov',
      password: 'demo_no_login_required',
      role: 'astronaut',
    });
  }

  defaultUserEnsured = true;
}

export async function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await ensureDefaultAstronaut();
    req.user = {
      userId: DEMO_USER_ID,
      email: 'elena.vance@artemis-crew.nasa.gov',
      role: 'astronaut',
    };
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }
    next();
  };
}