// Some code from: 
// https://github.com/academind/node-restful-api-tutorial
// https://github.com/KrunalLathiya/MEVNCRUDExample

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const noteRoutes = require("./routes/noteRoutes");
const accountRoutes = require("./routes/accountRoutes");
const notebookRoutes = require("./routes/notebookRoutes");
const uri = process.env.DB_URI;
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(
    () => { console.log('Database is connected'); },
    err => { console.log('Can not connect to the database: ' + err); }
  );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(verifyToken);

app.use("/accounts", accountRoutes);
app.use("/notes", noteRoutes);
app.use("/notebooks", notebookRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error);
  res.json({
    error: { message: error.message } // don't send error back in production
  });
});

app.listen(PORT, console.log('Server is running on port:', PORT));

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization; //get auth header value

  if (!shouldAuth(req)) {
    console.log(req.path + " was excluded from token check.");
    next();
  } else if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1]; // "Bearer [token]"
    jwt.verify(bearerToken, jwt_key, (err, authData) => {
      if (!err) {
        req.authData = authData;
        next();
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    res.sendStatus(403);
  }
}

function shouldAuth(req) {
  const excluded = [
    "/accounts/checkUniqueUsername",
    "/accounts/createAccount",
    "/accounts/login"
  ];
  return !excluded.includes(req.path);
}

module.exports = app;