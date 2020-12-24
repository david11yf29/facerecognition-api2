const express = require('express');

const app = express();

// 轉換 req 成 json 才可以傳給 server
app.use(express.json());

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
      res.json('success')
    } else {
      res.status(400).json('error logging in')
    }
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body; 
  database.users.push({
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
  });
  res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  database.users.forEach((user) => {
    if (user.id === id) {
      res.json(user);
    } else {
      res.status(404).json('no such user');
    }
  })
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});