const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 2000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/pip-styles", (req, res) => {
  res.sendFile(__dirname + "/public/pip-styles.css");
});

app.get("/font", (req, res) => {
  res.sendFile(
    __dirname + "/src/font/Montserrat/Montserrat-VariableFont_wght.ttf"
  );
});

// Database GET Request handling
app.get("/get/entries", (req, res) => {
  const fs = require("fs");

  // Reading entries file
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  let entryList = [];

  for (let i = 0; i < arr.length; i++) {
    entryList.push(arr[i]);
  }

  // Returns list of all saved entries
  res.send(entryList);
});

app.get("/get/subjects", (req, res) => {
  const fs = require("fs");

  // Reading subjects.json file
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  let subjectList = [];

  for (let i = 0; i < arr.length; i++) {
    if (subjectList.includes(arr[i].name) == false) {
      // Appends current subject to list of subjects
      subjectList.push(arr[i].name);
    }
  }
  // Returns list of subjects
  res.send(subjectList);
});

app.get("/get/subjects/colours", (req, res) => {
  const fs = require("fs");

  // Reading subjects.json file
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  let subjectColoursList = [];

  for (let i = 0; i < arr.length; i++) {
    if (subjectColoursList.includes(arr[i].colour) == false) {
      // Appends current subject colour to list
      subjectColoursList.push(arr[i].colour);
    }
  }
  // Returns list of subject colours
  res.send(subjectColoursList);
});

app.get("/get/assignments/:subject", (req, res) => {
  const subject = req.params.subject;
  const fs = require("fs");

  // Reading subjects.json file
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  let assignmentList = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name == subject) {
      let assignments = arr[i].assignments;
      for (j = 0; j < assignments.length; j++) {
        // Appends assignment names to list of designated subjects assignments
        assignmentList.push(assignments[j].name);
      }
    }
  }
  // Returns list of assignments for specified subject
  res.send(assignmentList);
});

app.get("/get/assignments/colours/:subject", (req, res) => {
  const subject = req.params.subject;
  const fs = require("fs");

  // Reading subjects.json file
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  let assignmentList = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name == subject) {
      let assignments = arr[i].assignments;
      for (j = 0; j < assignments.length; j++) {
        // Appends current assignment colour to list
        assignmentList.push(assignments[j].colour);
      }
    }
  }

  // Returns list of assignment colours for specified subject
  res.send(assignmentList);
});

app.get("/get/tags", (req, res) => {
  const fs = require("fs");

  // Reading tags.json file
  let tagsObj = fs.readFileSync(__dirname + "/src/tags.json", "utf-8");
  let tags = JSON.parse(tagsObj);
  const arr = Array.from(tags);

  let tagList = [];

  for (let i = 0; i < arr.length; i++) {
    // Appends current tag name to list of tags
    tagList.push(arr[i].name);
  }

  // Returns list of tags
  res.send(tagList);
});

app.get("/get/tags/colours", (req, res) => {
  const fs = require("fs");

  // Reading tags.json file
  let tagsObj = fs.readFileSync(__dirname + "/src/tags.json", "utf-8");
  let tags = JSON.parse(tagsObj);
  const arr = Array.from(tags);

  let tagColourList = [];

  for (let i = 0; i < arr.length; i++) {
    // Appends current tag colour to list
    tagColourList.push(arr[i].colour);
  }
  // Returns list of tag colours
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
      // Adds total duration for subject to total time
      totalTime += Number(arr[i].duration);
    }
  }

  // Returns total time for time entries
  res.send(String(totalTime));
});

app.get("/get/times/assignment/:subject/:assignment", (req, res) => {
  const subject = req.params.subject;
  const assignment = req.params.assignment;
  const fs = require("fs");

  // Reading entries.json file
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  let totalTime = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].subject == subject && arr[i].assignment == assignment) {
      // Adds current entry time to total time for specified assignment
      totalTime += Number(arr[i].duration);
    }
  }
  // Returns total time spent in time entries for specified assignment
  res.send(String(totalTime));
});

