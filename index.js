const express = require('express')
const app = express()
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// const stripe = require("stripe")('sk_test_51M8RDNLKi6AEIY807RsdoBfRvECyBfAo3qJVjgq9qFEJyheqLimyAexC3I67Pja7dJvOmelFTQMIz22D5ycTRsMk00MSBHOhfg');

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oz1ak5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const categorysCollection = client.db('resell_laptop').collection('categorys')
    const newistProductsCollection = client.db('resell_laptop').collection('prodcts')
    const buyersProductCollection = client.db('resell_laptop').collection('buyers')
    const sellersProductCollection = client.db('resell_laptop').collection('sellers')
    const usersCollection = client.db('resell_laptop').collection('users')

    try {
        // Fetch all categorys from db
        app.get('/categorys', async (req, res) => {
            const query = {}
            const result = await categorysCollection.find(query).toArray()
            res.send(result)
        })

        app.put('/categorys', async (req, res) => {
            const categoty = req.body;
            const filter = { name: categoty.name }
            console.log(filter)
            const options = { upsert: true };
            const updateDoc = {
                $set: categoty
            };
            console.log(updateDoc)
            const result = await categorysCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // Fetch all Products from db
        app.get('/newistProduct', async (req, res) => {
            const query = {}
            const result = await newistProductsCollection.find(query).limit(10).sort({ date: -1 }).toArray()
            res.send(result)
        })

        app.post('/addNewistProduct', async (req, res) => {
            const product = req.body;
            const result = await newistProductsCollection.insertOne(product)
            res.send(result)
        })

        // Products fetch by category
        app.get('/products/:cata_id', async (req, res) => {
            const cataId = req.params.cata_id;
            const query = { cata_id: cataId }
            const result = await sellersProductCollection.find(query).toArray()
            res.send(result)
        })

        app.put('/addProducts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ads: 'advertised'
                }
            };
            const result = await sellersProductCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        app.post('/addProducts', async (req, res) => {
            const product = req.body;
            const result = await sellersProductCollection.insertOne(product)
            res.send(result)
        })



        // My Product route
        app.get('/myProduct', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email }
            const result = await sellersProductCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/adsProduct', async (req, res) => {
          
            const query = {ads: "advertised"}
            const result = await sellersProductCollection.find(query).toArray()
            res.send(result)
        })


        // Buyer add product her db
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await buyersProductCollection.insertOne(product)
            res.send(result)
        })

        // Buyer get product her db
        app.get('/product', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await buyersProductCollection.find(query).toArray()
            res.send(user)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            res.send(user)
        })

        app.get('/user/:buyer', async (req, res) => {
            const buyer = req.params.buyer;
            console.log(buyer)
            const query = { userRole: buyer }
            const user = await usersCollection.find(query).toArray()
            res.send(user)
        })

        app.get('/user/:seller', async (req, res) => {
            const seller = req.params.seller;
            console.log(seller)
            const query = { userRole: seller }
            const user = await usersCollection.find(query).toArray()
            res.send(user)
        })

        // app.post("/create-payment-intent", async (req, res) => {
        //     const pirce = req.body;
        //     const amount = pirce * 100

        //     // Create a PaymentIntent with the order amount and currency
        //     const paymentIntent = await stripe.paymentIntents.create({
        //         amount: amount,
        //         currency: "usd",
        //         "payment_methods_types": [
        //             "card"
        //         ]
        //     });

        //     res.send({
        //         clientSecret: paymentIntent.client_secret,
        //     });
        // });

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello developer')
})

app.listen(port, () => {

})