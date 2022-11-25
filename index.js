const express = require('express')
const app = express()
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oz1ak5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const categorysCollection = client.db('resell_laptop').collection('categorys')
    const productsCollection = client.db('resell_laptop').collection('prodcts')
    const buyersCollection = client.db('resell_laptop').collection('buyers')
    const sellersCollection = client.db('resell_laptop').collection('sellers')
    const usersCollection = client.db('resell_laptop').collection('users')

    try {
        // Fetch all categorys from db
        app.get('/categorys', async (req, res) => {
            const query = {}
            const result = await categorysCollection.find(query).toArray()
            res.send(result)
        })

        // Fetch all Products from db
        app.get('/products', async (req, res) => {
            const query = {}
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })

        // Products fetch by category
        app.get('/products/:cata_id', async (req, res) => {
            const cataId = req.params.cata_id;
            const query = { cata_id: cataId }
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })

        // Products fetch by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {}
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await buyersCollection.insertOne(product)
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.get('/user', async(req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = {email: email}
            const user = await usersCollection.findOne(query)
            res.send(user)
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello developer')
})

app.listen(port, () => {
    console.log('server is running')
})