app.get("/get/times/tag/:tag", (req, res) => {
  const tag = req.params.tag;
  const fs = require("fs");

  // Reading entries.json file
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  let totalTime = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].tag == tag) {
      // Adds current entry time to total time for specified tag
      totalTime += Number(arr[i].duration);
    }
  }
  // Returns total time for specified tag
  res.send(String(totalTime));
});

app.get("/get/times/total", (req, res) => {
  const fs = require("fs");

  // Reading entries.json file
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  let totalTime = 0;

  for (let i = 0; i < arr.length; i++) {
    // Adds current time entry time to total time
    totalTime = totalTime + Number(arr[i].duration);
  }
  // Returns total time for all time entries
  res.send(String(totalTime));
});

app.get("/get/goalsDict", (req, res) => {
  const fs = require("fs");
  let goalsDict = [];

  // Reading goals.json file
  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  for (let i = 0; i < arr.length; i++) {
    // Appends Goal subject, length of goal, and goal colour to dict
    goalsDict.push({
      goalSubject: arr[i].subject,
      goalDuration: arr[i].duration,
      goalColour: arr[i].colour,
    });
  }
  // Returns dict of all goal data
  res.send(goalsDict);
});

app.get("/get/goalsTotal", (req, res) => {
  const fs = require("fs");

  let total = 0;

  // Reading goals.json file
  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  for (let i = 0; i < arr.length; i++) {
    // Adds current goal time to total goal time
    total += Number(arr[i].duration);
  }

  // Returns total goal time
  res.send(String(total));
});

