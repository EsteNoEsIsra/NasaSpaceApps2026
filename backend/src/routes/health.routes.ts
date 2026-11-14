import { Router } from 'express';
import { HealthService } from '../services/health.service';

const router = Router();
const healthService = new HealthService();

router.get('/dashboard', async (req, res) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    const data = await healthService.getDashboard(userId);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/profile', async (req, res) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    const data = await healthService.updateProfile(userId, req.body);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/checkin', async (req, res) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    const data = await healthService.submitCheckin(userId, req.body);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/simulate', async (req, res) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    const data = await healthService.simulateScenario(userId, req.body.scenario);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/ground-packet', async (req, res) => {
  try {
    const userId = '00000000-0000-0000-0000-000000000001';
    const includeIntimate = req.query.includeIntimate === 'true';
    const data = await healthService.generateFlightSurgeonPacket(userId, includeIntimate);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;