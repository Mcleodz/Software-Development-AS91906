const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 2000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

UNIXTIMEONPAUSE = 0;
DURATIONONPAUSE = 0;

app.get('/', (req, res) =>{
    res.redirect('/timer');
});

// Public resource handling
app.get('/timer', (req, res) =>{
    res.sendFile(__dirname + "/public/timer.html")
});

app.get('/timer/script', (req, res) =>{
    res.sendFile(__dirname + "/public/timer.js")
});

app.get('/dashboard', (req, res) =>{
    res.sendFile(__dirname + "/public/dashboard.html")
});

app.get('/dashboard/script', (req, res) =>{
    res.sendFile(__dirname + "/public/dashboard.js")
});

app.get('/goals', (req, res) =>{
    res.sendFile(__dirname + "/public/goals.html")
});

app.get('/goals/script', (req, res) =>{
    res.sendFile(__dirname + "/public/goals.js")
});


app.get('/styles', (req, res) =>{
    res.sendFile(__dirname + "/public/styles.css")
});

app.get('/font', (req, res) =>{
    res.sendFile(__dirname + "/src/font/Montserrat/Montserrat-VariableFont_wght.ttf")
});

// Database GET Request handling
app.get('/get/subjects', (req, res) =>{
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let currentSubject = '';
    let subjectList = [];

    for (i=0; i < arr.length; i++){
        currentSubject = arr[i].subject;
        if (subjectList.includes(currentSubject) == false){
            subjectList.push(currentSubject);
        }
    }
    res.send(subjectList);
});

app.get('/get/assignments/:subject', (req, res) =>{
    const subject = req.params.subject;
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let currentAssignment = '';
    let assignmentList = [];

    for (i=0; i < arr.length; i++){
        if (arr[i].subject == subject){
            currentAssignment = arr[i].assignment
            if (assignmentList.includes(currentAssignment) == false){
                assignmentList.push(currentAssignment);
            }
        }
    }
    res.send(assignmentList);
});

app.get('/get/tags', (req, res) =>{
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let currentTag = '';
    let tagList = [];

    for (i=0; i < arr.length; i++){
        currentTag = arr[i].tag
        if (tagList.includes(currentTag) == false){
            tagList.push(currentTag);
        }
    }
    res.send(tagList);
});

app.get('/get/times/subject/:subject', (req, res) =>{
    const subject = req.params.subject;
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let totalTime = 0;

    for (i=0; i < arr.length; i++){
        if (arr[i].subject == subject){
            totalTime += Number(arr[i].duration);
        }
    }
    res.send(String(totalTime));
});

app.get('/get/times/assignment/:subject/:assignment', (req, res) =>{
    const subject = req.params.subject;
    const assignment = req.params.assignment;
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let totalTime = 0;

    for (i=0; i < arr.length; i++){
        if (arr[i].subject == subject && arr[i].assignment == assignment){
            totalTime += Number(arr[i].duration);
        }
    }
    res.send(String(totalTime));
});

app.get('/get/times/tag/:tag', (req, res) =>{
    const tag = req.params.tag;
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let totalTime = 0;

    for (i=0; i < arr.length; i++){
        if (arr[i].tag == tag){
            totalTime += Number(arr[i].duration);
        }
    }
    res.send(String(totalTime));
});

app.get('/get/times/total', (req, res) =>{
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let totalTime = 0;

    for (i=0; i < arr.length; i++){
        totalTime = totalTime + Number(arr[i].duration);
    }
    res.send(String(totalTime));
});

app.get('/resume', (req, res) =>{
    if (UNIXTIMEONPAUSE > 0){
        let newTime = new Date;
        let newTimeProcessed = newTime.getTime();

        let deltaTime = (newTimeProcessed - UNIXTIMEONPAUSE)/1000;

        let resObj = {
            count:deltaTime,
            duration:DURATIONONPAUSE
        }

        res.send(resObj);
    }

    else{
        let resObj = JSON.stringify({
            count:0,
            duration:DURATIONONPAUSE
        })

        res.send(resObj);
    }

    UNIXTIMEONPAUSE = 0;
    DURATIONONPAUSE = 0;
});

app.get('/get/goals/subjects', (req, res) =>{
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/goals.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let currentSubject = '';
    let subjectList = [];

    for (i=0; i < arr.length; i++){
        currentSubject = arr[i].subject;
        if (subjectList.includes(currentSubject) == false){
            subjectList.push(currentSubject);
        }
    }
    res.send(subjectList);
});

