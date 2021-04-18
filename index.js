const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(bodyParser.json());
app.use(cors());

// const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.slxtz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//====Service Collection===== 

client.connect(err => {
    console.log('connection error', err);
    const serviceCollection = client.db("fitnessService").collection("service");

    app.get('/home', (req, res) => {
        serviceCollection.find()
          .toArray((err, items) => {
            res.send(items)
          })
      })

      app.get('/manage', (req, res) => {
        serviceCollection.find()
          .toArray((err, products) => {
            res.send(products)
          })
      })

    app.post('/admin', (req, res) => {
        const newService = req.body;
        console.log('adding new Service', newService);

        serviceCollection.insertOne(newService)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/review', (req, res) => {
      const newReview = req.body;
      console.log('adding new Service', newReview);

      serviceCollection.insertOne(newReview)
          .then(result => {
              console.log('inserted count', result.insertedCount)
              res.send(result.insertedCount > 0)
          })
  })

    app.get('/service/:id', (req, res) => {
      const id = ObjectId(req.params.id);
      serviceCollection.find({ _id: id })
        .toArray((err, documents) => {
          res.send(documents[0]);
        })
    })

    app.delete('/delete/:id', (req, res) => {

        serviceCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
          .then(result => {
            res.send(result.deletedCount > 0)
          })
        console.log(req.params.id);
      })
});

//====Testimonials Collection===== 

client.connect(err => {
  console.log('connection error', err);
  const testimonialsCollection = client.db("fitnessService").collection("testimonials");

  
  app.get('/homeTestimonial', (req, res) => {
    testimonialsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  app.post('/user', (req, res) => {
    const newTestimonial = req.body;
    console.log('adding new Service', newTestimonial);

    testimonialsCollection.insertOne(newTestimonial)
        .then(result => {
            console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
})

});

//Bookings Collection
client.connect(err => {
  console.log('connection error', err);
  const bookingsCollection = client.db("fitnessService").collection("bookings");
  
  app.post('/addBooking', (req, res)=>{
    const newBooking= req.body;
    bookingsCollection.insertOne(newBooking)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
    console.log(newBooking);
  })

  app.get('/booking', (req, res) =>{
    bookingsCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents)

    })
  })

  app.get('/orders', (req, res) => {
    bookingsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })
   
});

//Postman Collection
client.connect(err => {
  console.log('connection error', err);
  const postmanCollection = client.db("fitnessService").collection("postman");
  
  app.post('/postman', (req, res)=>{
    const newPostman= req.body;
    postmanCollection.insertOne(newPostman)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
    console.log(newPostman);
  })
   
});


const port = 5000;

app.get('/', (req, res) => {
    res.send("hello its working");
})
app.listen(process.env.PORT || port)