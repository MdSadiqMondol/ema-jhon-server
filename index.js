const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const port = 5000

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ugc0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect(err => {
    const products = client.db("emajhon").collection("products");
    const orders = client.db("emajhon").collection("order");
   
    app.post("/addProduct", (req, res) => {
        const allProduct = req.body;
        
        products.insertOne(allProduct)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })
    app.get('/products', (req, res) => {
        products.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })
    app.get('/products/:key', (req, res) => {
        products.find({key: req.params.key})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })
    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        products.find({key: { $in: productsKeys}})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })
    app.post("/addOrders", (req, res) => {
        const allOrders = req.body;

        orders.insertOne(allOrders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
});


app.listen(process.env.PORT || port)