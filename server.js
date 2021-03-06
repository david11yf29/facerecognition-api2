const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'DoDoTea',
    password : '',
    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data => {
  console.log(data);
})

const app = express();

// 轉換 req 成 json 才可以傳給 server
app.use(express.json());

app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
};


app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
      return res.json('success')
    }
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body; 
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => {
      res.status(400).json('unable to join');
    });
  // database.users.push({
  //     id: '125',
  //     name: name,
  //     email: email,
  //     password: password,
  //     entries: 0,
  //     joined: new Date()
  // });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  let found = false

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });

  if(!found) {
    return res.status(404).json('not found');
  }
});

app.post('/image', (req, res) => {
  const { id } = req.body;

  let found = false

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if(!found) {
    return res.status(404).json('not found');
  }
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});