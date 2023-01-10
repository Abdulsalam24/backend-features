import express from "express";

import User from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const userAlice = req._parsedOriginalUrl.path.slice(5)

    const user = await User.findOne({ username: userAlice })
    
    if (!user) {
        res.status(404).json({ message: "user not found" })
    }
    res.status(200).json(user)
})









export default router;
