import express from 'express'
import User from '../models/user.js'

const router = express.Router()

router
    .route('/')
    .get(async (req, res) => {
        User.find({}).sort({ numPosts: -1 }).limit(3).exec((err, users) => {
            if (err) return res.send(err);
            res.json(users);
        });
    })


export default router
