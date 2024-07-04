window.onload = async function() {
  // Declaring Time Display and Play/Pause Button
  output = document.getElementById('out');
  playpause = document.getElementById('play');

  // Generate Static Options
  showSubjectOptions();
  showTagOptions();

  // Ask Server if Timer is already running
  let response = await fetch('/resume');
  let existingData = await response.json()
  
  // if Timer is already running add existing time and duration together
  count = Number(existingData.count) + (existingData.duration);

  timer = null;

  // If timer is already running, start timer
  if(existingData.duration > 0){
    startTimer();
  }

  // If timer is not already running, show default formatted time
  else{
    output.innerHTML = "00:00:00"
  }

}

window.onpagehide = async function() {
  // If timer is running while the page is hidden, Tell server current UNIX time and duration on timer
  if (count > 0){
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

  // Reset Page Title.
  document.title = 'Verso - Timer';

  // Format Time Data to save into json file
  const entryData = JSON.stringify({
      name: name,
      subject: subject,
      assignment: assignment,
      tag: tag,
      duration: length
    })

  // Format Entry data to display to user
  const displayEntryData = JSON.stringify({
    name: name,
    subject: subject,
    assignment: assignment,
    tag: tag,
    duration: seconds
  })

  // Send entry data to Server to save in json file
  fetch("/post/newEntry", {
      method: "POST",
      body: entryData,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

  // Reset serverside time to 0
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

  // display user friendly formatted data
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

  // Declaring Display Variables
  var hours_display = 0;
  var minutes_display = 0;
  var seconds_display = 0;

  // Set Display Variables
  hours_display = hours.toString().padStart(2,"0");
  minutes_display = minutes.toString().padStart(2,"0");
  seconds_display = (seconds-(minutes*60)-(hours*3600)).toString().padStart(2,"0");

  //Return formatted string
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
  const entryText = `${name} </br> <hr> Subject: ${subject} </br> Assignment: ${assignment} </br> Tags: ${tag} </br> Length: ${length}`;
  newEntry.innerHTML = entryText;
  newEntry.className = 'entry-display-slave';
  newEntry.id = name;

  entryDiv.appendChild(newEntry);
}

async function showSubjectOptions(){

  //Get list of subjects from Server
  const subjectSelector = document.getElementById('subject');
  const response = await fetch(`/get/subjects`);
  const subjectList = await response.json();

  // create option for each subject and add it to option menu
  for (i=0; i<subjectList.length; i++){
      let newOption = document.createElement("option");
      newOption.value = subjectList[i];
      newOption.innerText = subjectList[i];
      subjectSelector.appendChild(newOption);
  }
  
  // create "New option" option
    let newSubjectOption = document.createElement("option");
    newSubjectOption.value = 'new';
    newSubjectOption.innerText = '+';
    subjectSelector.appendChild(newSubjectOption);
}

async function showTagOptions(){
  
  // Get list of tags from server
  const tagSelector = document.getElementById('tag');
  const response = await fetch(`/get/tags`);
  const tagList = await response.json();

  // Create options for each tag and display it to user
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

  // Clear any previously generated options
  clearGeneratedOptions()

  const assignmentSelector = document.getElementById('assignment');
  const subjectSelector = document.getElementById('subject');

  // Get list of assignments from selected subject from server
  const response = await fetch(`/get/assignments/${subjectSelector.value}`);
  const assignmentList = await response.json();

  // generate option for each assignment
  for (i=0; i<assignmentList.length; i++){
      let newOption = document.createElement("option");
      newOption.value = assignmentList[i];
      newOption.innerText = assignmentList[i];
      newOption.className = 'created';
      console.log(newOption.className);
      assignmentSelector.appendChild(newOption);
  }
  // Generating New Assignment Option
  let newAssignmentOption = document.createElement("option");
  newAssignmentOption.value = 'new';
  newAssignmentOption.innerText = '+';
  newAssignmentOption.className = 'created';
  console.log(newAssignmentOption.className)
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

function clearGeneratedOptions(){
  // clear any existing options that have been generated by program
  const generatedOptionsList = document.getElementsByClassName('created');

  console.log(generatedOptionsList.length);

  while (generatedOptionsList.length > 0){
    generatedOptionsList[0].remove()
  }
}