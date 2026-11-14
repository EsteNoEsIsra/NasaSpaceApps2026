import { Router } from 'express'
import { authRouter } from './auth.routes'
import { nasaRouter } from './nasa.routes'

export const router = Router()

router.use('/auth',  authRouter)
router.use('/nasa',  nasaRouter)
