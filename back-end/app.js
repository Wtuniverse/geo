const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'a2003923',
  database: 'geogusser'
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error) => {
    if (error) {
      console.error(error);
      res.send({ error });
    } else {
      res.send({ success: true });
    }
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      res.send({ error: '内部错误' });
    } else {
      if (results.length === 0) {
        res.send({ error: '用户名或密码错误！' });
        return;
      }
      res.send({ success: true });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
