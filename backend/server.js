const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;


mongoose.connect('mongodb+srv://clertiDev:y33d_2511@cluster0.eqllfms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});


const userSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  age: String,
  gender: String,
  course: String,
});

const User = mongoose.model('User ', userSchema); 


app.use(cors());
app.use(express.json());



// Create a new user
app.post('/users', (req, res) => {
  const { firstName, middleName, lastName, age, gender, course } = req.body;
  const user = new User({ firstName, middleName, lastName, age, gender, course });
  user.save()
    .then((savedUser ) => {
      res.send({ message: 'User  created successfully' });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error creating user' });
    });
});

// Get all users
app.get('/users', (req, res) => {
  User.find().then((users) => {
    res.send(users);
  }).catch((err) => {
    res.status(500).send({ message: 'Error fetching users' });
  });
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id).then((user) => {
    if (!user) {
      res.status(404).send({ message: 'User  not found' });
    } else {
      res.send(user);
    }
  }).catch((err) => {
    res.status(500).send({ message: 'Error fetching user' });
  });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { firstName, middleName, lastName, age, gender, course} = req.body;
  User.findByIdAndUpdate(id, { firstName, middleName, lastName, age, gender, course }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User  not found' });
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error updating user' });
    });
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser  = await User.findByIdAndDelete(id);
    if (!deletedUser ) {
      return res.status(404).send({ message: 'User  not found' });
    }
    res.send({ message: 'User  deleted successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error deleting user' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});