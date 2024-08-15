const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 2000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

UNIXTIMEONPAUSE = 0;
DURATIONONPAUSE = 0;

app.get("/", (req, res) => {
  res.redirect("/timer");
});

// Public resource handling
app.get("/timer", (req, res) => {
  res.sendFile(__dirname + "/public/timer.html");
});

app.get("/timer/script", (req, res) => {
  res.sendFile(__dirname + "/public/timer.js");
});

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

app.get("/dashboard/script", (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.js");
});

app.get("/styles", (req, res) => {
  res.sendFile(__dirname + "/public/styles.css");
});

app.get("/font", (req, res) => {
  res.sendFile(
    __dirname + "/src/font/Montserrat/Montserrat-VariableFont_wght.ttf"
  );
});

// Database GET Request handling
app.get("/get/subjects", (req, res) => {
  const fs = require("fs");

  // Reading Entries File
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  let subjectList = [];

  for (let i = 0; i < arr.length; i++) {
    if (subjectList.includes(arr[i].name) == false) {
      subjectList.push(arr[i].name);
    }
  }
  res.send(subjectList);
});

app.get("/get/subjects/colours", (req, res) => {
  const fs = require("fs");

  // Reading Entries File
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  let subjectColoursList = [];

  for (let i = 0; i < arr.length; i++) {
    if (subjectColoursList.includes(arr[i].colour) == false) {
      subjectColoursList.push(arr[i].colour);
    }
  }
  res.send(subjectColoursList);
});

app.get("/get/assignments/:subject", (req, res) => {
  const subject = req.params.subject;
  const fs = require("fs");

  // Reading Entries File
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  let assignmentList = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name == subject) {
      let assignments = arr[i].assignments;
      for (j = 0; j < assignments.length; j++) {
        assignmentList.push(assignments[j].name);
      }
    }
  }
  res.send(assignmentList);
});

app.get("/get/assignments/colours/:subject", (req, res) => {
  const subject = req.params.subject;
  const fs = require("fs");

  // Reading Entries File
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  let assignmentList = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name == subject) {
      let assignments = arr[i].assignments;
      for (j = 0; j < assignments.length; j++) {
        assignmentList.push(assignments[j].colour);
      }
    }
  }
  res.send(assignmentList);
});

app.get("/get/tags", (req, res) => {
  const fs = require("fs");

  // Reading Entries File
  let tagsObj = fs.readFileSync(__dirname + "/src/tags.json", "utf-8");
  let tags = JSON.parse(tagsObj);
  const arr = Array.from(tags);

  let tagList = [];

  for (let i = 0; i < arr.length; i++) {
    tagList.push(arr[i].name);
  }

  res.send(tagList);
});

app.get("/get/tags/colours", (req, res) => {
  const fs = require("fs");

  // Reading Entries File
  let tagsObj = fs.readFileSync(__dirname + "/src/tags.json", "utf-8");
  let tags = JSON.parse(tagsObj);
  const arr = Array.from(tags);

  let tagColourList = [];

  for (let i = 0; i < arr.length; i++) {
    tagColourList.push(arr[i].colour);
  }
  res.send(tagColourList);
});

app.get("/get/times/subject/:subject", (req, res) => {
  const subject = req.params.subject;
  const fs = require("fs");

  // Reading Entries File
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  let totalTime = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].subject == subject) {
      totalTime += Number(arr[i].duration);
    }
  }
  res.send(String(totalTime));
});

app.get("/get/times/assignment/:subject/:assignment", (req, res) => {
  const subject = req.params.subject;
  const assignment = req.params.assignment;
  const fs = require("fs");

  // Reading Entries File
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  let totalTime = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].subject == subject && arr[i].assignment == assignment) {
      totalTime += Number(arr[i].duration);
    }
  }
  res.send(String(totalTime));
});

app.get("/get/times/tag/:tag", (req, res) => {
  const tag = req.params.tag;
  const fs = require("fs");

  // Reading Entries File
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  let totalTime = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].tag == tag) {
      totalTime += Number(arr[i].duration);
    }
  }
  res.send(String(totalTime));
});

app.get("/get/times/total", (req, res) => {
  const fs = require("fs");

  // Reading Entries File
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  let totalTime = 0;

  for (let i = 0; i < arr.length; i++) {
    totalTime = totalTime + Number(arr[i].duration);
  }
  res.send(String(totalTime));
});

app.get("/resume", (req, res) => {
  if (UNIXTIMEONPAUSE > 0) {
    let newTime = new Date();
    let newTimeProcessed = newTime.getTime();
    let deltaTime = (newTimeProcessed - UNIXTIMEONPAUSE) / 1000;
    let resObj = {
      count: deltaTime,
      duration: DURATIONONPAUSE,
    };
    res.send(resObj);
  } else {
    let resObj = JSON.stringify({
      count: 0,
      duration: DURATIONONPAUSE,
    });
    res.send(resObj);
  }
  UNIXTIMEONPAUSE = 0;
  DURATIONONPAUSE = 0;
});

app.get("/get/goalsDict", (req, res) => {
  const fs = require("fs");
  let goalsDict = [];

  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  for (let i = 0; i < arr.length; i++) {
    goalsDict.push({
      goalSubject: arr[i].subject,
      goalDuration: arr[i].duration,
      goalColour: arr[i].colour,
    });
  }
  res.send(goalsDict);
});

app.get("/get/goalsTotal", (req, res) => {
  const fs = require("fs");

  let total = 0;

  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  for (let i = 0; i < arr.length; i++) {
    total += Number(arr[i].duration);
  }
  res.send(String(total));
});

