const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://shawonena03:7dymkBn8Gccnnbbb@cluster0.omm4itw.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("Shawon");
    const userCollection = database.collection("userCollection");

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    app.post("/user", async (req, res) => {
      const newuser = req.body;
      const result = await userCollection.insertOne(newuser);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log(`trying to delete id${id}`);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const user = req.body;
      const options = { upsert: true };
      const updateuser = {
        $set: {
          name: user.name,
          address: user.address,
          phone: user.phone,
          email: user.email,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updateuser,
        options
      );
      res.send(result);
    });
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 80");
});
