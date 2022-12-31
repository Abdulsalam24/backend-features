import express from 'express'
import authRouter from './auth.js'
import userRouter from './users.js'
import postRouter from './posts.js'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).send('api endpoint')
})

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/posts', postRouter)

export default router
