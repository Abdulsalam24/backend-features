import 'dotenv/config'
import path , { join } from 'path';
import {fileURLToPath} from 'url';

import express from 'express'
import keys from './config/keys.js'

import cookieParser from "cookie-parser"
import logger from "morgan"
import cors from "cors"
import createError from 'http-errors'
import { requestLogger, errorHandler } from './middleware/index.js'

import pkg from 'mongoose';

import router from './routes/index.js'
import mongoose from 'mongoose'

import numbersRouter from './routes/numbersRouter.js';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);


mongoose.set('strictQuery', false);

const { connect, connection } = pkg;

connect(keys.database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

connection.on('connected', () => {
  console.log('connected to mongoDB')
  // seedDatabase()
})

connection.on('error', (err) => {
  console.log('err connecting', err)
})

const app = express()

// middleware
app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(requestLogger)

app.use(express.static(join(__dirname, 'public')))


// // api router
app.use(keys.app.apiEndpoint, router)


// // catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'NotFound'))
})

// // error handler
app.use(errorHandler)


const PORT = 3001

app.listen(PORT , () => {
  console.log(`Listneing to ${PORT}`)
})




export default app
