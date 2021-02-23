// Some code from: 
// https://github.com/academind/node-restful-api-tutorial
// https://github.com/KrunalLathiya/MEVNCRUDExample

require('dotenv').config();
const mongoose = require('mongoose');
const noteRoutes = require("./routes/noteRoutes");
const notebookRoutes = require("./routes/notebookRoutes");
const accountRoutes = require("./routes/accountRoutes");
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const app = express();
const PORT = process.env.PORT || 4000;

const uri = process.env.DB_URI;
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;

const Accounts = require('./database/accounts');
const Notebooks = require('./database/notebooks');
const Notes = require('./database/notes');

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
    return res.sendStatus(200);
  }
  next();
});


app.use(verifyToken);

app.use("/accounts/:accountId", validateAccountId);
app.use("/accounts", accountRoutes);

app.use("/accounts/:accountId/notebooks/:notebookId", validateNotebookId);
app.use("/accounts/:accountId/notebooks", notebookRoutes);

app.use("/accounts/:accountId/notebooks/:notebookId/notes/:noteId", validateNoteId);
app.use("/accounts/:accountId/notebooks/:notebookId/notes", noteRoutes);


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error);
  res.json({
    error // don't send error back in production
  });
});

app.listen(PORT, console.log('Server is running on port:', PORT));

async function validateAccountId(req, res, next) {
  const accountId = req.params.accountId;
  if (!(await Accounts.exists(accountId))) return res.sendStatus(404);
  if (accountId != req.authData.account._id) return res.sendStatus(403);
  console.log("Validated account id: " + accountId);
  next();
}

async function validateNotebookId(req, res, next) {
  const accountId = req.params.accountId;
  const notebookId = req.params.notebookId;
  if (accountId != await Notebooks.getById(notebookId).owner) return res.sendStatus(403);
  console.log("Validated notebook id: " + notebookId);
  next();
}

async function validateNoteId(req, res, next) {
  const accountId = req.params.accountId;
  const noteId = req.params.notebookId;
  if (accountId != await Notes.getById(noteId).owner) return res.sendStatus(403);
  console.log("Validated note id: " + noteId);
  next();
}


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
    { path: "/accounts/checkUniqueUsername", method: "POST" },
    { path: "/accounts", method: "POST" }, // create account
    { path: "/accounts/login", method: "POST" }
  ];
  let path = req.path;
  path = path.slice(-1) == "/" ? path.slice(0, -1) : path;
  let method = req.method;

  for (var index = 0; index < excluded.length; index++) {
    let request = excluded[index];
    if (request.path == path && request.method == method) return false;
  }
  return true;
}

module.exports = app;