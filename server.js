const express = require('express');
const path = require('path');
const fs = require('fs');
let notes = require('./db/db');
const uuid = require('./helpers/uuid');
const PORT = 3001;
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// GET requests
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('/api/notes', (req, res) => {
  res.status(200).json(notes);
});
// POST request
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a review`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    // read "notes" file and add new note to "notes" array 
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        notes = parsedNotes;
        // write array with new note to "notes" file 
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => writeErr ? console.error(writeErr) : console.info('Notes updated successfully!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening on port ${PORT}`)
);
