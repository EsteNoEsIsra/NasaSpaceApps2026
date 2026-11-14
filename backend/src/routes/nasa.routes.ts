import { Router } from 'express'
import { NasaController } from '../controllers/nasa.controller'
import { requireAuth } from '../middleware/auth.middleware'

export const nasaRouter = Router()
const ctrl = new NasaController()

// Public
nasaRouter.get('/apod',       ctrl.getApod)
// Protected
nasaRouter.get('/mars',       requireAuth, ctrl.getMarsPhotos)
nasaRouter.get('/neo',        requireAuth, ctrl.getNeoFeed)
