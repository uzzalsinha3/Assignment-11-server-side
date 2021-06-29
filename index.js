const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wo6au.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority;`
const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5055;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const itemsCollection = client.db("fullStackStore").collection("items");
  const ordersCollection = client.db("fullStackStore").collection("order");
  const reviewsCollection = client.db("fullStackStore").collection("review");

  app.get('/items', (req, res) => {
    itemsCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
  
    })
  })


  app.get('/reviews', (req, res) => {
    reviewsCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
  
    })
  })


  // app.get('/items', (req, res) => {
  //   console.log(req.query.email)
  //   ordersCollection.find({email: req.query.email})
  //   .toArray( (err, documents) => {
  //     res.send(documents);
  
  //   })
  // })

  // app.get('/', (req, res) => {
  //   res.send("Hi")
  // })
  
  app.post('/addItem', (req, res) => {
      const items = req.body;
      console.log(items)
      itemsCollection.insertMany(items)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })


  app.post('/addReviews', (req, res) => {
    const reviews = req.body;
    console.log(reviews)
    reviewsCollection.insertMany(reviews)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
    })
})


app.post('/addReview', (req, res) => {
  const newReview = req.body;
  console.log(newReview)
  reviewsCollection.insertOne(newReview)
  .then(result => {
    console.log(result.insertedCount)
    res.send(result.insertedCount>0)
  })
})









  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      
      res.send(result.insertedCount>0)
    })
  })




});


app.listen(process.env.PORT || port);