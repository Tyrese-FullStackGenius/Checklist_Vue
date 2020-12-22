// Some code from: 
// https://github.com/academind/node-restful-api-tutorial
// https://github.com/KrunalLathiya/MEVNCRUDExample

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const noteRoutes = require("./routes/notes");
const accountRoutes = require("./routes/accounts");
//const courseRoutes = require("./routes/courses");
const uri = process.env.DB_URI;
const jwt = require('jsonwebtoken');

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

app.use("/accounts", accountRoutes.router);
app.use("/notes", noteRoutes);
//app.use("/courses", courseRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});

module.exports = app;