import type { Request, Response } from 'express'
import type { AuthRequest } from '../middleware/auth.middleware'
import { AuthService } from '../services/auth.service'

const authService = new AuthService()

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body)
      res.json({ success: true, data: result })
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message })
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    res.json({ success: true, data: req.user })
  }
}
