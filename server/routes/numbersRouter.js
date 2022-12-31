import { Router } from "express";

const numbersRouter = Router()


numbersRouter.get("/add/:x/:y", (req, res) => {
    const { x, y } = req.params

    const sum = +x + +y

    if (!sum) {
        res.status(400).json({ message: "two numbers are not provided" })
        return;
    }
    res.status(200).json({ sum });
})

numbersRouter.get("/teapot", (req, res) => {
    res.status(418).send(true);
})

numbersRouter.post("/teapot", (req, res) => {

    if (typeof req.body.areYouATeapot != "boolean" || Object.keys(req.body) != "areYouATeapot") {
        res.status(418).json({ message: 'Something went wrong' })
    }
    if (req.body.areYouATeapot === true) {
        res.status(418).json({ amIATeapot: 'yes' })
    }
    if (req.body.areYouATeapot === false) {
        res.status(418).json({ amIATeapot: 'no' })
    }
})

numbersRouter.get("/hello", (req, res) => {
    res.status(400).json({ message: `Please provide a name` })
})

numbersRouter.get("/hello/:name", (req, res) => {
    res.status(200).json({ message: `Hello ${name}!` })
})



export default numbersRouter