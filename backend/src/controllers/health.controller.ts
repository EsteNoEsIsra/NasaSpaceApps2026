import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import { HealthService, type SimulationScenario } from '../services/health.service';

const healthService = new HealthService();

export class HealthController {
  async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await healthService.getDashboard(req.user!.userId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await healthService.updateProfile(req.user!.userId, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async submitCheckin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await healthService.submitCheckin(req.user!.userId, req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async simulateScenario(req: AuthRequest, res: Response): Promise<void> {
    try {
      const scenario = req.body.scenario as SimulationScenario;
      const data = await healthService.simulateScenario(req.user!.userId, scenario);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async acknowledgeAlert(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await healthService.acknowledgeAlert(req.user!.userId, String(req.params.id));
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getGroundPacket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const includeIntimate = req.query.includeIntimate === 'true';
      const data = await healthService.generateFlightSurgeonPacket(
        req.user!.userId,
        includeIntimate
      );
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}