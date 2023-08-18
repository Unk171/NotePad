const nt = require('express').Router();
const uuid = require('../helpers/uuid');

const fs = require('fs');
let notes = require('../db/db');

nt.get('/', (req, res) => {
  res.status(200).json(notes);
});



nt.post('/', (req, res) => {
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

module.exports = nt;


