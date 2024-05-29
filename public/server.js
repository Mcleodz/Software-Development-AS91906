const express = require('express');
const app = express();
const port = 2000;

// Timer files
app.get('/timer', (req, res) =>{
  res.sendFile(__dirname + "/timer/timer.html");
})

app.get('/timer/script', (req, res) =>{
  res.sendFile(__dirname + '/timer/timer.js');
})

// Dashboard files
app.get('/dashboard', (req, res) =>{
  res.sendFile(__dirname + "/dashboard/dashboard.html");
})

app.get('/dashboard/script', (req, res) =>{
  res.sendFile(__dirname + "/dashboard/dashboard.js");
})

// Styling files
app.get('/font', (req, res) =>{
  res.sendFile(__dirname + "/Montserrat/Montserrat-VariableFont_wght.ttf");
})

app.get('/styles', (req, res) =>{
  res.sendFile(__dirname + "/styles.css");
})

// Starting server
app.listen(port, () => {
  console.log(`test server listening on ${port}`);
})