import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized' })
    return
  }

  try {
    const token = header.slice(7)
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden' })
      return
    }
    next()
  }
}
