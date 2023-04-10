const express = require('express');
const cors = require('cors');
// console.log(stripe)

require('dotenv').config()
const app = express()
// require('dotenv').config()
// const jwt = require('jsonwebtoken');


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');

const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uftqkre.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)


async function  run (){
    try{const usersCollection =client.db( "laptop-marcet").collection("users")
    const categoriesCollection = client.db("laptop-marcet").collection('categories');
    const productsCollection = client.db("laptop-marcet").collection('products');
    const bookingsCollection = client.db("laptop-marcet").collection('bookings');
    const messagesCollection = client.db("laptop-marcet").collection('messages');

    app.get('/categories', async (req, res) => {
        const query = {};
        const results = await categoriesCollection.find(query).toArray();
        res.send(results)
    })


    //get products
    app.get('/products', async (req, res) => {
        const email = req.query.email;
        const query = { email: email }
        const results = await productsCollection.find(query).toArray();
        res.send(results)
    })

    app.get('/dashboardProducts', async (req, res) => {
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        console.log(page, size);
        const query = {};
        const cursor = productsCollection.find(query);
        const products = await cursor.skip(page * size).limit(size).toArray();
        const count = await productsCollection.estimatedDocumentCount(products);
        res.send({ count, products });
    })

    app.get('/allproducts', async (req, res) => {
        const query = {};
        const results = await productsCollection.find(query).toArray();
        const cursor = results.filter(result => result.advertised);
        res.send(cursor)
    })

    app.post('/products', async (req, res) => {
        const body = req.body;
        const results = await productsCollection.insertOne(body);
        res.send(results)
    })

    app.delete('/product/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new  ObjectId(id) };
        const results = await productsCollection.deleteOne(query);
        res.send(results)
    })
    app.put('/allproducts/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const option = { upsert: true };
        const updateDoc = {
            $set: {
                advertised: true
            }
        }
        const results = await productsCollection.updateOne(filter, updateDoc, option);
        res.send(results)
    })


    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { categories_ID: id }
        const results = await productsCollection.find(query).toArray();
    //    console.log( results)
        res.send(results)
    })


    //bookings collection

    app.get('/bookings', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const results = await bookingsCollection.find(query).toArray();
        res.send(results)
    });

    app.get('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const results = await bookingsCollection.find(query).toArray();
        res.send(results)
    });

    app.post('/bookings', async (req, res) => {
        const query = req.body;
        const results = await bookingsCollection.insertOne(query);
        res.send(results)
    });

    app.delete('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const results = await bookingsCollection.deleteOne(query);
        res.send(results)
    });



    //user collection
    app.get('/users/:role', async (req, res) => {
        const query = req.params.role;
        const filter = { role: query }
        const results = await usersCollection.find(filter).toArray();
        res.send(results)
    })
    app.get('/users', async (req, res) => {
        const query = req.query.email;
        const filter = { email: query }
        const results = await usersCollection.find(filter).toArray();
        res.send(results)
    })

    app.post('/users', async (req, res) => {
        const query = req.body;
        const results = await usersCollection.insertOne(query);
        res.send(results)
    })

    app.put('/users/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new  ObjectId(id) }
        const option = { upsert: true };
        const updateDoc = {
            $set: {
                verified: true
            }
        }
        const result = await usersCollection.updateOne(filter, updateDoc, option)
        res.send(result)
    })


    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
         const   query= { _id : new ObjectId( id )};
        const results = await usersCollection.deleteOne(query);
        res.send(results)
    })

    //messages
    app.post('/messages', async (req, res) => {
        const query = req.body;
        const results = await messagesCollection.insertOne(query)
        res.send(results)
    })






        

    }
    finally{

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send(' ass 12 server')
})

app.listen(port, () => {
    console.log(`ass 12 ff ${port}`)
})