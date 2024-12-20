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

app.get("/customers/endsWith", async (req, res) => {
    try {
        const keyword = req.body.keyword
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    endsWith: keyword
                }
            }
        });
        res.json(customers)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/contains", async (req, res) => {
    try {
        const keyword = req.body.keyword
        const customers = await prisma.customer.findMany({
            where: {
                name: {
                    contains: keyword
                }
            }
        });
        res.json(customers)

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/sortByName", async (req, res) => {
    try {
        const customer = await prisma.customer.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/whereAnd/:name", async (req, res) => {
    try {
        const keyword = req.params.name
        if (keyword == "") {
            const customer = await prisma.customer.findMany();
            res.json(customer);
        } else {
            const customer = await prisma.customer.findMany(
                {
                    where: {
                        AND: [
                            {
                                name: {
                                    contains: keyword
                                }
                            },
                            {
                                credit: {
                                    lt: 2
                                }
                            }

                        ]
                    }
                })
            res.json(customer)
        }


    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/betweenCredit/:start/:end", async (req, res) => {
    try {
        const customer = await prisma.customer.findMany({
            where: {
                credit: {
                    gte: Number(req.params.start),
                    lte: Number(req.params.end)
                }
            }
        });
        res.json(customer)

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/sumCredit", async (req, res) => {
    try {
        const sumCredit = await prisma.customer.aggregate({
            _sum: {
                credit: true
            }
        });
        res.json({ sumCredit: sumCredit._sum.credit })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/maxCredit", async (req, res) => {
    try {
        const max = await prisma.customer.aggregate({
            _max: {
                credit: true
            }
        })
        res.json({ maxCredit: max._max })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/minCredit", async (req, res) => {
    try {
        const min = await prisma.customer.aggregate({
            _min: {
                credit: true
            }
        })
        res.json({ minCredit: min._min })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/averageCredit", async (req, res) => {
    try {
        const avg = await prisma.customer.aggregate({
            _avg: {
                credit: true
            }
        })
        res.json({ avg: avg._avg.credit.toFixed(2) })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/countCustomer", async (req, res) => {
    try {
        const count = await prisma.customer.count();
        res.json({ count: count })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.post("/order/create", async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const amount = req.body.amount;
        const order = await prisma.order.create({
            data: {
                customerId: customerId,
                amount: amount,
            }
        })
        res.json(order)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.put("/order/:id", async (req, res) => {
    try {
        const payload = req.body;
        // const arr = payload.productId
        await prisma.order.update({
            where: {
                id: req.params.id
            },
            data: payload
        })
        res.status(201).json({ message: "success" })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/order/:customerId", async (req, res) => {
    try {
        const customerId = req.params.customerId
        const orders = await prisma.order.findMany({
            where: {
                customerId: customerId
            }
        })
        res.json({ orders: orders });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/orders", async (req, res) => {
    try {
        const orders = await prisma.customer.findMany({
            include: {
                Order: true
            }
        });
        res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/orders/:id", async (req, res) => {
    try {
        if (req.params.id == "") {
            return res.json(400).json({ error: "orders id is not found" })
        }
        const order = await prisma.order.findUnique({
            where: {
                id: req.params.id
            }
        })
        res.json({ order: order })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.post("/product/create", async (req, res) => {
    try {
        const name = req.body.name;
        const price = req.body.price;
        const product = await prisma.product.create({
            data: {
                name: name,
                price: price,
            }
        })
        res.json(product)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

app.get("/customers/products/:customerId", async (req, res) => {
    try {
        const customerId = req.params.customerId
        const customers = await prisma.customer.findMany({
            where: {
                id: customerId
            },
            include: {
                Order: {
                    include: {
                        Product: true
                    }
                }
            }
        });
        res.json(customers)

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})



app.listen(port, () => {
    console.log("Server is running on port " + String(port))
})
