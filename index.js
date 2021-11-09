const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

//Middelware
app.use(cors());
app.use(express.json());

//Connecting to Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmw5x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('doctors_portal');
        const appointmentsCollection = database.collection('appointments');


        app.get('/appointments', async (req, res) => {
          const email = req.query.email;
          const date = new Date(req.query.date).toLocaleDateString();

          const query = { email: email, date: date }

          const cursor = appointmentsCollection.find(query);
          const appointments = await cursor.toArray();
          res.json(appointments);
      })

        app.post('/appointments', async (req, res) => {
            const appopintment = req.body;
            const result = await appointmentsCollection.insertOne(appopintment);
            console.log(result);
            res.json(result);
        });

    }
    finally{
        // await client.closes()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello! This is Doctors Portal!');
})

app.listen(port, () => {
  console.log(`Listening at Port :${port}`);
})