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

app.get("/check-db-connection", async (req, res) => {
    try {
        await prisma.$connect();
        res.send({ message: "Connected to mongoDb success" })
    } catch (error) {
        res.status(500).send("internal server error : ", error)
    }
})

app.post("/customer/create", async (req, res) => {
    try {
        const payload = req.body;
        const customer = await prisma.customer.create({
            data: payload
        })
        res.json(customer)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
})

app.get("/customer/list", async (req, res) => {
    try {
        const customer = await prisma.customer.findMany();
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customer/:id", async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: {
                id: req.params.id
            }
        });
        res.json(customer)
    } catch (error) {
        return res.status(404).json({ error: "customer id is not found." })
    }
})

app.put("/customer/:id", async (req, res) => {
    try {
        const payload = req.body;
        await prisma.customer.update({
            where: {
                id: req.params.id
            },
            data: payload
        })
        res.json({ message: "success" })
    } catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
})

app.delete("/customer/:id", async (req, res) => {
    try {
        await prisma.customer.delete({
            where: {
                id: req.params.id
            }
        });
        res.json({ message: "customer deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: "internal server error" })
    }
})

app.get("/customers/startsWith", async (req, res) => {
    try {
        const keyword = req.body.keyword
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    startsWith: keyword
                }
            }
        });
        res.json(customers)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
});

app.get("/customers/endsWith",async(req,res)=>{
    try{
        const keyword = req.body.keyword
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    endsWith: keyword
                }
            }
        });
        res.json(customers)
    }catch(error){
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/contains",async(req , res)=>{
    try{
        const keyword = req.body.keyword
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    contains: keyword
                }
            }
        });
        res.json(customers)

    }catch(error){
        return res.status(500).json({ error: error.message })
    }
})


app.listen(port, () => {
    console.log("Server is running on port " + String(port))
})