app.get('/get/times/goals/subjects/:subject', (req, res) =>{
    const subject = req.params.subject;
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/goals.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    let totalTime = 0;

    for (i=0; i < arr.length; i++){
        if (arr[i].subject == subject){
            totalTime += Number(arr[i].duration);
        }
    }
    res.send(String(totalTime));
});

// Database POST Request handling
app.post('/post/newEntry', async (req, res) =>{
    // Declaring Variables
    const newEntryName = await req.body.name;
    const newEntrySubject = await req.body.subject;
    const newEntryAssignment = await req.body.assignment;
    const newEntryTag = await req.body.tag;
    const newEntryDuration = await req.body.duration;
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    const arr = Array.from(entries);

    const newEntryData = {
        name:newEntryName,
        subject:newEntrySubject,
        assignment:newEntryAssignment,
        tag:newEntryTag,
        duration:newEntryDuration
    }

    arr.push(newEntryData);
    entriesObj = JSON.stringify(arr, null, 4);
    fs.writeFileSync(__dirname + "/src/entries.json", entriesObj,'utf-8')

    res.sendStatus(200);
});

app.post('/post/clearEntries', async (req, res) =>{
    // Declaring Variables
    const fs = require('fs');

    // Reading Entries File
    let entriesObj = fs.readFileSync(__dirname + "/src/entries.json", 'utf-8');
    let entries = JSON.parse(entriesObj);
    let arr = Array.from(entries);
    arr = [];
    entriesObj = JSON.stringify(arr, null, 4);
    fs.writeFileSync(__dirname + "/src/entries.json", entriesObj,'utf-8')

    res.sendStatus(200);
});

app.post('/post/newGoal', async (req, res) =>{
    // Declaring Variables
    const newGoalSubject = await req.body.subject;
    const newGoalDuration = await req.body.duration;
    const fs = require('fs');

    // Reading Entries File
    let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", 'utf-8');
    let goals = JSON.parse(goalsObj);
    const arr = Array.from(goals);

    const newGoalData = {
        subject:newGoalSubject,
        duration:newGoalDuration
    }

    arr.push(newGoalData);
    goalsObj = JSON.stringify(arr, null, 4);
    fs.writeFileSync(__dirname + "/src/goals.json", goalsObj,'utf-8')

    res.sendStatus(200);
});

app.post('/post/editGoal', async (req, res) =>{
    const goalSubject = await req.body.subject;
    const newGoalDuration = await req.body.newDuration;

    const fs = require('fs');

    // Reading Entries File
    let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", 'utf-8');
    let goals = JSON.parse(goalsObj);
    const arr = Array.from(goals);

    for(i=0; i < arr.length; i++){
        if(arr[i].subject == goalSubject){
            arr[i].duration = newGoalDuration;
        }
    }

    goalsObj = JSON.stringify(arr, null, 4);
    fs.writeFileSync(__dirname + "/src/goals.json", goalsObj,'utf-8')

    res.sendStatus(200);
});

app.post('/post/removeGoal', async (req, res) =>{
    let goalToClear = await req.body.goal;

    const fs = require('fs');

    // Reading Entries File
    let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", 'utf-8');
    let goals = JSON.parse(goalsObj);
    let arr = Array.from(goals);

    for(i=0; i < arr.length; i++){
        if(goalToClear == arr[i].subject){
            arr.splice(i, 1)
        }
    }

    goalsObj = JSON.stringify(arr, null, 4);
    fs.writeFileSync(__dirname + "/src/goals.json", goalsObj,'utf-8')

    res.sendStatus(200);
});

app.post('/post/clearGoals', async (req, res) =>{
    // Declaring Variables
    const fs = require('fs');

    // Reading Entries File
    let goalsObj = fs.readFileSync(__dirname + "/src/goals.json", 'utf-8');
    let goals = JSON.parse(goalsObj);
    let arr = Array.from(goals);
    arr = [];
    goalsObj = JSON.stringify(arr, null, 4);
    fs.writeFileSync(__dirname + "/src/goals.json", goalsObj,'utf-8')

    res.sendStatus(200);
});

app.post('/pause', (req, res) =>{
    UNIXTIMEONPAUSE = req.body.unixtimeonpause;
    DURATIONONPAUSE = req.body.durationonpause;

    res.sendStatus(200);
});

// Starting server
app.listen(port, () => {
    console.log(`server active on 'http://localhost:${port}'`);
  });