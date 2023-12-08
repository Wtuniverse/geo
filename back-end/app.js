const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // password: 'a2003923',
  // database: 'geogusser'
  password: '12345678',
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
      return res.json({
        success: true
      })
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
        res.json({
          error: '用户名或密码错误！',
          data: {
            user: username
          }
        });
        return;
      }
      // create token
      let token = jwt.sign({
        username: username,
        password: password
      }, 'scnuabd', {
        expiresIn: 60 * 60 * 24
      });

      return res.json({
        success: true,
        token: token
      });
    }
  });
});


app.get('/highestscore', (req, res) => {
  // 从请求头获取token
  const tokenParts = req.headers.authorization.split(' ');
  const token = tokenParts[1];
  console.log(token)
  if (!token) {
    return res.json({
      code: -1,
      msg: 'Access denied. No token provided.'
    });
  }
  jwt.verify(token, 'scnuabd', (err, data) => {
    if (err) {
      console.log(err)
      return res.json({
        code: -1,
        msg: "token 校验失败"
      })
    }
    db.query('SELECT MAXscore AS highestScore FROM users WHERE username = ?', [data.username], (err, results) => {
      if (err) {
        console.log(err)
        return res.json({
          code: -1,
          msg: "Error connection of database"
        })
      } else {
        if (results.length == 0) {
          return res.json({
            code: -1,
            msg: "User dosen't exist"
          })
        }
        return res.json({
          code: 1,
          highestScore: results[0].highestScore
        })
      }
    })
  })
})

app.post('/updateScore', (req, res) => {
  // 从请求头获取token
  const tokenParts = req.headers.authorization.split(' ');
  const token = tokenParts[1];
  console.log(token)
  const { score } = req.body; // 从请求体中获取分数

  if (!token) {
    return res.json({
      code: -1,
      msg: 'Access denied. No token provided.'
    });
  }
  jwt.verify(token, 'scnuabd', (err, data) => {
    if (err) {
      console.log(err)
      return res.json({
        code: -2,
        msg: "token 校验失败"
      })
    }
    db.query('SELECT MAXscore FROM users WHERE username = ?', [data.username], (err, results) => {
      if (err) {
        console.log(err)
        return res.json({
          code: -3,
          msg: "Error connection of database"
        })
      } else {
        if (results.length == 0) {
          return res.json({
            code: -4,
            msg: "User dosen't exist"
          })
        }
        // 获取现有的最高分数
        const existingMaxScore = results[0].MAXscore;
        if (score > existingMaxScore) {
          // 更新分数
          db.query('UPDATE users SET MAXscore = ? WHERE username = ?', [score, data.username], (err, updateResults) => {
            if (err) {
              console.log(err);
              return res.json({
                code: -5,
                msg: "Error updating score in database"
              });
            }

            return res.json({
              code: 1,
              msg: "Score updated successfully"
            });
          });
        } else {
          return res.json({
            code: 1,
            msg: "Score is not higher than existing max score"
          });
        }
      }
    })
  })
})


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
