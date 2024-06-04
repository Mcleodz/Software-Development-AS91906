const express = require('express');
const app = express();
const port = 2000;

//Database files
app.get('/post/entries/:name/:subject/:assignment/:length', (req, res) =>{
  // Gets entry data information
  let name = req.params.name;
  let subject = req.params.subject;
  let assignment = req.params.assignment;
  let length = req.params.length;

  // Formats entry data into json
  let entryData = {
    "name" : name,
    "subject" : subject,
    "assignment" : assignment,
    "duration" : Number(length)
  }

  const fs = require('fs');

  // writes entry data to entries.json db
  let entryObj = fs.readFileSync(__dirname + "/public/data-storage/entries.json", 'utf-8');
  let entries = JSON.parse(entryObj);
  const arr = Array.from(entries);
  arr.push(entryData);
  entryObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/public/data-storage/entries.json", entryObj,'utf-8')

  res.sendStatus(200);
})

app.get('/get/entries/list', (req, res) => {
  const fs = require('fs');

  let entriesObj = fs.readFileSync(__dirname + "/public/data-storage/entries.json", 'utf-8');
  let entriesList = JSON.parse(entriesObj);

  res.send(entriesList)
})

// Timer files
app.get('/timer', (req, res) =>{
  res.sendFile(__dirname + "/public/timer/timer.html");
})

app.get('/timer/script', (req, res) =>{
  res.sendFile(__dirname + '/public/timer/timer.js');
})

// Dashboard files
app.get('/dashboard', (req, res) =>{
  res.sendFile(__dirname + "/public/dashboard/dashboard.html");
})

app.get('/dashboard/script', (req, res) =>{
  res.sendFile(__dirname + "/public/dashboard/dashboard.js");
})

// Styling files
app.get('/font', (req, res) =>{
  res.sendFile(__dirname + "/public/Montserrat/Montserrat-VariableFont_wght.ttf");
})

app.get('/styles', (req, res) =>{
  res.sendFile(__dirname + "/public/styles.css");
})

// Starting server
app.listen(port, () => {
  console.log(`test server listening on ${port}`);
})