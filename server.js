const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
let db = require("./db/db.json");
const fs = require("fs");
const path = require('path');
const uuid = require('uuid');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  db = JSON.parse(fs.readFileSync('./db/db.json')) || []
  console.info(`${req.method} request has been received to get notes`);
  res.json(db);
});

app.post("/api/notes", (req, res) => {
  const notes = {
    title: req.body.title,
    text: req.body.text,
    id: uuid.v4()
  };

  if (!req.body.title || !req.body.text) {
    return res.status(400).send("make sure to add either a title or text");
  }
  db.push(notes);
  const parsedData = JSON.stringify(db);
  console.info(`${req.method} request has been received to add notes`);

  fs.writeFileSync('./db/db.json', parsedData, (err) =>
    err
      ? console.error(err)
      : console.log(`Notes for ${notes.title} has been written to JSON file`)
  );

  res.status(201).json(db);
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
