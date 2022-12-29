const express = require("express");
const cors = require("cors");
const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://aircnc:C8o2xN8kfskHomGS@cluster0.eurlfla.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
try {
  const addtodolist = client.db("todo").collection("newtodo");
  const completelist = client.db("todo").collection("complete");
  const commentlist = client.db("todo").collection("comments");

  app.post('/comment', async(req, res) => {
    const data = req.body
    const result = await commentlist.insertOne(data)
    res.send(result)
  })
  app.get('/comment', async(req, res) => {
    const query = {}
    const result = await commentlist.find(query).toArray()
    res.send(result)
  })
  app.post("/", async (req, res) => {
    const todo = req.body;
    const data = await addtodolist.insertOne(todo);
    res.send(data);
  });
  app.get("/update/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await addtodolist.findOne(query);
    res.send(result);
   
  });
  app.get("/", async (req, res) => {
    const query = {};
    const data = await addtodolist.find(query).sort({ $natural: -1 }).toArray();
    res.send(data);
  });
app.put('/update/:id', async( req, res) => {
  const id = req.params.id 
  
  const filter = {_id: ObjectId(id)}
  const options = { upsert: true };
  const data = req.body
  const update={
    $set:{
      todoname:data.todoname
    }
}
const result = await addtodolist.updateOne( filter, update, options);
res.send(result)
console.log(result)
})

  app.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await addtodolist.deleteOne(query);
    res.send(result);
  });

  app.post("/complete", async (req, res) => {
    const completed = req.body;
    const result = await completelist.insertOne(completed);
    res.send(result);
  });

  app.delete("/complete/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const data = await completelist.deleteOne(query);
    res.send(data);
  });
  app.get("/complete", async (req, res) => {
    const query = {};
    const data = await completelist
      .find(query)
      .sort({ $natural: -1 })
      .toArray();
    res.send(data);
  });
} catch (err) {
  console.log(err.message);
}

app.listen(port, () => {
  console.log("server is runing");
});
