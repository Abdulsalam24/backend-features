import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import keys from '../config/keys.js'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path, { join } from 'path';
import { fileURLToPath } from 'url'

const imagestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'client/public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: imagestorage })

const router = express.Router()

router.use(express.static(join(__dirname + "/.public/")))

router.route('/').get((req, res, next) => {
  res.send('auth endpoint')
})

router.post("/signup", upload.single('imageUpload'), async (req, res) => {

  const { username, password, email } = req.body

  const imgUrl = req.file ? req.file.filename : req.body.imageUpload

  if (password.length <= 8 || password.length >= 20) {
    res.status(401).json({ message: "password must be between 8 and 20 characters" })
    return;
  }

  if (!username || !password || !email) {
    res.status(422).json({ message: 'please add all the fields' })
    return;
  }

  const userExistUserName = await User.findOne({ username })

  if (userExistUserName) {
    res.status(422).json({ message: "user already exist" })
    return;
  }

  const salt = await bcrypt.genSalt(10)
  const hashedpassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    username,
    email,
    passwordHash: hashedpassword,
    profile_image: imgUrl
  })

  // newUser
  if (user) {
    res.status(200).json(user)
    return;
  } else {
    res.status(401).json({ message: "User data wrong" })
  }

})

router.post("/signin", async (req, res) => {
  const { username, passwordHash } = req.body

  const user = await User.findOne({ username })

  if (user && (username === user.username) && (await bcrypt.compare(passwordHash, user.passwordHash))) {

    const userForToken = {
      username: username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, keys.jwt.secret)
    console.log(token, 'tokeennn')
    res.send({ token, username, uid: user.id, profile_image: user.profile_image })

  } else {
    res.status(401).json({ message: "wrong credential" })
  }
})

router.get("/users/:uid", async (req, res) => {
  const { uid } = req.params
  const user = await User.findOne({ username: uid })

  if (!user) {

    res.status(404).json({ message: "Not found" })
  }
  res.status(200).json(user)

})

router.put("/users/:uid", async (req, res) => {
  const { currentPassword, password } = req.body

  if (password.length < 8 || password.length > 20) {

    res.status(401).json({ message: "password must be between 8 and 20 characters. " })
    return;
  }

  const { uid } = req.params

  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(password, salt)

  const singleUsers = await User.findOne({ username: uid })

  const user = await User.findOneAndUpdate({ username: uid }, { passwordHash: newPassword }, { new: true })

  if (user && (await bcrypt.compare(currentPassword, singleUsers.passwordHash))) {
    res.status(200).json(user)
    return;
  }

  res.status(401).json({ message: "Wrong credential" })
})

router.put("/users/avatar/:uid", async (req, res) => {
  const { profileImage } = req.body

  const user = await User.findOneAndUpdate({ username: req.params.uid }, { profile_image: profileImage }, { new: true })

  if (!user) {
    res.status(404).json({ message: "Not found" })
  }
  res.status(200).json(user)
})



export default router
