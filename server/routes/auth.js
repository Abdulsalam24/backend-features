import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import keys from '../config/keys.js'
import jwt from 'jsonwebtoken'
import multer from 'multer'


const router = express.Router()

router.route('/').get((req, res, next) => {
  res.send('auth endpoint')
})

// router.post('/signup', async (req, res) => {
//   const { username, password, profile_image } = req.body

//   if (!password || !username) {
//     return res.status(422).json({ error: 'please add all the fields' })
//   }

//   User.findOne({ username: username })
//     .then((savedUser) => {
//       if (savedUser) {
//         return res
//           .status(422)
//           .json({ error: 'user already exists with that name' })
//       }
//       bcrypt.hash(password, 12).then((hashedpassword) => {
//         const user = new User({
//           username,
//           passwordHash: hashedpassword,
//           profile_image: profile_image,
//         })

//         user
//           .save()
//           .then((user) => {
//             res.json({ message: 'saved successfully' })
//           })
//           .catch((err) => {
//             console.log(err)
//           })
//       })
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })


router.post("/signup", async (req, res) => {

  const { username, passwordHash, email, profile_image } = req.body


  if (passwordHash.length <= 8 || passwordHash.length >= 20) {
    res.status(401).json({ message: "password must be between 8 and 20 characters" })
    return;
  }

  if (!username || !passwordHash || !email) {
    res.status(422).json({ message: 'please add all the fields' })
    return;
  }

  const userExist = await User.findOne({ email })
  const userExistUserName = await User.findOne({ username })



  if (userExist || userExistUserName) {
    res.status(422).json({ message: "User already exist" })
    return;
  }

  const salt = await bcrypt.genSalt(10)
  const hashedpassword = await bcrypt.hash(passwordHash, salt)

  const user = await User.create({
    username,
    email,
    passwordHash: hashedpassword,
    profile_image
  })

  // newUser
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(401).json({ message: "User data wrong" })
  }

})
// router.post('/signin', async (req, res) => {
//   const { username, password } = req.body
//   if (!username || !password) {
//     return res.status(422).json({ error: 'missing username or password' })
//   }

//   const user = await User.findOne({ username: username })
//   const passwordCorrect =
//     user === null ? false : await bcrypt.compare(password, user.passwordHash)

//   if (!(user && passwordCorrect)) {
//     return res.status(401).json({
//       error: 'invalid username or password',
//     })
//   }

//   const userForToken = {
//     username: user.username,
//     id: user._id,
//   }

//   const token = jwt.sign(userForToken, keys.jwt.secret)
//   res
//     .status(200)
//     .send({ token, username, uid: user.id, profile_image: user.profile_image })
// })


router.post("/signin", async (req, res) => {
  const { username, passwordHash } = req.body

  const user = await User.findOne({ username })

  if (user && (username === user.username) && (await bcrypt.compare(passwordHash, user.passwordHash))) {
    res.status(200).json(user)
  } else {
    res.status(401).json({ message: "wrong credential" })
  }
})

const storage = multer.diskStorage({
  destination: "./public/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myfile");


router.post("/upload", (req, res) => {
  console.log("Request ---", req.body);
  console.log("Request file ---", req.file);//Here you get file.
  const file = new User();
  file.profile_image = req.file;
  file.save().then(() => {
    res.send({ message: "uploaded successfully" })
  })
  /*Now do where ever you want to do*/
});


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