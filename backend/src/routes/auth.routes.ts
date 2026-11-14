import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '../middleware/validate.middleware'
import { requireAuth } from '../middleware/auth.middleware'
import { registerSchema, loginSchema } from '../validators/auth.validator'

export const authRouter = Router()
const ctrl = new AuthController()

authRouter.post('/register', validate(registerSchema), ctrl.register)
authRouter.post('/login',    validate(loginSchema),    ctrl.login)
authRouter.get('/me',        requireAuth,              ctrl.me)
