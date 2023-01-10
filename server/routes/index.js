import express from 'express'
import authRouter from './auth.js'
import userRouter from './users.js'
import postRouter from './posts.js'
import numbersRouter from './numbersRouter.js'
import aliceRouter from './aliceRouter.js'
import topRouter from './topRouter.js'


const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).send('api endpoint')
})

router.use('/auth', authRouter)
router.use('/alice', aliceRouter)

router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/num', numbersRouter)
router.use('/top', topRouter)



export default router
