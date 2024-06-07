const express = require('express');
const app = express();
const port = 2000;

app.get('/', (req, res) =>{
  res.redirect('/timer')
})

//Database files
app.get('/post/entries/:name/:subject/:assignment/:tags/:length', (req, res) =>{
  // Gets entry data information
  const name = req.params.name;
  const subject = req.params.subject;
  const assignment = req.params.assignment;
  const tag = req.params.tags;
  const length = req.params.length;

  // Formats entry data into json
  const entryData = {
    "name" : name,
    "subject" : subject,
    "assignment" : assignment,
    "tag" : tag,
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
  console.log(`server active on 'http://localhost:${port}'`);
})