// Database POST Request handling
app.post("/post/newSubject", async (req, res) => {
  const name = await req.body.name;
  const colour = await req.body.colour;
  const fs = require("fs");

  // Reading Entries File
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  const newSubjectData = {
    name: name,
    colour: colour,
    assignments: [],
  };

  arr.push(newSubjectData);
  subjectsObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/subjects.json", subjectsObj, "utf-8");

  res.sendStatus(201);
});

app.post("/post/newTag", async (req, res) => {
  const name = await req.body.name;
  const colour = await req.body.colour;
  const fs = require("fs");

  // Reading Entries File
  let tagsObj = fs.readFileSync(__dirname + "/src/tags.json", "utf-8");
  let tags = JSON.parse(tagsObj);
  const arr = Array.from(tags);

  const newSubjectData = {
    name: name,
    colour: colour,
  };

  arr.push(newSubjectData);
  tagsObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/tags.json", tagsObj, "utf-8");

  res.sendStatus(201);
});

app.post("/post/newAssignment", async (req, res) => {
  const name = await req.body.name;
  const colour = await req.body.colour;
  const subject = await req.body.subject;

  const fs = require("fs");

  // Reading Entries File
  let subjectObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectObj);
  const arr = Array.from(subjects);

  for (i = 0; i < arr.length; i++) {
    if (arr[i].name == subject) {
      arr[i].assignments.push({
        name: name,
        colour: colour,
      });
    }
  }
  subjectObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/subjects.json", subjectObj, "utf-8");
  res.sendStatus(200);
});

app.post("/post/newGoal", async (req, res) => {
  const fs = require("fs");

  const newGoalSubject = await req.body.subjectName;
  const newGoalDuration = await req.body.goalDuration;
  const newGoalColour = await req.body.goalColour;

  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  let newGoal = {
    subject: newGoalSubject,
    duration: String(Number(newGoalDuration) * 3600),
    colour: newGoalColour,
  };

  arr.push(newGoal);

  goalsObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/goals.json", goalsObj, "utf-8");

  res.sendStatus(200);
});

app.post("/post/editGoal", async (req, res) => {
  const fs = require("fs");

  const goalSubject = await req.body.subjectName;
  const newGoalDuration = await req.body.goalDuration;

  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  for (i = 0; i < arr.length; i++) {
    if (arr[i].subject == goalSubject) {
      arr[i].duration = String(Number(newGoalDuration) * 3600);
    }
  }
  tagsObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/goals.json", tagsObj, "utf-8");
  res.sendStatus(200);
});

app.post("/post/removeGoal", async (req, res) => {
  const fs = require("fs");

  const goalSubject = await req.body.subjectName;

  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  for (i = 0; i < arr.length; i++) {
    if (arr[i].subject == goalSubject) {
      arr.splice(i, 1);
    }
  }
  tagsObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/goals.json", tagsObj, "utf-8");
  res.sendStatus(200);
});

app.post("/post/newEntry", async (req, res) => {
  // Declaring Variables
  const newEntryName = await req.body.name;
  const newEntrySubject = await req.body.subject;
  const newEntryAssignment = await req.body.assignment;
  const newEntryTag = await req.body.tag;
  const newEntryDuration = await req.body.duration;
  const fs = require("fs");

  // Reading Entries File
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  const newEntryData = {
    name: newEntryName,
    subject: newEntrySubject,
    assignment: newEntryAssignment,
    tag: newEntryTag,
    duration: newEntryDuration,
  };

  arr.push(newEntryData);
  entriesObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/entries.json", entriesObj, "utf-8");

  res.sendStatus(201);
});

app.post("/post/clearEntries", async (req, res) => {
  // Declaring Variables
  const fs = require("fs");

  // Reading Entries File
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  let arr = Array.from(entries);
  arr = [];
  entriesObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/entries.json", entriesObj, "utf-8");

  res.sendStatus(200);
});

app.post("/post/clearAssignments", async (req, res) => {
  // Declaring Variables
  const fs = require("fs");

  // Reading Entries File
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  let subjectsArr = Array.from(subjects);
  for (let i = 0; i < subjectsArr.length; i++) {
    subjectsArr[i].assignments = [];
  }
  subjectsObj = JSON.stringify(subjectsArr, null, 4);
  fs.writeFileSync(__dirname + "/src/subjects.json", subjectsObj, "utf-8");

  res.sendStatus(200);
});

app.post("/post/clearData", async (req, res) => {
  // Declaring Variables
  const fs = require("fs");

  // Reading Entries File
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  let entriesArr = Array.from(entries);
  entriesArr = [];
  entriesObj = JSON.stringify(entriesArr, null, 4);
  fs.writeFileSync(__dirname + "/src/entries.json", entriesObj, "utf-8");

  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  let subjectsArr = Array.from(subjects);
  subjectsArr = [];
  subjectsObj = JSON.stringify(subjectsArr, null, 4);
  fs.writeFileSync(__dirname + "/src/subjects.json", subjectsObj, "utf-8");

  let tagsObj = fs.readFileSync(__dirname + "/src/tags.json", "utf-8");
  let tags = JSON.parse(tagsObj);
  let tagsArr = Array.from(tags);
  tagsArr = [];
  tagsObj = JSON.stringify(tagsArr, null, 4);
  fs.writeFileSync(__dirname + "/src/tags.json", tagsObj, "utf-8");

  res.sendStatus(200);
});

app.post("/pause", (req, res) => {
  UNIXTIMEONPAUSE = req.body.unixtimeonpause;
  DURATIONONPAUSE = req.body.durationonpause;

  res.sendStatus(200);
});

// Starting server
app.listen(port, () => {
  console.log(`server active on 'http://localhost:${port}'`);
});
