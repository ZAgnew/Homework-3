const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
app.use(express.json());

// Connection URL
// or your MongoDB Atlas connection string
const url = 'mongodb://localhost:27017/'; 
const client = new MongoClient(url);
const dbName = 'todo_list';

async function connectDB() {
  await client.connect();
  console.log('Connected successfully to MongoDB server');
  return client.db(dbName);
}

// Route to create (insert) tasks
app.post('/tasks', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('tasks');
  const result = await collection.insertOne(req.body);
  res.status(201).send(`Task added with ID: ${result.insertedId}`);
});

// Route to read (find) tasks
app.get('/tasks', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('tasks');
  const tasks = await collection.find({}).toArray();
  res.json(tasks);
});

// Route to update a task
app.put('/tasks/:name', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('tasks');
  const result = await collection.updateOne(
    { name: req.params.name },
    { $set: req.body }
  );
  res.send(`Updated ${result.matchedCount} task(s)`);
});

// Route to delete a task
app.delete('/tasks/:name', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('tasks');
  const result = await collection.deleteOne({ name: req.params.name });
  res.send(`Deleted ${result.deletedCount} task(s)`);
});


app.get('/tasks', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('tasks');
  const tasks = await collection.find({}).toArray();
  res.json(tasks);
});

const path = require('path');

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
