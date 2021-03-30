const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port = 5000

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.zpujg.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  console.log("database connected")

  app.post('/addProducts', (req, res) => {
    const products =req.body;
    productsCollection.insertOne(products)
    .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  app.get('/product/key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const order =req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

});

app.get('/', (req, res) => {
  res.send('ema john running')
})
app.listen(process.env.PORT || port)
