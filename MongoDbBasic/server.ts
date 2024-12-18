
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const port = 3000

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

dotenv.config();

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/check-db-connection", async(req, res) => {
    try {
        await prisma.$connect();
        res.send({ message: "Connected to mongoDb success" })
    } catch (error) {
        res.status(500).send("internal server error : ", error)
    }
})


app.listen(port, () => {
    console.log("Server is running on port " + String(port))
})