import { Router } from 'express'
import authMiddleware from '../middlewares/auth'
import authRoutes from './auth.routes'

const router = Router()

router.use('/auth', authRoutes)
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'protected' })
})

export default router