import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { router } from './routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// ── Security & logging ────────────────────────────────────
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// ── Routes ───────────────────────────────────────────────
app.use('/api', router)

// ── Health check ─────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Error handler (must be last) ─────────────────────────
app.use(errorHandler)

export default app
