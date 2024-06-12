window.onload = function() {
  output = document.getElementById('out');
  playpause = document.getElementById('play');

  timer;
  count = 0;

  getSubjectOptions()
  getTagOptions()
}

function startTimer(){
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
    let name = document.getElementById('timer').value;
    let subject = document.getElementById('subject').value;
    let assignment = document.getElementById('assignment').value;
    let tag = document.getElementById('tag').value;
    let length = (count).toFixed(0);

    let seconds = convertSeconds(length);

    document.title = 'Verso - Timer';
    
    // Data Validation:
    if (name == ''){
      alert("Please name this time entry");
    }
    else if (subject == ''){
      alert("Please set a subject for this time entry");
    }
    else if (assignment == ''){
      alert("Please set an assignment for this time entry");
    }

    else{
      // Saving entry data to database
      saveEntry(name, subject, assignment, tag, length);

      // Display new entry on timer dashboard
      displayEntry(name, subject, assignment, tag, seconds);

      // Reset timer
      clearInterval(timer);

      count = 0;
      output.innerHTML = "00:00:00";
      timer = null;
      playpause.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';

      document.getElementById('timer').value = '';
      document.getElementById('assignment').value = 'Standard';
      document.getElementById('subject').value = 'Subject';
      document.getElementById('tag').value = 'Tag';
      return;
    }
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

function saveEntry(name, subject, assignment, tag, length=0){
  //Sends entry data to server to save to database
  fetch(`http://localhost:2000/post/entries/${name}/${subject}/${assignment}/${tag}/${length}`)
    .then((response) => (response.json()))
    .then((json) => console.log(json));
}

function displayEntry(name, subject, assignment, tag, length){
  // Displays new entry data on timer dashboard
  const entryDiv = document.getElementById('entry-display');
  const newEntry = document.createElement('p');
  const entryText = `${name} </br> <hr> Subject: ${subject} </br> Assignment: ${assignment} </br> Tags: ${tag} </br> Length: ${length}`;
  newEntry.innerHTML = entryText;
  newEntry.className = 'entry-display-slave';
  newEntry.id = name;

  entryDiv.appendChild(newEntry);
  return 200
}

function getSubjectOptions(){
  const subjectSelector = document.getElementById('subject');
  const response = fetch("http://localhost:2000/get/entries/list")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let subjects = getSubjects(data)
            for (let i = 0; i < subjects.length; i++){
                // Generates cards to display each subject and respective time
                const subject = subjects[i];

                let newSubjectOption = document.createElement('option');
                newSubjectOption.innerText = subject;
                subjectSelector.appendChild(newSubjectOption);
            }
            let createSubjectOption = document.createElement('option');
            createSubjectOption.innerText = "+";
            createSubjectOption.id = 'new-subject-option';
            createSubjectOption.value = 'new';
            subjectSelector.appendChild(createSubjectOption);
        })
}

function getAssignmentOptions(){
  const assignmentSelector = document.getElementById('assignment');
  if (document.getElementsByClassName('generated-option').length > 0){
    clearOptions();
  }

  let subject = document.getElementById('subject').value;
  const response = fetch("http://localhost:2000/get/entries/list")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let assignments = getAssignments(data, subject);
            for (let i = 0; i < assignments.length; i++){
                // Generates cards to display each subject and respective time
                const assignment = assignments[i];

                let newAssignmentOption = document.createElement('option');
                newAssignmentOption.innerText = assignment;
                newAssignmentOption.className = "generated-option";
                assignmentSelector.appendChild(newAssignmentOption);

            }
            let createAssignmentOption = document.createElement('option');
            createAssignmentOption.innerText = "+";
            createAssignmentOption.id = 'new-assignment-option';
            createAssignmentOption.value = 'new';
            assignmentSelector.appendChild(createAssignmentOption);
        })
}

function clearOptions() {
  let options = document.getElementsByClassName('generated-option');
  while (options.length > 0){
      options[0].remove();
  }
  document.getElementById('new-option').remove();
}

function getTagOptions(){
  const tagSelector = document.getElementById('tag');
  const response = fetch("http://localhost:2000/get/entries/list")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let tags = getTags(data)
            for (let i = 0; i < tags.length; i++){
                // Generates cards to display each subject and respective time
                const tag = tags[i];

                let newTagOption = document.createElement('option');
                newTagOption.innerText = tag;
                tagSelector.appendChild(newTagOption);

            }
            let createTagOption = document.createElement('option');
            createTagOption.innerText = "+";
            createTagOption.id = 'new-tag-option';
            createTagOption.value = 'new';
            tagSelector.appendChild(createTagOption);
        })
}

function getSubjects(entryObj){
  // Gets list of all subjects
  let subjectList = []
  for (let i=0; i < entryObj.length; i++){
      let currentSubject = entryObj[i].subject;
      if (subjectList.includes(currentSubject) == false){
          subjectList.push(currentSubject);
      }
  }
  return subjectList
}

function getAssignments(entryObj, subject){
  // Gets list of all assignments
  let assignmentList = []
  for (let i=0; i < entryObj.length; i++){
      if (entryObj[i].subject == subject){
          let currentAssignment = entryObj[i].assignment;
          if (assignmentList.includes(currentAssignment) == false){
              assignmentList.push(currentAssignment);
          }
      }
  }
  return assignmentList
}

function getTags(entryObj){
  // Gets list of all assignments
  let tagsList = []
  for (let i=0; i < entryObj.length; i++){
      let currentTag = entryObj[i].tag;
      if (tagsList.includes(currentTag) == false){
          tagsList.push(currentTag);
      }
  }
  return tagsList
}

function createNewOption(selectorId){
  let selector = document.getElementById(selectorId);

  if (selector.value == 'new'){
    selector.remove();
    document.getElementById(`${selectorId}-input`).style.display = 'block';
    document.getElementById(`${selectorId}-input`).className = 'timer-new-option';
    document.getElementById(`${selectorId}-input`).id = selectorId
  }
}