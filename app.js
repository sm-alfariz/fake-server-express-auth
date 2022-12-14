/**
 * To get started install
 * express bodyparser jsonwebtoken express-jwt
 * via npm
 * command :-
 * npm install express body-parser jsonwebtoken express-jwt --save
 */

// Bringing all the dependencies in
const { readFileSync } = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {join} = require('path')
var { expressjwt: expjwt } = require("express-jwt");
const app = express();
const priv_key = join(__dirname, "jwtRS256.key");

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const payload = {
    desk: "fake only",
};
// INstantiating the express-jwt middleware
const exp_jwt = expjwt({
    secret: 'keyboard cat 4 ever',
    algorithms: ["HS256"]
});


// MOCKING DB just for test
let users = [
    {
      "id": 1,
      "email": "fendi@mail.com",
      "username": "fendi@mail.com",
      "password": "fendi",
      "firstname": "efendi",
      "lastname": "hariyadi",
      "age": 99,
      "kab": "Kutai Kartanegara",
      "kec": "Samboja",
      "kel": "Pemedas",
      "rt_no": 1,
      "tps_no": 1
    }
];

// LOGIN ROUTE
app.post('/api/auth', (req, res) => {
    const { email, password } = req.body;
    for (let user of users) { 
        if (email == user.email && password == user.password ) {
            let token = jwt.sign({ 
                id: user.id, 
                email: user.email 
            }, 'keyboard cat 4 ever',
            { expiresIn: "1d" }); // Sigining the token

            res.json({
                accessToken: token,
                user: {
                    "id": user.id,
                    "email": user.email,
                    "firstname": user.firstname,
                    "lastname": user.lastname,
                    "age": user.age,
                    "kab": user.kab,
                    "kec": user.kec,
                    "kel": user.kel,
                    "rt_no": user.rt_no,
                    "tps_no": user.tps_no
                } 
            });
            break;
        }
        else {
            res.status(401).json({
                accessToken: null,
                user: null
            });
        }
    }
});
app.get('/survei', exp_jwt,(req, res) => {
  const survei = readFileSync('./survei.json');
  res.send(JSON.parse(survei));
})
app.get('/survei/:survei_id', exp_jwt, (req, res) => {
  const survei = readFileSync('./survei.json');
  data = JSON.parse(survei);
  const arr = data['survei'];  
  const result = arr.filter(el => {
   return el['id'] === parseInt(req.params.survei_id);
  });
  res.send(result[0])
  
});

app.get('/', exp_jwt /* Using the express jwt MW here */, (req, res) => {
    res.send({"messages":'You are authenticated'}); //Sending some response when authenticated
});

// Error handling 
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        res.status(401)
            .send({
                "status": 401,
                "messages": "Gagal Autentifkasi",
            });
    }
    else {
        next(err);
    }
});

// Starting the app on PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Magic happens on port ${PORT}`);
});