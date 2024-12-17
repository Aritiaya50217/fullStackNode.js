const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post("/writeFile", (req, res) => {
    fs.writeFileSync('test.txt', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum');
    res.send("File written")
})

app.get("/readFile", (req, res) => {
    const data = fs.readFileSync('test.txt', 'utf8');
    res.json({ data: data })
})

app.post("/", (req, res) => {
    res.send(req.body);
})

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/hello/:name/:age", (req, res) => {
    if (req.params.name == ":name" || req.params.age == ":age") {
        res.send("name or age is empty")
    } else {
        res.send(`Hello ${req.params.name} Age ${req.params.age}`);
    }
});


app.listen(3001, () => {
    console.log("Server is running on 127.0.0.1:3001")
})