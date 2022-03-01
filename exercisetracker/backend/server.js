import express from "express"
import cors from "cors"
import shipwrecks from "./api/shipwrecks.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/shipwrecks", shipwrecks)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app