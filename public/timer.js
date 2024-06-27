window.onload = async function() {
  output = document.getElementById('out');
  playpause = document.getElementById('play');

  // Check if timer is already running;
  let response = await fetch('/resume');
  let existingData = await response.json()
  count = Number(existingData.count) + (existingData.duration);

  timer = null;

  if(existingData.count > 1){
    startTimer();
  }

else{
  output.innerHTML = "00:00:00"
}

  // Generate Static Options
  showSubjectOptions();
  showTagOptions()
}

window.onpagehide = async function() {
  const TIMEOFPAUSE = new Date;
  const TIMEOFPAUSEPROCESSED = TIMEOFPAUSE.getTime();

  fetch("/pause", {
    method:"POST",
    body: JSON.stringify({
      unixtimeonpause: TIMEOFPAUSEPROCESSED,
      durationonpause: count
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
}

async function startTimer(){
let seconds = 0;
  if (timer) {
      clearInterval(timer);
      timer = null;
      playpause.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
      return;
  }
  playpause.innerHTML = '<span class="material-symbols-outlined">pause</span>';
  timer = window.setInterval(function(){
      count++;
      seconds = count.toFixed(0);
      document.title = `Verso - Timer (${convertSeconds(seconds)})`;
      output.innerHTML = convertSeconds(seconds);
  }, 1000);
};

function stopTimer(){
  // Declaration of variables
  let name = document.getElementById('timer').value;
  let subject = document.getElementById('subject').value;
  let assignment = document.getElementById('assignment').value;
  let tag = document.getElementById('tag').value;
  let length = (count).toFixed(0);

  // Converts entry length to be displayed to user
  let seconds = convertSeconds(length);

  document.title = 'Verso - Timer';

  const entryData = JSON.stringify({
      name: name,
      subject: subject,
      assignment: assignment,
      tag: tag,
      duration: length
    })

  const displayEntryData = JSON.stringify({
    name: name,
    subject: subject,
    assignment: assignment,
    tag: tag,
    duration: seconds
  })

  fetch("/post/newEntry", {
      method: "POST",
      body: entryData,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

  fetch("/pause", {
    method:"POST",
    body: JSON.stringify({
      unixtimeonpause: 0,
      durationonpause: 0
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });

  displayEntry(displayEntryData);

  // Resets timer variable
  clearInterval(timer);

  // Resets frontend timer
  count = 0;
  output.innerHTML = "00:00:00";
  timer = null;
  playpause.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
};

function convertSeconds(seconds){
  // Converts seconds to hours and minutes to display to user.
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor(seconds % 3600 / 60);

  var hours_display = 0;
  var minutes_display = 0;
  var seconds_display = 0;

  hours_display = hours.toString().padStart(2,"0");
  minutes_display = minutes.toString().padStart(2,"0");
  seconds_display = (seconds-(minutes*60)-(hours*3600)).toString().padStart(2,"0");

  return `${hours_display}:${minutes_display}:${seconds_display}`
}

function displayEntry(entryDataJson){
  let entryData = JSON.parse(entryDataJson);

  // Separating entry data
  const name = entryData.name;
  const subject = entryData.subject;
  const assignment = entryData.assignment;
  const tag = entryData.tag;
  const length = entryData.duration;

  // Displays new entry data on timer dashboard
  const entryDiv = document.getElementById('entry-display');
  const newEntry = document.createElement('p');
  const entryText = `${name} </br> <hr> Subject: ${subject} </br> Assignment: ${assignment} </br> Tags: ${tag} </br> Length: ${convertSeconds(length)}`;
  newEntry.innerHTML = entryText;
  newEntry.className = 'entry-display-slave';
  newEntry.id = name;

  entryDiv.appendChild(newEntry);
}

async function showSubjectOptions(){
  const subjectSelector = document.getElementById('subject');
  const response = await fetch(`/get/subjects`);
  const subjectList = await response.json();

  for (i=0; i<subjectList.length; i++){
      let newOption = document.createElement("option");
      newOption.value = subjectList[i];
      newOption.innerText = subjectList[i];
      subjectSelector.appendChild(newOption);
  }
    let newSubjectOption = document.createElement("option");
    newSubjectOption.value = 'new';
    newSubjectOption.innerText = '+';
    subjectSelector.appendChild(newSubjectOption);
}

async function showTagOptions(){
  const tagSelector = document.getElementById('tag');
  const response = await fetch(`/get/tags`);
  const tagList = await response.json();

  for (i=0; i<tagList.length; i++){
      let newOption = document.createElement("option");
      newOption.value = tagList[i];
      newOption.innerText = tagList[i];
      tagSelector.appendChild(newOption);
  }
  // Generating New Assignment Option
  let newTagOption = document.createElement("option");
  newTagOption.value = 'new';
  newTagOption.innerText = '+';
  tagSelector.appendChild(newTagOption);
}

async function showAssignmentOptions(){
  const assignmentSelector = document.getElementById('assignment');
  const subjectSelector = document.getElementById('subject');

  const response = await fetch(`/get/assignments/${subjectSelector.value}`);
  const assignmentList = await response.json();

  for (i=0; i<assignmentList.length; i++){
      let newOption = document.createElement("option");
      newOption.value = assignmentList[i];
      newOption.innerText = assignmentList[i];
      assignmentSelector.appendChild(newOption);
  }
  // Generating New Assignment Option
  let newAssignmentOption = document.createElement("option");
  newAssignmentOption.value = 'new';
  newAssignmentOption.innerText = '+';
  assignmentSelector.appendChild(newAssignmentOption);
}

function createNewOption(id){
  const selector = document.getElementById(id);
  const selectorInput = document.getElementById(`${id}-input`);

  if (selector.value == "new"){
      selector.remove();
      selectorInput.style.display="block";
      selectorInput.id = id;
  }
}