const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster3.wmscsts.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const detailCollection = client.db('detailDB').collection('detail')
    const userCollection = client.db('usersDb').collection('users')
    const taskCollection = client.db('taskDB').collection('tasks')

    app.get('/detail', async(req, res)=> {
      const result = await detailCollection.find().toArray()
      // console.log(result)
      res.send(result)
    })

    app.post('/users', async(req, res) => {
      const user = req.body;
      const query = {email: user.email}
      const isExist = await userCollection.findOne(query)
      if(isExist){
        return res.send({message: 'Your email address is already exist in the database', insertedId: null})
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })

    app.post('/tasks', async(req, res) => {
      const user = req.body;
      const result = await taskCollection.insertOne(user);
      res.send(result)
    })

    app.get('/tasks', async(req, res) => {
      const result = await taskCollection.find().toArray()
      res.send(result)
    })

    app.get('/tasks/email', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      // console.log(query)
      const result = await taskCollection.find(query).toArray();
      res.send(result)
    })

    app.delete('/tasks/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})