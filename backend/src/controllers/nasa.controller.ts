import type { Request, Response } from 'express'
import { NasaService } from '../services/nasa.service'

const nasaService = new NasaService()

export class NasaController {
  async getApod(_req: Request, res: Response): Promise<void> {
    try {
      const data = await nasaService.getApod()
      res.json({ success: true, data })
    } catch {
      res.status(500).json({ success: false, message: 'Failed to fetch APOD' })
    }
  }

  async getMarsPhotos(req: Request, res: Response): Promise<void> {
    try {
      const sol  = Number(req.query.sol ?? 1000)
      const data = await nasaService.getMarsPhotos(sol)
      res.json({ success: true, data })
    } catch {
      res.status(500).json({ success: false, message: 'Failed to fetch Mars photos' })
    }
  }

  async getNeoFeed(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const start = String(req.query.start ?? today)
      const end   = String(req.query.end   ?? today)
      const data  = await nasaService.getNeoFeed(start, end)
      res.json({ success: true, data })
    } catch {
      res.status(500).json({ success: false, message: 'Failed to fetch NEO feed' })
    }
  }
}