// Database POST Request handling
app.post("/post/newSubject", async (req, res) => {
  const name = await req.body.name;
  const colour = await req.body.colour;
  const fs = require("fs");

  // Reading subjects.json file
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  const arr = Array.from(subjects);

  // Collates new subject data
  const newSubjectData = {
    name: name,
    colour: colour,
    assignments: [],
  };

  // Adds new subject data to json file
  arr.push(newSubjectData);
  subjectsObj = JSON.stringify(arr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/subjects.json", subjectsObj, "utf-8");

  // Returns success
  res.sendStatus(201);
});

app.post("/post/newTag", async (req, res) => {
  const name = await req.body.name;
  const colour = await req.body.colour;
  const fs = require("fs");

  // Reading tags.json file
  let tagsObj = fs.readFileSync(__dirname + "/src/tags.json", "utf-8");
  let tags = JSON.parse(tagsObj);
  const arr = Array.from(tags);

  // Collates new tag data
  const newTagData = {
    name: name,
    colour: colour,
  };

  // Adds new tag data to json file
  arr.push(newTagData);
  tagsObj = JSON.stringify(arr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/tags.json", tagsObj, "utf-8");

  // Returns success
  res.sendStatus(201);
});

app.post("/post/newAssignment", async (req, res) => {
  const name = await req.body.name;
  const colour = await req.body.colour;
  const subject = await req.body.subject;

  const fs = require("fs");

  // Reading subjects.json file
  let subjectObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectObj);
  const arr = Array.from(subjects);

  for (i = 0; i < arr.length; i++) {
    if (arr[i].name == subject) {
      // Appends new assignment data to assignment list for subject
      arr[i].assignments.push({
        name: name,
        colour: colour,
      });
    }
  }
  subjectObj = JSON.stringify(arr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/subjects.json", subjectObj, "utf-8");

  // Returns sucess
  res.sendStatus(201);
});

app.post("/post/newGoal", async (req, res) => {
  const fs = require("fs");

  const newGoalSubject = await req.body.subjectName;
  const newGoalDuration = await req.body.goalDuration;
  const newGoalColour = await req.body.goalColour;

  // Reading goals.json file
  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  // Collates new goal data
  let newGoal = {
    subject: newGoalSubject,
    duration: String(Number(newGoalDuration) * 3600),
    colour: newGoalColour,
  };

  // Appends new goal data to json file
  arr.push(newGoal);

  goalsObj = JSON.stringify(arr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/goals.json", goalsObj, "utf-8");

  // Returns success
  res.sendStatus(201);
});

app.post("/post/editGoal", async (req, res) => {
  const fs = require("fs");

  const goalSubject = await req.body.subjectName;
  const newGoalDuration = await req.body.goalDuration;

  // Reading goals.json file
  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  for (i = 0; i < arr.length; i++) {
    if (arr[i].subject == goalSubject) {
      // Updates goal durationb with new goal duration
      arr[i].duration = String(Number(newGoalDuration) * 3600);
    }
  }
  tagsObj = JSON.stringify(arr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/goals.json", tagsObj, "utf-8");

  // Returns success
  res.sendStatus(200);
});

app.post("/post/removeGoal", async (req, res) => {
  const fs = require("fs");

  const goalSubject = await req.body.subjectName;

  // Reading goals.json file
  let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", "utf-8");
  let goals = JSON.parse(goalsObj);
  const arr = Array.from(goals);

  for (i = 0; i < arr.length; i++) {
    if (arr[i].subject == goalSubject) {
      // Removes goal from json file
      arr.splice(i, 1);
    }
  }
  tagsObj = JSON.stringify(arr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/goals.json", tagsObj, "utf-8");

  // Returns success
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

  // Reading entries.json file
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  const arr = Array.from(entries);

  // Collates new entry data
  const newEntryData = {
    name: newEntryName,
    subject: newEntrySubject,
    assignment: newEntryAssignment,
    tag: newEntryTag,
    duration: newEntryDuration,
  };

  // Appends new entry data to json file
  arr.push(newEntryData);
  entriesObj = JSON.stringify(arr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/entries.json", entriesObj, "utf-8");

  // Returns success
  res.sendStatus(201);
});

app.post("/post/clearEntries", async (req, res) => {
  // Declaring Variables
  const fs = require("fs");

  // Reading entries.json file
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  let arr = Array.from(entries);
  // Resets json file data
  arr = [];
  entriesObj = JSON.stringify(arr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/entries.json", entriesObj, "utf-8");

  // Returns success
  res.sendStatus(200);
});

app.post("/post/clearAssignments", async (req, res) => {
  // Declaring Variables
  const fs = require("fs");

  // Reading subjects.json file
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  let subjectsArr = Array.from(subjects);
  for (let i = 0; i < subjectsArr.length; i++) {
    // Sets subjects assignments to empty list
    subjectsArr[i].assignments = [];
  }
  subjectsObj = JSON.stringify(subjectsArr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/subjects.json", subjectsObj, "utf-8");

  // Returns success
  res.sendStatus(200);
});

app.post("/post/clearData", async (req, res) => {
  // Declaring Variables
  const fs = require("fs");

  // Reading entries.json file
  let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", "utf-8");
  let entries = JSON.parse(entriesObj);
  let entriesArr = Array.from(entries);

  // Sets entries list to an empty list
  entriesArr = [];
  entriesObj = JSON.stringify(entriesArr, null, 4);

  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/entries.json", entriesObj, "utf-8");

  // Reading subjects.json file
  let subjectsObj = fs.readFileSync(__dirname + "/src/subjects.json", "utf-8");
  let subjects = JSON.parse(subjectsObj);
  let subjectsArr = Array.from(subjects);
  // Sets subjects list to an empty list
  subjectsArr = [];
  subjectsObj = JSON.stringify(subjectsArr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/subjects.json", subjectsObj, "utf-8");

  // Reading tags.json file
  let tagsObj = fs.readFileSync(__dirname + "/src/tags.json", "utf-8");
  let tags = JSON.parse(tagsObj);
  let tagsArr = Array.from(tags);
  // Sets tags list to an empty list
  tagsArr = [];
  tagsObj = JSON.stringify(tagsArr, null, 4);
  // Saves updated json file
  fs.writeFileSync(__dirname + "/src/tags.json", tagsObj, "utf-8");

  // Returns success
  res.sendStatus(200);
});

// Starting server
app.listen(port, () => {
  console.log(`server active on 'http://localhost:${port}'`);
});
